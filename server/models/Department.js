import mongoose, { Schema } from 'mongoose';

const DepartmentSchema = new Schema({
    lab_id: {
        type: Schema.Types.ObjectId,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    active: {
        type: Boolean,
        default: true
    }
});

const Department = mongoose.model('Department', DepartmentSchema);

export default Department;