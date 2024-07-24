import mongoose, { Schema } from "mongoose";

import SurfaceModel from "../models/Surface.js";

import { getScheduleMapsForDate } from "../services/scheduleMap.js";
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
    surface_id: {
        type: Schema.Types.ObjectId,
        ref: 'Surface',
        required: true,
        immutable: true
    },
    checked: {
        type: Boolean,
        required: true
    }
});
logSchema.index({ date: 1, surface_id: 1 }, { unique: 1 });

logSchema.path('date').validate(async function (date) {
    let origDoc;
    if (!('_id' in this)) {
        origDoc = await SurfaceLogModel.findById(this.getFilter()['_id']);
    }

    const user_id = this.get('user_id') ?? origDoc.get('user_id');
    const surface_id = this.get('surface_id') ?? origDoc.get('surface_id');

    const user = await User.findById(user_id);
    if (!user) {
        throw new Error('Failed to find user');
    }
    const surface = await SurfaceModel.findById(surface_id);
    if (!surface) {
        throw new Error('Failed to find surface');
    }
    if (!surface.lab_id.equals(user.lab_id)) {
        throw new Error("Surface not in user's lab");
    }

    const maps = await getScheduleMapsForDate(date, user_id, 'surface', surface_id);
    if (maps.length == 0) {
        throw new Error('No schedule map found for specified date');
    }

    return true;
});

logSchema.path('surface_id').validate(async function (surface_id) {
    let origDoc;
    if (!('_id' in this)) {
        origDoc = await SurfaceLogModel.findById(this.getFilter()['_id']);
    }

    const date = this.get('date') ?? origDoc.get('date');
    const user_id = this.get('user_id') ?? origDoc.get('user_id');

    const user = await User.findById(user_id);
    if (!user) {
        throw new Error('Failed to find user');
    }
    const surface = await SurfaceModel.findById(surface_id);
    if (!surface) {
        throw new Error('Failed to find surface');
    }
    if (!surface.lab_id.equals(user.lab_id)) {
        throw new Error("Surface not in user's lab");
    }

    const maps = await getScheduleMapsForDate(date, user_id, 'surface', surface_id);
    if (maps.length == 0) {
        throw new Error('No schedule map found for specified surface');
    }

    return true;
});

logSchema.path('user_id').validate(async function (user_id) {
    let origDoc;
    if (!('_id' in this)) {
        origDoc = await SurfaceLogModel.findById(this.getFilter()['_id']);
    }

    const date = this.get('date') ?? origDoc.get('date');
    const surface_id = this.get('surface_id') ?? origDoc.get('surface_id');

    const user = await User.findById(user_id);
    if (!user) {
        throw new Error('Failed to find user');
    }
    const surface = await SurfaceModel.findById(surface_id);
    if (!surface) {
        throw new Error('Failed to find surface');
    }
    if (!surface.lab_id.equals(user.lab_id)) {
        throw new Error("Surface not in user's lab");
    }

    const maps = await getScheduleMapsForDate(date, user_id, 'surface', surface_id);
    if (maps.length == 0) {
        throw new Error('No schedule map found for specified user');
    }

    return true;
});

const SurfaceLogModel = mongoose.model('SurfaceLog', logSchema);

export default SurfaceLogModel;