import mongoose, { Schema } from 'mongoose';

const EquipmentSchema = new Schema({
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
    model_no: String,
    serial: String,
    manufacture: String,
    rsc_name: String,
    rsc_phone: String,
});

const Equipment = mongoose.model('Equipment', EquipmentSchema);

export default Equipment;