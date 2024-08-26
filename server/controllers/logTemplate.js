import mongoose from "mongoose";

import LogTemplate from "../models/LogTemplate.js";
import Equipment from "../models/Equipment.js";
import ExpressError from "../utils/ExpressError.js";

export const RECCURENCES = [
    "daily",
    "weekly",
    "monthly",
    "quarterly",
    "semi-annually",
    "annually",
];

/**
 * Request handler for retrieving all log templates
 * @type {import("express").RequestHandler}
 */
export async function getAllLogTemplates(req, res) {
    const { lab_id } = req.user;
    const { eq_id, type, scheduled, group } = req.query;

    console.log(scheduled);
    const pipeline =
        [
            {
                $lookup: {
                    from: 'equipment',
                    localField: 'eq_id',
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

    if (eq_id != undefined) {
        pipeline.push({
            $match: {
                'eq_id': {
                    $eq: new mongoose.Types.ObjectId(eq_id)
                }
            }
        });
    }
    if (type != undefined) {
        pipeline.push({
            $match: {
                'type': {
                    $eq: Number(type)
                }
            }
        });
    }

    //add the all log templates which has allready scheduled and are active
    if (scheduled) {
        pipeline.push({
            $lookup: {
                from: "schedules",
                localField: "_id",
                foreignField: "id",
                as: "schedule",
                pipeline: [
                    {
                        $project: {
                            initial_date: 1,
                            end_date: 1,
                            recurrence: 1,
                            type: 1
                        }
                    }
                ]

            },

        },
                {
                $unwind:{
                    path: "$schedule"
                }
            }
            
        //     {
        //     $match:{
        //         "schedule.initial_date":{$lte:new Date()},
        //         "schedule.end_date":{$gte:new Date()},
        //         "schedule.recurrence":{$ne:null}
        //     }
        // }
    )
    }
    if (group) {
        pipeline.push(
            {
                $unwind: "$eq_details"
            },
            {
                $group: {
                    _id: "$eq_details.name",
                    documents: { $push: "$$ROOT" }
                }
            },
            {
                $unwind: "$documents"
            },
            {
                $group: {
                    _id: {
                        eq_name: "$_id",
                        type: "$documents.type"
                    },
                    documents: { $push: "$documents" }
                }
            },
            {
                $group: {
                    _id: "$_id.eq_name",
                    types: {
                        $push: {
                            type: "$_id.type",
                            documents: "$documents"
                        }
                    }
                }
            }
        )
    }

    const result = await LogTemplate.aggregate(pipeline);

    res.send({
        success: true,
        payload: result
    });
}

/**
 * Request handler for creating a log template
 * @type {import("express").RequestHandler}
 */
export async function createLogTemplate(req, res) {
    const { lab_id } = req.user;
    const data = req.body.name;

    if (!await isEqInLab(lab_id, data.eq_id)) {
        throw new ExpressError('Equipment not found in lab', 400);
    }

    const logTemplate = new LogTemplate({ ...data });
    await logTemplate.save();

    res.send({
        success: true,
        payload: logTemplate
    });
}

/**
 * Request handler for retrieving log template by ID
 * @type {import("express").RequestHandler}
 */
export async function getLogTemplate(req, res) {
    const { lab_id } = req.user;
    const { id } = req.params;

    const logTemplate = await LogTemplate.findById(id).lean();
    if (logTemplate == null || !await isEqInLab(lab_id, logTemplate.eq_id)) {
        throw new ExpressError('Log template not found', 404);
    }

    res.send({
        success: true,
        payload: logTemplate
    });
}

/**
 * Request handler for removing log template
 * @type {import("express").RequestHandler}
 */
export async function removeLogTemplate(req, res) {
    const { lab_id } = req.user;
    const { id } = req.params;

    const logTemplate = await LogTemplate.findOneAndDelete({ _id: id }).lean();
    if (logTemplate == null || !await isEqInLab(lab_id, logTemplate.eq_id)) {
        throw new ExpressError('Log template not found', 404);
    }

    res.send({
        success: true,
        payload: logTemplate
    });
}

/**
 * Request handler for updating log template
 * @type {import("express").RequestHandler}
 */
export async function updateLogTemplate(req, res) {
    const { lab_id } = req.user;

    const { id } = req.params;
    const updates = req.body;

    const logTemplate = await LogTemplate.findByIdAndUpdate(id, updates, { new: true }).lean();
    if (logTemplate == null || !await isEqInLab(lab_id, logTemplate.eq_id)) {
        throw new ExpressError('Log template not found', 404);
    }

    res.send({
        success: true,
        payload: logTemplate
    });
}

async function isEqInLab(labId, eqId) {
    const eq = await Equipment.findById(eqId);
    if (eq == null) {
        return false;
    }

    return labId.equals(eq.lab_id);
}