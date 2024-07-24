import mongoose, { Schema } from 'mongoose';

const DocSchema = new Schema({
    originalName: {
        type: String,
        required: true
    },
    filename: {
        type: String,
        required: true
    },
    removed: {
        type: Boolean,
        default: false
    }
});

const Doc = mongoose.model('Doc', DocSchema);

export default Doc;
