import ScheduleMapModel from "../models/ScheduleMap.js";

import { groupBy } from "../utils/arrayUtils.js";
import ExpressError from "../utils/ExpressError.js";

import { getScheduleMapById } from "../services/scheduleMap.js";
import { isScheduleInLab } from "../services/schedule.js";
import { isUserInLab } from "../services/user.js";

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
                from: 'users',
                localField: 'user_id',
                foreignField: '_id',
                as: 'user',
            },
        },
        {
            $lookup: {
                from: 'schedules',
                localField: 'sch_id',
                foreignField: '_id',
                as: 'sch'
            },
        },
        {
            $unwind: '$sch'

        },
        {
            $unwind: '$user'
        },
        {
            $match: {
                'user.lab_id': {
                    $eq: lab_id
                }
            }
        },
        {
            $match: {
                'sch.lab_id': {
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
                from: 'users',
                localField: 'user_id',
                foreignField: '_id',
                as: 'user',
            },
        },
        {
            $lookup: {
                from: 'schedules',
                localField: 'sch_id',
                foreignField: '_id',
                as: 'sch'
            },
        },
        {
            $match: {
                'user.lab_id': {
                    $eq: lab_id
                },
                // 'user._id': {
                //     $eq: req.user._id
                // }
            }
        },
        {
            $match: {
                'sch.lab_id': {
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
                user: 0,
                sch: 0
            }
        });
    }

    const result = await ScheduleMapModel.aggregate(aggregationPipeline);
    // const result = await ScheduleMapModel.find();
    // console.log(result);

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
        const { date, user_id, sch_ids } = req.body;

        if (!isUserInLab(user_id, lab_id)) {
            throw new ExpressError('User  not found in lab', 400);
        }

        const success = [];
        const failure = [];

        for (const sch_id of sch_ids) {
            if (!isScheduleInLab(sch_id, lab_id)) {
                failure.push({
                    sch_id,
                    error: 'Schedule not found in lab'
                });
                continue;
            }

            const schedMap = new ScheduleMapModel({ date, user_id, sch_id });
            try {
                const duplicateAssignemtn = await ScheduleMapModel.find({ date, sch_id });
                console.log("🚀 ~ createScheduleMap ~ duplicateAssignemtn:", duplicateAssignemtn)
                
                if (duplicateAssignemtn.length > 0) throw new Error("This item already has been assigned to a user");
                
                await schedMap.save();
            } catch (err) {
                failure.push({
                    sch_id,
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
        const { userid, sch_id } = data;

        if (!isUserInLab(user_id, lab_id)) {
            throw new ExpressError('User schedule assignment not found in lab', 400);
        }
        if (!isScheduleInLab(sch_id, lab_id)) {
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
