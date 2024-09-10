import mongoose, { Schema } from 'mongoose';

const LaboratorySchema = new Schema({
    lab_pfp: String,
    name: {
        type: String,
        required: true
    },
    phone: String,
    email: String,
    fax: String,
    cli: Number,
    pfi: Number,
    cert_type: String,
    category: {
        type: String,
        enum: ["CLEP", "CLIA", "ASCP", "CLEP&CLIA"]
    },
    md_name: String,
    md_phone: String,
    md_email: String
});

const Laboratory = mongoose.model('Laboratory', LaboratorySchema);

export { Laboratory };
export default Laboratory;