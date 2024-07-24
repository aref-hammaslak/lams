import mongoose from "mongoose";

import SurfaceLogModel from "../models/SurfaceLog.js";
import SurfaceModel from "../models/Surface.js";

import ExpressError from "../utils/ExpressError.js";

import { canUserChangeOther, canUserChangeDeleted } from "../services/userRole.js";
import { getUserById } from "../services/user.js";

import { groupBy } from "../utils/arrayUtils.js";

const logNotFoundError = new ExpressError('Surface log not found in lab', 404);

/**
 * @type {import("express").RequestHandler}
 */
export async function getAllSurfaceLogs(req, res) {
    const { _id: userId, lab_id } = req.user;

    const queries = {
        userId: req.query['user-id'] ? new mongoose.Types.ObjectId(req.query['user-id']) : undefined,
        surfaceId: req.query['surface-id'] ? new mongoose.Types.ObjectId(req.query['surface-id']) : undefined,
        startDate: req.query['start-date'] ? new Date(req.query['start-date']) : undefined,
        endDate: req.query['end-date'] ? new Date(req.query['end-date']) : undefined,
        groupBy: req.query['group-by'],
        self: (req.query['self'] === 'true') ? true : false
    };

    const pipeline = [
        {
            $lookup: {
                from: 'surfaces',
                localField: 'surface_id',
                foreignField: '_id',
                as: 'sf_details',
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
                'sf_details.lab_id': {
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
    if (queries.surfaceId) {
        pipeline.push({
            $match: {
                temp_id: {
                    $eq: queries.surfaceId
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

    const result = await SurfaceLogModel.aggregate(pipeline);

    res.send({
        success: true,
        payload: queries.groupBy ? groupBy(result, queries.groupBy) : result,
    });
}

/**
 * @type {import('express').RequestHandler}
 */
export async function createSurfaceLog(req, res) {
    const { _id: userId, lab_id: labId } = req.user;
    const data = req.body;

    if ('user_id' in data) {
        const targetUser = await getUserById(data.user_id);
        if (!targetUser || !await canUserChangeOther(req.user, targetUser)) {
            throw new ExpressError(`Not allowed to set user_id to ${data.user_id}`, 401);
        }
    } else {
        data.user_id = userId;
    }

    const surfaceLog = new SurfaceLogModel(data);

    try {
        await surfaceLog.save();
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
        payload: surfaceLog
    });
}

/**
 * @type {import('express').RequestHandler}
 */
export async function getSurfaceLog(req, res) {
    const { lab_id: labId } = req.user;
    const logId = req.params.logId;

    const surfaceLog = await SurfaceLogModel.findById(logId);
    if (!surfaceLog || !await isSurfaceLogInLab(surfaceLog, labId)) {
        throw logNotFoundError;
    }

    res.send({
        success: true,
        payload: surfaceLog
    });
}

/**
 * @type {import('express').RequestHandler}
 */
export async function deleteSurfaceLog(req, res) {
    const { lab_id: labId } = req.user;
    const logId = req.params.logId;

    const surfaceLog = await SurfaceLogModel.findById(logId);
    if (!surfaceLog || !await isSurfaceLogInLab(surfaceLog, labId)) {
        throw logNotFoundError;
    }

    const logCreator = await getUserById(surfaceLog.user_id);
    if (!logCreator) {
        if (!canUserChangeDeleted(req.user)) {
            throw new ExpressError(`User not allowed to delete this log made by deleted user`, 401);
        }
    } else if (!await canUserChangeOther(req.user, logCreator)) {
        throw new ExpressError(`User not allowed to delete this log`, 401);
    }

    await surfaceLog.deleteOne();

    res.send({
        success: true,
        payload: surfaceLog
    });
}

/**
 * @type {import('express').RequestHandler}
 */
export async function updateSurfaceLog(req, res) {
    const { _id: userId, lab_id: labId } = req.user;
    const data = req.body;
    const logId = req.params.logId;

    const surfaceLog = await SurfaceLogModel.findById(logId);
    if (!surfaceLog || !await isSurfaceLogInLab(surfaceLog, labId)) {
        throw logNotFoundError;
    }

    if ('user_id' in data) {
        const logCreator = await getUserById(data.user_id);
        if (!logCreator) {
            if (!canUserChangeDeleted(req.user)) {
                throw new ExpressError(`User not allowed to delete this log made by deleted user`, 401);
            }
        } else if (!await canUserChangeOther(req.user, logCreator)) {
            throw new ExpressError(`User not allowed to delete this log`, 401);
        }
    } else {
        data.user_id = userId;
    }

    try {
        await surfaceLog.updateOne(data, { runValidators: true });
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
        payload: await SurfaceLogModel.findById(surfaceLog._id),
    });
}

async function isSurfaceLogInLab(surfaceLog, labId) {
    const surface = await SurfaceModel.findOne({ _id: surfaceLog.surface_id, lab_id: labId });
    return (surface !== null);
}