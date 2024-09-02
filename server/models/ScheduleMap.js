import mongoose from "mongoose";
import { Schema } from "mongoose";

import { ScheduleModel } from "../models/Schedule.js";
import { isDateInSchedule } from "../services/schedule.js";
import User from "./User.js";

const scheduleMapSchema = new mongoose.Schema({
    date: {
        type: Date,
        required: true
    },
    user_id: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    sch_id: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Schedule'
    },
});

scheduleMapSchema.index({ date: 1, user_id: 1, sch_id: 1 }, { unique: true });

const ScheduleMapModel = mongoose.model('ScheduleMap', scheduleMapSchema);

scheduleMapSchema.pre('validate', async function () {
    const userSch = await User.findById(this.user_id);
    if (userSch == null) {
        throw new Error('User  does not exist.');
    }
    const itemSch = await ScheduleModel.findById(this.sch_id);
    if (itemSch == null) {
        throw new Error('schedule does not exist.');
    }


    if (!itemSch.lab_id.equals(userSch.lab_id)) {
        throw new Error('Mismatching lab IDs');
    }


    if (!isDateInSchedule(itemSch, this.date)) {
        throw new Error('Mismatching schedule date with the item schedule');
    }

    const schMap = ScheduleMapModel.find({
        date: this.date,
        sch_id: this.sch_id,
    })
    if (schMap) throw new Error("This item already has been assigned to a user");

});

export default ScheduleMapModel;