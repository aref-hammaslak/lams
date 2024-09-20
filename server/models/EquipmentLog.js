import mongoose, { Schema } from "mongoose";

import LogTemplate from "./LogTemplate.js";

import { getScheduleMapsForDate } from "../services/scheduleMap.js";
import { getLogTemplateItems } from "../services/logTemplate.js";
import User from "./User.js";
import ScheduleMapModel from "./ScheduleMap.js";

const logSchema = new Schema({
    date: {
        type: Date,
        required: true
    },
    user_id: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    temp_id: {
        type: Schema.Types.ObjectId,
        ref: 'LogTemplate',
        required: true,
        immutable: true
    },
    sch_id:{
        type: Schema.Types.ObjectId,
        ref: 'Schedule',
        required: true
    },
    items:
    {
        type: Schema.Types.Mixed,
        required: true
    }
});

logSchema.index({ date: 1, temp_id: 1 }, { unique: true });

logSchema.path('user_id').validate(async function (user_id) {
    let origDoc;
    if (!('_id' in this)) {
        origDoc = await EquipmentLogModel.findById(this.getFilter()['_id']);
    }

    const date = this.get('date') ?? origDoc.get('date');
    const sch_id = this.get('sch_id') ?? origDoc.get('sch_id');

    const user = await User.findById(user_id);
    if (!user) {
        throw new Error('Failed to find user');
    }
    if (user.roles.includes(2005) || user.roles.includes(1923)) return true;

    const map = await ScheduleMapModel.findOne({ date, user_id, sch_id });
    if (!Map) {
        throw new Error('No schedule map found for specified user');
    }

    return true;
});

logSchema.path('items').validate(async function (items) {
    let origDoc;
    if (!('_id' in this)) {
        origDoc = await EquipmentLogModel.findById(this.getFilter()['_id']);
    }

    const temp_id = this.get('temp_id') ?? origDoc.get('temp_id');

    const logTemplate = await LogTemplate.findById(temp_id);
    if (!logTemplate) {
        throw new Error('Log template not found');
    }

    const tempItems = getLogTemplateItems(logTemplate);
    for (const [key, value] of Object.entries(items)) {
        if (!(key in tempItems)) {
            throw new Error(`Unknown field '${key}'`);
        }

        if (tempItems[key] !== typeof value) {
            throw new Error(`Invalid value type for field '${key}'`);
        }
    }

    for (const key in tempItems) {
        if (!(key in items)) {
            throw new Error(`No value specified for field '${key}'`);
        }
    }

    return true;
});

const EquipmentLogModel = mongoose.model('EquipmentLog', logSchema);

export default EquipmentLogModel;
export {EquipmentLogModel}