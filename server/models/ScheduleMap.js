import mongoose from "mongoose";
import { Schema } from "mongoose";

import { ScheduleModel } from "../models/Schedule.js";
import { isDateInSchedule } from "../services/schedule.js";

const scheduleMapSchema = new mongoose.Schema({
    date: {
        type: Date,
        required: true
    },
    user_sch_id: {
        type: Schema.Types.ObjectId,
        required: true
    },
    item_sch_id: {
        type: Schema.Types.ObjectId,
        required: true
    },
});

scheduleMapSchema.index({ date: 1, user_sch_id: 1, item_sch_id: 1 }, { unique: true });

scheduleMapSchema.pre('validate', async function () {
    const userSch = await ScheduleModel.findById(this.user_sch_id);
    if (userSch == null) {
        throw new Error('User schedule does not exist.');
    }
    const itemSch = await ScheduleModel.findById(this.item_sch_id);
    if (itemSch == null) {
        throw new Error('Item schedule does not exist.');
    }

    if (userSch.type != 'user') {
        throw new Error('Invalid user schedule');
    }

    if (!itemSch.lab_id.equals(userSch.lab_id)) {
        throw new Error('Mismatching lab IDs');
    }

    if (!isDateInSchedule(userSch, this.date)) {
        throw new Error('Mismatching schedule date with the user schedule');
    }
    if (!isDateInSchedule(itemSch, this.date)) {
        throw new Error('Mismatching schedule date with the item schedule');
    }
});

const ScheduleMapModel = mongoose.model('ScheduleMap', scheduleMapSchema);

export default ScheduleMapModel;