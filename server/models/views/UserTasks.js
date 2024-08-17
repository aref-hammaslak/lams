import mongoose from "mongoose";
import db from "../../settings/db.js";
import moment from "moment";


// # Define MongoDB aggregation pipelines
const logtemplatesPipeline = [

    {
        $lookup: {
            from: "equipment",
            localField: "eq_id",
            foreignField: "_id",
            as: "eq_details",
            pipeline: [
                {
                    $project: {
                        "_id": 1,
                        "name": 1
                    }
                }
            ]
        }
    }, {
        $unwind: "$eq_details",
    },

]

const itemSchedulePipeline = [
    {
        $lookup: {
            from: "logtemplates",
            localField: "id",
            foreignField: "_id",
            as: "temp_details",
            pipeline: logtemplatesPipeline,
        },
    }, {
        $unwind: "$temp_details",
    },
]

const schedulemapsPipeline = [
    {
        $lookup: {
            from: "schedules",
            localField: "item_sch_id",
            foreignField: "_id",
            as: "item_sch",
            pipeline: itemSchedulePipeline,
        },
    }, {
        $unwind: "$item_sch"
    }, {
        $project: {
            date: 1,

            eq_sch: "$item_sch",
            log_temp: "$item_sch.temp_details",
            eq_details: "$item_sch.temp_details.eq_details",

        },
    },
    {
        $lookup: {
            from: "equipmentlogs",
            let: {
                eqSchId: "$eq_sch._id",
                tempId: "$log_temp._id",
                logDate: "$date"
            },
            as: "sameDateExistedLogs",
            pipeline: [
                {
                    $match: {
                        $expr: {
                            $and: [
                                { $eq: ["$date", "$$logDate"] },
                                { $eq: ["$sch_id", "$$eqSchId"] },
                                { $eq: ["$temp_id", "$$tempId"] }
                            ]
                        }
                    }
                }
            ],

        }
    },
    {
        $project: {
            "eq_sch.id": 0,
            "eq_sch.lab_id": 0,
            "eq_sch.offsets": 0,
            "eq_sch.__v": 0,
            "log_temp.eq_id": 0,
            "eq_sch.temp_details": 0,
            "log_temp.eq_details": 0
        }
    },
    {
        $group: {
            _id: "$date",
            tasks: {
                $push: {
                    eq_sch: "$eq_sch",
                    log_temp: "$log_temp",
                    eq_details: "$eq_details",
                    // log: {
                    //     $first:  "$sameDateExistedLogs"
                    // },
                    done: {
                        $cond: {
                            if: { $gt: [{ $size: "$sameDateExistedLogs" }, 0] },
                            then: true,
                            else: false
                        }
                    }
                }
            }
        }
    }, {
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

const schedulesPipeline = [
    {
        $lookup: {
            from: "schedulemaps",
            localField: "_id",
            foreignField: "user_sch_id",
            as: "schedulemaps",
            pipeline: schedulemapsPipeline,
        }
    },
]

const userTaskViewPipline = [
    {
        $lookup: {
            from: "schedules",
            localField: "_id",
            foreignField: "id",
            as: "schedules",
            pipeline: schedulesPipeline,
        }
    },
    {
        $project: {
            _id: 1,
            name: 1,
            username: 1,
            lab_id: 1,
            schedulemaps: {
                $reduce: {
                    input: "$schedules",
                    initialValue: [],
                    in: { $concatArrays: ["$$value", "$$this.schedulemaps"] }
                }
            },

        }
    }
]

try {
    // await db.db.dropCollection('UserTask');
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
        console.log(result);
        if(result.length)  return result[0];
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
                "schedulemaps.date": { $gte: startDate, $lte: endDate },
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
                user: {
                    _id: "$_id",
                    name: "$name",
                    username: "$username",
                },
                schedulemaps: 1
            }
        }
    ];

    try {
        const result = await this.aggregate(pipeline).exec();
        console.log(result);
        return result;
    } catch (error) {
        return new Error(error.message);
    }
}

const UserTask = mongoose.model('UserTask', userTaskSchema);

export { UserTask } 