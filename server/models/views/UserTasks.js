import mongoose from "mongoose";
import db from "../../settings/db.js";
import moment from "moment";
import ExpressError from "../../utils/ExpressError.js";


const logtemplatesPipeline = [

    {
        $lookup: {
            from: "equipment",
            localField: "eq_id",
            foreignField: "_id",
            as: "equipment",
            pipeline: [
                {
                    $project: {
                        _id: "$_id",
                        name: "$name"
                    }
                }

            ]
        }
    },
    {
        $unwind: "$equipment",
    },

]

const itemSchedulePipeline = [
    {
        $facet: {
            "logTemplate_sch": [
                {
                    $lookup: {
                        from: "logtemplates",
                        localField: "id",
                        foreignField: "_id",
                        as: "logTemplate",
                        pipeline: logtemplatesPipeline,
                    },

                },
                {
                    $unwind: '$logTemplate'
                }
            ],
            "surface_sch": [
                {
                    $lookup: {
                        from: "surfaces",
                        localField: "id",
                        foreignField: "_id",
                        as: "surface",
                    },
                },
                {
                    $unwind: '$surface'
                }
            ],
            "thermometer_sch": [
                {
                    $lookup: {
                        from: "thermometers",
                        localField: "id",
                        foreignField: "_id",
                        as: "thermometer",
                    },
                },
                {
                    $unwind: '$thermometer'
                }
            ],
        }
    },

]

const schedulemapsPipeline = [
    {
        $lookup: {
            from: "schedules",
            localField: "sch_id",
            foreignField: "_id",
            as: "item_sch",
            pipeline: itemSchedulePipeline,

        },
    },
    {
        $unwind: "$item_sch"
    },
    {
        $project: {
            date: 1,
            type: 1,
            logTemplate_sch: {
                $first: "$item_sch.logTemplate_sch"
            },
            surface_sch: {
                $first: "$item_sch.surface_sch",
            },
            thermometer_sch: {
                $first: "$item_sch.thermometer_sch"
            },
        },

    },
    {
        $project: {
            date: 1,
            logTemplate: {
                _id: '$logTemplate_sch.logTemplate._id',
                type: '$logTemplate_sch.logTemplate.type',
                items: '$logTemplate_sch.logTemplate.items',
                equipment: '$logTemplate_sch.logTemplate.equipment',
            },
            surface: {
                _id: '$surface_sch.surface._id',
                name: '$surface_sch.surface.name',
                maintenance_proc: '$surface_sch.surface.maintenance_proc',
            },
            thermometer: {
                _id: '$thermometer_sch.thermometer._id',
                name: '$thermometer_sch.thermometer.name',
                description: '$thermometer_sch.thermometer.description',
                temp_min: '$thermometer_sch.thermometer.temp_min',
                temp_max: '$thermometer_sch.thermometer.temp_max',
            },
            sch: {
                $cond: {
                    if: '$logTemplate_sch',
                    then: {
                        _id: '$logTemplate_sch._id',
                        type: '$logTemplate_sch.type',
                        recurrence: '$logTemplate_sch.recurrence',
                        initial_date: '$logTemplate_sch.initial_date',
                        end_date: '$logTemplate_sch.end_date'
                    },
                    else: {
                        $cond: {
                            if: '$surface_sch',
                            then: {
                                _id: '$surface_sch._id',
                                type: '$surface_sch.type',
                                recurrence: '$surface_sch.recurrence',
                                initial_date: '$surface_sch.initial_date',
                                end_date: '$surface_sch.end_date'
                            },
                            else: {
                                $cond: {
                                    if: '$thermometer_sch',
                                    then: {
                                        _id: '$thermometer_sch._id',
                                        type: '$thermometer_sch.type',
                                        recurrence: '$thermometer_sch.recurrence',
                                        initial_date: '$thermometer_sch.initial_date',
                                        end_date: '$thermometer_sch.end_date'
                                    },
                                    else: '$$REMOVE'
                                }
                            }
                        }
                    },
                }
            },
        }

    },

    {
        $lookup: {
            from: "equipmentlogs",
            let: {
                logTempSchId: "$sch._id",
                logTempId: "$logTemplate._id",
                logDate: "$date"
            },
            as: "sameDateExistedLogs",
            pipeline: [
                {
                    $match: {
                        $expr: {
                            $and: [
                                { $eq: ["$date", "$$logDate"] },
                                { $eq: ["$sch_id", "$$logTempSchId"] },
                                { $eq: ["$temp_id", "$$logTempId"] }
                            ]
                        }
                    }
                }
            ],

        }

    },

    {
        $group: {
            _id: "$date",
            tasks: {
                $push: {
                    logTemplate: '$logTemplate',
                    surface: '$surface',
                    thermometer: '$thermometer',
                    sch: '$sch',

                    // log: {
                    //     $first:  "$sameDateExistedLogs"
                    // },
                    done: {

                        $cond: {
                            if: { $gt: [{ $size: "$sameDateExistedLogs" }, 0] },
                            then: true,
                            else: false,
                        }
                    },

                }
            }
        }
    },
    {
        $project: {
            _id: 0,
            date: "$_id",
            tasks: 1
        }
    },
    {
        $sort: {
            date: 1
        }
    }
]

