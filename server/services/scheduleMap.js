import mongoose from "mongoose";

import ScheduleMapModel from "../models/ScheduleMap.js";

export async function getScheduleMapById(labId, id) {
    const result = await ScheduleMapModel.aggregate([
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
                    $eq: new mongoose.Types.ObjectId(labId)
                }
            }
        },
        {
            $match: {
                'item_sch.lab_id': {
                    $eq: new mongoose.Types.ObjectId(labId)
                }
            }
        },
        {
            $match: {
                _id: {
                    $eq: new mongoose.Types.ObjectId(id)
                }
            }
        }
    ]);

    return result.pop();
}

export async function getScheduleMapsForDate(date, userId, itemType, itemId) {
    userId = new mongoose.Types.ObjectId(userId);
    itemId = new mongoose.Types.ObjectId(itemId);

    const result = await ScheduleMapModel.aggregate([
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
                date: {
                    $eq: date
                }
            }
        },
        {
            $match: {
                'item_sch.type': {
                    $eq: itemType
                }
            }
        },
        {
            $match: {
                'item_sch.id': {
                    $eq: itemId
                }
            }
        },
        {
            $match: {
                'user_sch.id': {
                    $eq: userId
                }
            }
        }
    ]);

    return result;
}