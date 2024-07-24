import mongoose, { Schema } from "mongoose";

const calibrationSchema = new Schema({
    eq_id: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Equipment'
    },
    date: {
        type: Date,
        required: true
    },
    description: String,
    document: {
        type: Schema.Types.ObjectId,
        ref: 'Doc'
    }
});
calibrationSchema.index({ eq_id: 1, date: 1 }, { unique: true });

const CalibrationModel = mongoose.model('Calibration', calibrationSchema);

export default CalibrationModel;