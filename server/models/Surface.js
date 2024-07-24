import mongoose, { Schema } from 'mongoose';

const SurfaceSchema = new Schema({
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
    maintenance_proc: String,
});

const Surface = mongoose.model('Surface', SurfaceSchema);

export default Surface;