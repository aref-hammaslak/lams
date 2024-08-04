import mongoose, { Schema } from "mongoose";

import LogTemplate from "./LogTemplate.js";

import { getScheduleMapsForDate } from "../services/scheduleMap.js";
import { getLogTemplateItems } from "../services/logTemplate.js";
import User from "./User.js";

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

// Validates the date field of the equipment log document.
// This function checks if a schedule map exists for the specified date, user, and log template.
// If the user is a supervisor or admin, the schedule map validation is skipped.
logSchema.path('date').validate(async function (date) {
    let origDoc;
    if (!('_id' in this)) {
        origDoc = await EquipmentLogModel.findById(this.getFilter()['_id']);
    }

    const user_id = this.get('user_id') ?? origDoc.get('user_id');
    // check if user is supervisor of admin skip the validation schedule map
    const user = await User.findById(user_id);
    if (!user) {
        throw new Error('Failed to find user');
    }
    if (user.roles.includes(2005) || user.roles.includes(1923)) return true;

    const temp_id = this.get('temp_id') ?? origDoc.get('temp_id');

    const maps = await getScheduleMapsForDate(date, user_id, 'equipment', temp_id);
    if (maps.length == 0) {
        throw new Error('No schedule map found for specified date');
    }

    return true;
});

logSchema.path('user_id').validate(async function (user_id) {
    let origDoc;
    if (!('_id' in this)) {
        origDoc = await EquipmentLogModel.findById(this.getFilter()['_id']);
    }

    const date = this.get('date') ?? origDoc.get('date');
    const temp_id = this.get('temp_id') ?? origDoc.get('temp_id');


    // check if user is supervisor of admin skip the validation schedule map
    const user = await User.findById(user_id);
    if (!user) {
        throw new Error('Failed to find user');
    }
    if (user.roles.includes(2005) || user.roles.includes(1923)) return true;

    const maps = await getScheduleMapsForDate(date, user_id, 'equipment', temp_id);
    if (maps.length == 0) {
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