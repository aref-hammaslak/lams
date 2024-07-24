import ScheduleMapModel from "../models/ScheduleMap.js";

import { groupBy } from "../utils/arrayUtils.js";
import ExpressError from "../utils/ExpressError.js";

import { getScheduleMapById } from "../services/scheduleMap.js";
import { isScheduleInLab } from "../services/schedule.js";

/**
 * @type {import("express").RequestHandler}
 */
export async function getAllScheduleMap(req, res) {
    const { lab_id } = req.user;

    const startDate = ('start-date' in req.query) ? new Date(req.query['start-date']) : undefined;
    const endDate = ('end-date' in req.query) ? new Date(req.query['end-date']) : undefined;
    const expand = (req.query.expand == 'true');
    const groupedBy = req.query['group-by'];

    if (startDate == null || endDate == null) {
        throw new ExpressError('Missing start-date/end-date query', 400);
    }

    const aggregationPipeline = [
        {
            $lookup: {
                from: 'schedules',
                localField: 'user_sch_id',
                foreignField: '_id',
                as: 'user_sch',
            },
        },
        {
            $lookup: {
                from: 'schedules',
                localField: 'item_sch_id',
                foreignField: '_id',
                as: 'item_sch'
            },
        },
        {
            $match: {
                'user_sch.lab_id': {
                    $eq: lab_id
                }
            }
        },
        {
            $match: {
                'item_sch.lab_id': {
                    $eq: lab_id
                }
            }
        }
    ];
    if (startDate) {
        aggregationPipeline.push({
            $match: {
                date: {
                    $gte: startDate
                }
            }
        });
    }
    if (endDate) {
        aggregationPipeline.push({
            $match: {
                date: {
                    $lte: endDate
                }
            }
        });
    }
    if (!expand) {
        aggregationPipeline.push({
            $project: {
                user_sch: 0,
                item_sch: 0
            }
        });
    }

    const result = await ScheduleMapModel.aggregate(aggregationPipeline);

    res.send({
        success: true,
        payload: (groupedBy) ? groupBy(result, groupedBy) : result
    });
}

/**
 * @type {import("express").RequestHandler}
 */
export async function getMyScheduleMaps(req, res) {
    const { lab_id } = req.user;

    const startDate = ('start-date' in req.query) ? new Date(req.query['start-date']) : undefined;
    const endDate = ('end-date' in req.query) ? new Date(req.query['end-date']) : undefined;
    const expand = (req.query.expand === 'true');
    const groupedBy = req.query['group-by'];

    if (startDate == null || endDate == null) {
        throw new ExpressError('Missing start-date/end-date query', 400);
    }

    const aggregationPipeline = [
        {
            $lookup: {
                from: 'schedules',
                localField: 'user_sch_id',
                foreignField: '_id',
                as: 'user_sch',
            },
        },
        {
            $lookup: {
                from: 'schedules',
                localField: 'item_sch_id',
                foreignField: '_id',
                as: 'item_sch'
            },
        },
        {
            $match: {
                'user_sch.lab_id': {
                    $eq: lab_id
                },
                'user_sch.id': {
                    $eq: req.user._id
                }
            }
        },
        {
            $match: {
                'item_sch.lab_id': {
                    $eq: lab_id
                }
            }
        }
    ];
    if (startDate) {
        aggregationPipeline.push({
            $match: {
                date: {
                    $gte: startDate
                }
            }
        });
    }
    if (endDate) {
        aggregationPipeline.push({
            $match: {
                date: {
                    $lte: endDate
                }
            }
        });
    }
    if (!expand) {
        aggregationPipeline.push({
            $project: {
                user_sch: 0,
                item_sch: 0
            }
        });
    }

    const result = await ScheduleMapModel.aggregate(aggregationPipeline);

    res.send({
        success: true,
        payload: (groupedBy) ? groupBy(result, groupedBy) : result
    });
}

/**
 * @type {import("express").RequestHandler}
 */
export async function createScheduleMap(req, res) {
    const { lab_id } = req.user;

    const bulk = (req.query.bulk == 'true');

    if (bulk) {
        const { date, user_sch_id, item_sch_ids } = req.body;

        if (!isScheduleInLab(user_sch_id, lab_id)) {
            throw new ExpressError('User schedule assignment not found in lab', 400);
        }

        const success = [];
        const failure = [];

        for (const item_sch_id of item_sch_ids) {
            if (!isScheduleInLab(item_sch_id, lab_id)) {
                failure.push({
                    item_sch_id,
                    error: 'Schedule not found in lab'
                });
                continue;
            }

            const schedMap = new ScheduleMapModel({ date, user_sch_id, item_sch_id });
            try {
                await schedMap.save();
            } catch (err) {
                failure.push({
                    item_sch_id,
                    error: err.message
                });
                continue;
            }
            success.push(schedMap);
        }

        res.send({
            success: 200,
            payload: {
                sch_maps: success,
                errors: failure
            }
        });
    } else {
        const data = req.body;
        const { user_sch_id, item_sch_id } = data;

        if (!isScheduleInLab(user_sch_id, lab_id)) {
            throw new ExpressError('User schedule assignment not found in lab', 400);
        }
        if (!isScheduleInLab(item_sch_id, lab_id)) {
            throw new ExpressError('Item schedule assignment not found in lab', 400);
        }

        const schedMap = new ScheduleMapModel({ ...data });
        try {
            await schedMap.save();
        } catch (err) {
            throw new ExpressError(err.message, 400);
        }

        res.send({
            success: true,
            payload: schedMap,
        });
    }
}

export async function deleteScheduleMap(req, res) {
    const { lab_id } = req.user;

    const { id } = req.params;

    let schedMap = await getScheduleMapById(lab_id, id);
    if (schedMap == null) {
        throw new ExpressError('Schedule map not found', 404);
    }

    schedMap = await ScheduleMapModel.findByIdAndDelete(schedMap._id);

    res.send({
        success: true,
        payload: schedMap
    });
}

export async function updateScheduleMap(req, res) {
    const { lab_id } = req.user;

    const { id } = req.params;
    const updates = req.body;

    let schedMap = await getScheduleMapById(lab_id, id);
    if (schedMap == null) {
        throw new ExpressError('Schedule map not found', 404);
    }

    schedMap = await ScheduleMapModel.findByIdAndUpdate(schedMap._id, updates, { new: true });
    res.send({
        success: true,
        payload: schedMap
    });
}
