import moment from "moment";
import "moment-recur";
import dayjs from 'dayjs';

import { ScheduleModel } from "../models/Schedule.js";

import LogTemplate from "../models/LogTemplate.js";
import User from "../models/User.js";
import Thermometer from "../models/Thermometer.js";
import Surface from "../models/Surface.js";
import Equipment from "../models/Equipment.js";

import { groupBy } from "../utils/arrayUtils.js";
import mongoose from "mongoose";
import { RECCURENCES } from "./logTemplate.js";

/**
 * @type {import("express").RequestHandler}
 */
export async function getSchedule(req, res) {
    const { lab_id } = req.user;
    const { type, id } = req.params;

    const startDate = ('start-date' in req.query) ? new Date(req.query['start-date']) : undefined;
    const endDate = ('end-date' in req.query) ? new Date(req.query['end-date']) : undefined;
    const raw = req.query.raw;
    const grpBy = req.query['group-by'];

    if (! await validateItem(type, id, lab_id)) {
        res.status(404);
        res.send({
            success: false,
            error: 'Item not found'
        });

        return;
    }

    if (raw != 'true' && (startDate == undefined || endDate == undefined)) {
        res.send({
            success: false,
            error: 'Queries start-data and end-date both must be defined or raw be set to true'
        });

        return;
    }

    const sched = await ScheduleModel.find({ lab_id, type, id });
    if (startDate == undefined || endDate == undefined) {
        res.send({
            success: true,
            payload: sched
        });
    } else {
        const assignments = sched.flatMap(val => expandAssignment(val, startDate, endDate, (raw == 'true')));

        res.send({
            success: true,
            payload: (grpBy) ? groupBy(assignments, grpBy) : assignments,
        });
    }
}

/**
 * @type {import("express").RequestHandler}
 */
export async function getWholeSchedule(req, res) {
    const { lab_id } = req.user;

    const startDate = ('start-date' in req.query) ? new Date(req.query['start-date']) : undefined;
    const endDate = ('end-date' in req.query) ? new Date(req.query['end-date']) : undefined;
    const expandItem = req.query['expand-item'];
    const type = req.query.type;
    const item = req.query.item;
    const raw = req.query.raw;
    const grpBy = req.query['group-by'];

    if (raw != 'true' && (startDate == undefined || endDate == undefined)) {
        res.send({
            success: false,
            error: 'Queries start-data and end-date both must be defined or raw be set to true'
        });

        return;
    }

    const filter = {
        lab_id
    };
    if (type) {
        filter.type = type;
    }
    if (item) {
        filter.id = item;
    }

    const sched = await ScheduleModel.find(filter);
    if (startDate == undefined || endDate == undefined) {
        res.send({
            success: true,
            payload: sched
        });
    } else {
        const assignments = sched.flatMap(val => expandAssignment(val, startDate, endDate, (raw == 'true'), true));

        if (expandItem == 'true') {
            const items = await expandItemDetails(assignments);

            res.send({
                success: true,
                payload: {
                    schedule: (grpBy) ? groupBy(assignments, grpBy) : assignments,
                    items: items
                }
            });

            return;
        }

        res.send({
            success: true,
            payload: (grpBy) ? groupBy(assignments, grpBy) : assignments,
        });
    }
}

/**
 * @type {import("express").RequestHandler}
 */
export async function setScheduleAssignment(req, res) {
    const { lab_id } = req.user;
    const { type, id } = req.params;
    const { recurrence, offsets } = req.body;

    const initial_date = new Date(req.body['initial_date']);
    const end_date = (req.body.end_date) ? new Date(req.body['end_date']) : undefined;
    try {
        if (! await validateItem(type, id, lab_id)) {
            res.status(404);
            res.send({
                success: false,
                error: 'Item not found'
            });

            return;
        }
        
        if (type === 'equipment') {
            const logTemp = await LogTemplate.findById(id);
            if (RECCURENCES[logTemp.type] !== recurrence) {
                return res.status(400).send({
                    success: false,
                    error: `You can not set a ${recurrence} schedule for ${RECCURENCES[logTemp.type]} log template`
                })
            }
        }
        
        //make sure there is no overlap with same schedules
        if (await isOverlappingWithOtherSchedules({lab_id, id, type, recurrence,initial_date, end_date})) {
            return res.status(400).send({
                success: false,
                error: 'There is overlap with other schedules'
            })
        }

        

        const sched = new ScheduleModel({
            lab_id,
            initial_date,
            recurrence,
            end_date,
            type,
            id,
            offsets
        });
        await sched.save();


        res.send({
            success: true,
            payload: sched
        });
    } catch (error) {
        console.log(error);
        res.status(400).send({
            success: false,
            error
        })
    }

}

/**
 * @type {import("express").RequestHandler}
 */
export async function getScheduleAssignment(req, res) {
    const { lab_id } = req.user;
    const { id } = req.params;

    const sched = await ScheduleModel.findOne({ _id: id, lab_id });
    res.send({
        success: true,
        payload: sched
    });
}

/**
 * @type {import("express").RequestHandler}
 */
