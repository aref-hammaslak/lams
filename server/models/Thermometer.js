import mongoose, { Schema } from 'mongoose';

const ThermometerSchema = new Schema({
    lab_id: {
        type: Schema.Types.ObjectId,
        required: true
    },
    dep_id: {
        type: Schema.Types.ObjectId,
        required: true
    },
    name: {
        type: String,
        unique: true,
        required: true
    },
    description: String,
    serial: String,
    temp_min: Number,
    temp_max: Number
});

const Thermometer = mongoose.model('Thermometer', ThermometerSchema);

export default Thermometer;