const userTaskViewPipline = [
    {
        $lookup: {
            from: "schedulemaps",
            localField: "_id",
            foreignField: "user_id",
            as: "schedulemaps",
            pipeline: schedulemapsPipeline,
        }
    },
    // {
    //     $project: {
    //         _id: 1,
    //         name: 1,
    //         username: 1,
    //         lab_id: 1,
    //         schedulemaps: {
    //             $reduce: {
    //                 input: "$schedules",
    //                 initialValue: [],
    //                 in: { $concatArrays: ["$$value", "$$this.schedulemaps"] }
    //             }
    //         },

    //     }
    // }
]

try {
    await db.db.dropCollection('UserTask');
    await db.db.createCollection(
        'UserTask',
        {
            viewOn: 'users',
            pipeline: userTaskViewPipline
        }
    )

} catch (error) {
    console.error(error);
}

const userTaskSchema = new mongoose.Schema({}, { collection: 'UserTask' });

userTaskSchema.statics.getUserTasksById = async function (userId, options) {
    // Get the last day of the current month
    const lastDayOfMonth = moment().endOf("month").toDate();
    const firstDayOfMonth = moment().startOf("month").toDate();

    const { startDate = firstDayOfMonth, endDate = lastDayOfMonth, lab_id } = options;

    if (!moment(startDate).isValid() && !moment(endDate).isValid()) {
        throw new Error('Invalid date provided');
    }
    const pipline = [
        {
            $match: {
                _id: new mongoose.Types.ObjectId(userId),
                lab_id

            }
        },
        {
            $unwind: "$schedulemaps",
        },
        {
            $match: {
                "schedulemaps.date": {
                    $gte: new Date(startDate),
                    $lte: new Date(endDate)
                },
            }
        },
        {
            $group: {
                _id: {
                    _id: "$_id",
                    name: "$name",
                    username: "$username",
                    lab_id: "$lab_id",
                },

                schedulemaps: { $push: "$schedulemaps" },
            }
        },
        {
            $project: {
                _id: 0,
                user: "$_id",
                schedulemaps: 1

            }
        }


    ];
    try {
        const result = await this.aggregate(pipline).exec();
        if (result.length) return result[0];
        return result;
    } catch (error) {
        return new Error(error.message);
    }
}

userTaskSchema.statics.getAllUserTasksInLab = async function (labId, options) {
    // Get the last day of the current month
    const lastDayOfMonth = moment().endOf("month").toDate();
    const firstDayOfMonth = moment().startOf("month").toDate();

    const { startDate = firstDayOfMonth, endDate = lastDayOfMonth } = options;

    const pipeline = [
        {
            $match: {
                lab_id: new mongoose.Types.ObjectId(labId),
            }
        },
        {
            $unwind: "$schedulemaps",
        },
        {
            $match: {
                "schedulemaps.date": {
                    $gte: new Date(startDate),
                    $lte: new Date(endDate)
                },
            }
        },
        {
            $project: {
                _id: 0,
                user: {
                    _id: "$_id",
                    name: "$name",
                    username: "$username"
                },
                schedulemaps: 1
            }
        },
        { $unwind: "$schedulemaps.tasks" },

        // Project necessary fields
        {
            $project: {
                date: "$schedulemaps.date",
                // user: "$user",
                // task: "$schedulemaps.tasks"
                task: {
                    user: "$user",
                    sch: "$schedulemaps.tasks.sch",

                    logTemplate: "$schedulemaps.tasks.logTemplate",
                    thermometer: "$schedulemaps.tasks.thermometer",
                    surface: "$schedulemaps.tasks.surface",
                    done: "$schedulemaps.tasks.done"
                }
            }
        },

        // Group by date and user
        {
            $group: {
                _id: {
                    date: "$date",
                },
                tasks: { $push: "$task" }
            }
        },

        // Final formatting of the output document
        {
            $project: {
                _id: 0,
                date: { $toDate: "$_id.date" },  // Convert string to Date object
                tasks: 1
            }
        }

    ];

    try {
        const result = await this.aggregate(pipeline).exec();
        // const result = await this.findById('66af4cb82e3da1ed76442b7b');

        return result;
    } catch (error) {
        return new Error(error.message);
    }
}

