import mongoose, { Schema } from 'mongoose';

const LogTemplateSchema = new Schema({
    eq_id: {
        type: Schema.Types.ObjectId,
        required: true,
        immutable: true
    },
    type: {
        type: Number,
        enum: [0, 1, 2, 3, 4,5], // daily,weekly, monthly, quarterly, semiannually, annually
        immutable: true
    },
    items: [
        {
            label: String,
            default_value: Schema.Types.Mixed,
            type: {
                type: Number,
                enum: [0, 1, 2, 3, 4, 5] // CheckBox, Text, Number, Option{C,R,F}, Options{C,R,C&R}, Options{C,F}
            }
        }
    ]
});
LogTemplateSchema.index({ eq_id: 1, type: 1 }, { unique: true });


LogTemplateSchema.statics.getAllLogTemplateSchedules = async function ({ lab_id,logTemp_id, start_date, end_date }) {
// console.log('lab_id,logTemp_id, start_date, end_date :', lab_id,logTemp_id, start_date, end_date);
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
                    _id: new mongoose.Types.ObjectId(logTemp_id),
                    'eq_details.lab_id': {
                        $eq: lab_id
                    }
                }
            }, {
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
                $unwind: {
                    path: "$schedule"
                }
            },
            {
                $match: {
                                    $or: [
                    // Case 1: The document's initial_date is within the given range
                    {
                        $and: [
                            {
                                'schedule.initial_date': { $gte: new Date(start_date) }
                            },
                            {
                                'schedule.initial_date': { $lt: new Date(end_date) }
                            }
                        ]
                    },
                    // Case 2: The document's end_date is within the given range
                    {
                        $and: [
                            {
                                'schedule.end_date': { $gt: new Date(start_date) }
                            },
                            {
                                'schedule.end_date': { $lte: new Date(end_date) }
                            }
                        ]
                    },
                    // Case 3: The document's range entirely covers the given range
                    {
                        $and: [
                            {
                                'schedule.initial_date': { $lte: new Date(start_date) }
                            },
                            {
                                'schedule.end_date': { $gte: new Date(end_date) }
                            }
                        ]
                    }
                ]


                }
            },
            {
                $group: {
                    _id: '$_id',
                    schedules: {
                        $push: '$schedule'
                    }
                }
            }
        ];
    const result = await this.aggregate(pipeline).exec();
    
    return result[0];
}

const LogTemplate = mongoose.model('LogTemplate', LogTemplateSchema);

export default LogTemplate;