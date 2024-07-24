import mongoose, { Schema } from 'mongoose';

const LogTemplateSchema = new Schema({
    eq_id: {
        type: Schema.Types.ObjectId,
        required: true,
        immutable: true
    },
    type: {
        type: Number,
        enum: [0, 1, 2, 3, 4], // daily, monthly, quarterly, semiannually, annually
        immutable: true
    },
    items: [
        {
            label: String,
            type: {
                type: Number,
                enum: [0, 1, 2, 3, 4, 5] // CheckBox, Text, Number, Option{C,R,F}, Options{C,R,C&R}, Options{C,F}
            }
        }
    ]
});
LogTemplateSchema.index({ eq_id: 1, type: 1 }, { unique: true });

const LogTemplate = mongoose.model('LogTemplate', LogTemplateSchema);

export default LogTemplate;