userTaskSchema.statics.getAllLabsStats = async function (options) {
    // Get the last day of the current month
    const lastDayOfMonth = moment().endOf("month");
    const firstDayOfMonth = moment().startOf("month");

    const { startDate = firstDayOfMonth, endDate = lastDayOfMonth, } = options;
    if (!startDate.isValid() || !endDate.isValid()) {
        throw new ExpressError('Provided dates are invalicd', 400);
    }
    const pipeline = []
    pipeline.push(...[

        {
            $unwind: "$schedulemaps",
        },
        {
            $match: {
                "schedulemaps.date": {
                    $gte: new Date(startDate),
                    $lte: new Date(endDate)
                },
            }
        },
        {
            $unwind: '$schedulemaps.tasks'
        },
        // {
        //     $group: {
        //         _id: labId ? '$lab_id' : '_id',
        //         total: {
        //             $sum: {
        //                 $cond: {
        //                     if: {
        //                         $eq: ['$schedulemaps.tasks.sch.type', 'equipment']
        //                     },
        //                     then: 1,
        //                     else: 0
        //                 }
        //             }
        //         },
        //         done: {
        //             $sum: {
        //                 $cond: {
        //                     if: {
        //                         $and: [
        //                             {
        //                                 $eq: ['$schedulemaps.tasks.sch.type', 'equipment']
        //                             },
        //                             {
        //                                 $eq: ['$schedulemaps.tasks.done', true]
        //                             }
        //                         ]

        //                     },
        //                     then: 1,
        //                     else: 0
        //                 }
        //             }
        //         }
        //     }
        // }
        {
            $group: {
                _id: '$lab_id',
                total: {
                    $sum: {
                        $cond: {
                            if: {
                                $eq: ['$schedulemaps.tasks.sch.type', 'equipment']
                            },
                            then: 1,
                            else: 0
                        }
                    }
                },
                done: {
                    $sum: {
                        $cond: {
                            if: {
                                $and: [
                                    {
                                        $eq: ['$schedulemaps.tasks.sch.type', 'equipment']
                                    },
                                    {
                                        $eq: ['$schedulemaps.tasks.done', true]
                                    }
                                ]

                            },
                            then: 1,
                            else: 0
                        }
                    }
                },

            }
        },
    ]);
    try {
        const result = await this.aggregate(pipeline).exec();
        // const result = await this.findById('66af4cb82e3da1ed76442b7b');

        return result;
    } catch (error) {
        return new Error(error.message);
    }
}

userTaskSchema.statics.getLabUsersStats = async function (labId, options) {
    // Get the last day of the current month
    const lastDayOfMonth = moment().endOf("month");
    const firstDayOfMonth = moment().startOf("month");
    const { startDate = firstDayOfMonth, endDate = lastDayOfMonth, } = options;
    if (!startDate.isValid() || !endDate.isValid()) {
        throw new ExpressError('Provided dates are invalicd',400);
    }
    const pipeline = []

    pipeline.push([{
        $match: {
            lab_id: new mongoose.Types.ObjectId(labId),
        }
    },
    {
        $unwind: "$schedulemaps",
    },
    {
        $match: {
            "schedulemaps.date": {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            },
        }
    },
    {
        $unwind: '$schedulemaps.tasks'
    },
    {
        $group: {
            _id: '$_id',
            total: {
                $sum: {
                    $cond: {
                        if: {
                            $eq: ['$schedulemaps.tasks.sch.type', 'equipment']
                        },
                        then: 1,
                        else: 0
                    }
                }
            },
            done: {
                $sum: {
                    $cond: {
                        if: {
                            $and: [
                                {
                                    $eq: ['$schedulemaps.tasks.sch.type', 'equipment']
                                },
                                {
                                    $eq: ['$schedulemaps.tasks.done', true]
                                }
                            ]

                        },
                        then: 1,
                        else: 0
                    }
                }
            },

        }
    },
    ])
    try {
        const result = await this.aggregate(pipeline).exec();
        return result;
    } catch (error) {
        return new Error(error.message);
    }
}



const UserTask = mongoose.model('UserTask', userTaskSchema);

export { UserTask } 