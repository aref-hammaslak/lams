import mongoose, { Schema } from "mongoose";

const pmServiceSchema = new Schema({
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
pmServiceSchema.index({ eq_id: 1, date: 1 }, { unique: true });

const PMService = mongoose.model('PMService', pmServiceSchema);

export default PMService;