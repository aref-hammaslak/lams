import mongoose, { Schema } from 'mongoose';

import ScheduleMap from './ScheduleMap.js';
import EquipmentLogModel from './EquipmentLog.js';

const offsetSchema = new mongoose.Schema({
    date: Date,
    offset: Number
});

const scheduleSchema = new mongoose.Schema({
    lab_id: {
        type: Schema.Types.ObjectId,
        required: true,
        immutable: true
    },
    initial_date: {
        type: Date,
        required: true,
    },
    end_date: Date,
    type: {
        type: String,
        enum: ['equipment', 'thermometer', 'surface', 'logtemplate'],
        required: true,
        immutable: true
    },
    id: {
        type: Schema.Types.ObjectId,
        required: true,
        immutable: true,
        refPath: 'type'
    },
    recurrence: {
        /**
         * - weekly: recur + 7days
         * - monthly: recur + 1mnth
         * - quarterly: recur + 3mnth
         * - semiannually: recur + 0.5yr
         * - annually: recur + 1yr
         */
        type: String,
        enum: ['daily', 'weekly', 'monthly', 'quarterly', 'semiannually', 'annually'],
    },
    offsets: [offsetSchema]
});

scheduleSchema.index({ type: 1, id: 1, initial_date: 1, recurrence: 1 }, { unique: true });

scheduleSchema.pre(["deleteOne","deleteMany", "findOneAndDelete", "updateOne", "findOneAndUpdate", "remove"], { document: true, query: true }, async function () {
    let id;
    if ('_id' in this) {
        // Document
        id = this._id;
    } else {
        // Query
        id = this.getFilter()['_id'];
    }

    if (!id) {
        throw new Error('middleware failed to get document ID');
    }

    const mapsDeletion = await ScheduleMap.deleteMany({ $or: [{ user_id: id }, { sch_id: id }] });
    const logsDeletion = await EquipmentLogModel.deleteMany({ sch_id: id });
});

const ScheduleModel = mongoose.model('Schedule', scheduleSchema);

export { ScheduleModel };

