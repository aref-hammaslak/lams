import mongoose from "mongoose";

import EquipmentLogModel from "../models/EquipmentLog.js";
import LogTemplate from "../models/LogTemplate.js";
import Equipment from "../models/Equipment.js";
import ExpressError from "../utils/ExpressError.js";

import { canUserChangeOther, canUserChangeDeleted } from "../services/userRole.js";
import { getUserById } from "../services/user.js";

import { groupBy } from "../utils/arrayUtils.js";

const logNotFoundError = new ExpressError('Equipment log not found in lab', 404);

/**
 * @type {import("express").RequestHandler}
 */
export async function getAllEquipmentLogs(req, res) {
    const { _id: userId, lab_id } = req.user;

    const queries = {
        userId: req.query['user_id'] ? new mongoose.Types.ObjectId(req.query['user_id']) : undefined,
        tempId: req.query['temp_id'] ? new mongoose.Types.ObjectId(req.query['temp_id']) : undefined,
        schID: req.query['sch_id'] ? new mongoose.Types.ObjectId(req.query['sch_id']) : undefined,
        startDate: req.query['start_date'] ? new Date(req.query['start_date']) : undefined,
        endDate: req.query['end_date'] ? new Date(req.query['end_date']) : undefined,
        groupBy: req.query['group_by'],
        self: (req.query['self'] === 'true') ? true : false
    };

    const pipeline = [
        {
            $lookup: {
                from: 'logtemplates',
                localField: 'temp_id',
                foreignField: '_id',
                as: 'temp_details',
                pipeline: [
                    {
                        $project: {
                            '_id': 0,
                            'eq_id': 1,
                            'type': 1
                        }
                    }
                ]
            }
        },
        {
            $lookup: {
                from: 'equipment',
                localField: 'temp_details.eq_id',
                foreignField: '_id',
                as: 'eq_details',
                pipeline: [
                    {
                        $project: {
                            '_id': 0,
                            'name': 1,
                            'lab_id': 1
                        }
                    }
                ]
            }
        },
        {
            $match: {
                'eq_details.lab_id': {
                    $eq: lab_id
                }
            }
        }
    ];
    if (queries.userId || queries.self) {
        pipeline.push({
            $match: {
                user_id: {
                    $eq: queries.self ? userId : queries.userId
                }
            }
        });
    }
    if (queries.tempId) {
        pipeline.push({
            $match: {
                temp_id: {
                    $eq: queries.tempId
                }
            }
        });
    }
    if (queries.startDate) {
        pipeline.push({
            $match: {
                date: {
                    $gte: queries.startDate
                }
            }
        });
    }
    if (queries.endDate) {
        pipeline.push({
            $match: {
                date: {
                    $lte: queries.endDate
                }
            }
        });
    }
    if(queries.schID){
        pipeline.push({
            $match:{
                sch_id: {
                    $eq: queries.schID
                }
            }
        })
    }

    const result = await EquipmentLogModel.aggregate(pipeline);

    res.send({
        success: true,
        payload: queries.groupBy ? groupBy(result, queries.groupBy) : result,
    });
}

/**
 * @type {import('express').RequestHandler}
 */
export async function createEquipmentLog(req, res) {
    const { _id: userId, lab_id: labId } = req.user;
    const data = req.body;

    if (!await isLogTempInLab(data.temp_id, labId)) {
        throw new ExpressError('Log template not found in lab', 400);
    }

    if ('user_id' in data) {
        const targetUser = await getUserById(data.user_id);
        if (!targetUser || !await canUserChangeOther(req.user, targetUser)) {
            throw new ExpressError(`Not allowed to set user_id to ${data.user_id}`, 401);
        }
    } else {
        data.user_id = userId;
    }

    const equipmentLog = new EquipmentLogModel(data);

    try {
        await equipmentLog.save();
    } catch (error) {
        if (error.name === 'Error') {
            throw new ExpressError(error.message, 400);
        }
        throw error;
    }

    res.send({
        success: true,
        payload: equipmentLog
    });
}

/**
 * @type {import('express').RequestHandler}
 */
export async function getEquipmentLog(req, res) {
    const { lab_id: labId } = req.user;
    const logId = req.params.logId;

    const equipmentLog = await EquipmentLogModel.findById(logId);
    if (!equipmentLog || !await isLogTempInLab(equipmentLog.temp_id, labId)) {
        throw logNotFoundError;
    }

    res.send({
        success: true,
        payload: equipmentLog
    });
}

/**
 * @type {import('express').RequestHandler}
 */
export async function deleteEquipmentLog(req, res) {
    const { lab_id: labId } = req.user;
    const logId = req.params.logId;

    const equipmentLog = await EquipmentLogModel.findById(logId);
    if (!equipmentLog || !await isLogTempInLab(equipmentLog.temp_id, labId)) {
        throw logNotFoundError;
    }

    const logCreator = await getUserById(equipmentLog.user_id);
    if (!logCreator) {
        if (!canUserChangeDeleted(req.user)) {
            throw new ExpressError(`User not allowed to delete this log made by deleted user`, 401);
        }
    } else if (!await canUserChangeOther(req.user, logCreator)) {
        throw new ExpressError(`User not allowed to delete this log`, 401);
    }

    await equipmentLog.deleteOne();

    res.send({
        success: true,
        payload: equipmentLog
    });
}

/**
 * @type {import('express').RequestHandler}
 */
export async function updateEquipmentLog(req, res) {
    const { _id: userId, lab_id: labId } = req.user;
    const data = req.body;
    const logId = req.params.logId;

    const equipmentLog = await EquipmentLogModel.findById(logId);
    if (!equipmentLog || !await isLogTempInLab(equipmentLog.temp_id, labId)) {
        throw logNotFoundError;
    }

    // if ('user_id' in data) {
    //     const logCreator = await getUserById(data.user_id);
    //     if (!logCreator) {
    //         if (!canUserChangeDeleted(req.user)) {
    //             throw new ExpressError(`User not allowed to delete this log made by deleted user`, 401);
    //         }
    //     } else if (!await canUserChangeOther(req.user, logCreator)) {
    //         throw new ExpressError(`User not allowed to delete this log`, 401);
    //     }
    // } else {
    //     data.user_id = userId;
    // }


    const logCreator = await getUserById(equipmentLog.user_id);
    if (!logCreator) {
        if (!canUserChangeDeleted(req.user)) {
            throw new ExpressError(`User not allowed to delete this log made by deleted user`, 401);
        }
    }
    if (!await canUserChangeOther(req.user, logCreator)) {
        throw new ExpressError(`User not allowed to update this log`, 401);
    }

    try {
        await equipmentLog.updateOne(data, { runValidators: true });
    } catch (error) {
        switch (error.name) {
            case 'Error':
            case 'ValidationError':
                throw new ExpressError(error.message, 400);
            default:
                throw error;
        }
    }

    res.send({
        success: true,
        payload: await EquipmentLogModel.findById(equipmentLog._id),
    });
}

async function isLogTempInLab(tempId, labId) {
    const temp = await LogTemplate.findById(tempId);
    if (!temp) {
        return false;
    }

    const eq = await Equipment.findById(temp.eq_id);
    if (!eq) {
        return false;
    }

    return eq.lab_id.equals(labId);
}