export async function updateScheduleAssignment(req, res) {
    const { lab_id } = req.user;
    const { id } = req.params;
    const updates = req.body;

    const sched = await ScheduleModel.findOneAndUpdate({ _id: id, lab_id }, updates, { new: true });
    res.send({
        success: true,
        payload: sched
    });
}

/**
 * @type {import("express").RequestHandler}
 */
export async function deleteScheduleAssignment(req, res) {
    const { lab_id } = req.user;
    const { id } = req.params;

    const sched = await ScheduleModel.findOneAndDelete({ _id: id, lab_id }, {}, { new: true });
    res.send({
        success: true,
        payload: sched
    });
}

async function isOverlappingWithOtherSchedules({ lab_id, id, type, recurrence, initial_date, end_date }) {
    const { ObjectId } = mongoose.Types;

    const result = await ScheduleModel.aggregate([
        {
            $match: {
                lab_id: new ObjectId(lab_id),
                type: type,
                id: new ObjectId(id),
                recurrence: recurrence,
                $or: [
                    // Case 1: The document's initial_date is within the given range
                    {
                        $and: [
                            {
                                initial_date: { $gte: new Date(initial_date) }
                            },
                            {
                                initial_date: { $lt: new Date(end_date) }
                            }
                        ]
                    },
                    // Case 2: The document's end_date is within the given range
                    {
                        $and: [
                            {
                                end_date: { $gt: new Date(initial_date) }
                            },
                            {
                                end_date: { $lte: new Date(end_date) }
                            }
                        ]
                    },
                    // Case 3: The document's range entirely covers the given range
                    {
                        $and: [
                            {
                                initial_date: { $lte: new Date(initial_date) }
                            },
                            {
                                end_date: { $gte: new Date(end_date) }
                            }
                        ]
                    }
                ]
            }
        }]);
    console.log(result);
    console.log(result.length > 0);
    
    return result.length > 0;
}

function expandAssignment(val, startDate, endDate, raw = false, includeId = false) {
    if ((val.recurrence && val.initial_date <= endDate)) {
        if (raw)
            return val;

        const m = moment(val.initial_date);

        let interval = m.recur(null, moment(endDate));
        switch (val.recurrence) {
            case 'daily':
                interval = interval.every(1).day();
                break;
            case 'weekly':
                // const end = moment(new Date(val.initial_date.getFullYear(), val.initial_date.getMonth() + 1, 0));
                // interval = m.recur(null, end).every(1).week();

                interval = interval.every(1).week();
                break;
            case 'monthly':
                interval = interval.every(1).month();
                break;
            case 'quarterly':
                interval = interval.every(3).month();
                break;
            case 'semiannually':
                interval = interval.every(6).month();
                break;
            case 'annually':
                interval = interval.every(1).year();
                break;
        }

        return interval.all().flatMap(m => {
            // TODO optimize start date of recurrence instead of simply filtering
            if (m >= startDate && m <= endDate) {
                if (val.end_date && m >= val.end_date) {
                    return [];
                }

                const date = m.toDate();

                for (const offset of val.offsets) {
                    if (date.getTime() == offset.date.getTime()) {
                        date.setUTCDate(date.getUTCDate() + offset.offset);
                    }
                }

                return {
                    date,
                    recurrence: val.recurrence,
                    type: (includeId) ? val.type : undefined,
                    id: (includeId) ? val.id : undefined,
                    _id: val._id
                };
            }

            return [];
        });
    }

    if (startDate <= val.initial_date && val.initial_date <= endDate) {
        if (raw)
            return val;

        return {
            date: val.initial_date,
            type: (includeId) ? val.type : undefined,
            id: (includeId) ? val.id : undefined,
            _id: val._id
        };
    }

    return [];
}

async function expandItemDetails(assignments) {
    const idMap = {};

    for (const val of assignments) {
        let model;

        const type = val.type;
        let id = val.id;
        switch (type) {
            case 'equipment':
                const logTemp = await LogTemplate.findOne({ _id: id });
                if (logTemp == null) {
                    return false;
                }

                id = logTemp.eq_id;
                model = Equipment;
                break;
            case 'user':
                model = User;
                break;
            case 'thermometer':
                model = Thermometer;
                break;
            case 'surface':
                model = Surface;
                break;
        }

        if (!(type in idMap)) {
            idMap[type] = {};
        }
        if (!(val.id in idMap[type])) {
            const item = await model.findById(id, { _id: 0, name: 1, roles: 1 });

            idMap[type][val.id] = item;
        }
    }

    return idMap;
}

async function validateItem(type, id, lab_id) {
    let model;
    switch (type) {
        case 'equipment':
            const logTemp = await LogTemplate.findOne({ _id: id });
            if (logTemp == null) {
                return false;
            }

            id = logTemp.eq_id;
            model = Equipment;
            break;
        case 'user':
            model = User;
            break;
        case 'thermometer':
            model = Thermometer;
            break;
        case 'surface':
            model = Surface;
            break;
    }

    const item = await model.findOne({ _id: id, lab_id });
    return (item != null);
}