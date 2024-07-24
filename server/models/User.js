import mongoose, { Schema } from 'mongoose';
import passport from 'passport';
import LocalStrategy from 'passport-local';
import passportLocalMongoose from 'passport-local-mongoose';

const userSchema = new Schema({
    name: String,
    position: String,
    job_title: String,
    license_type: String,
    license_no: String,
    license_exp: Date,
    ceu_no: {
        type: Number,
        default: 0
    },
    pfp: {
        type: Schema.Types.ObjectId,
        ref: 'Doc'
    },
    ceu: {
        type: Schema.Types.ObjectId,
        ref: 'Doc'
    },
    degree: {
        type: Schema.Types.ObjectId,
        ref: 'Doc'
    },
    cv: {
        type: Schema.Types.ObjectId,
        ref: 'Doc'
    },
    training_recs: {
        type: Schema.Types.ObjectId,
        ref: 'Doc'
    },
    license: {
        type: Schema.Types.ObjectId,
        ref: 'Doc'
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    lab_id: {
        type: Schema.Types.ObjectId,
        ref: 'Laboratory'
    },
    roles: {
        type: [
            {
                type: Number,
                enum: [1001, 1923, 2005] // 1001: Staff, 1923: Supervisor, 2005: Admin
            },
        ],
        required: true,
        default: [1001]
    },
    active: {
        type: Boolean,
        default: false
    },
    lab_owner: {
        type: Boolean,
        default: false
    }
});

userSchema.plugin(passportLocalMongoose);

const User = mongoose.model('User', userSchema);

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

export default User;