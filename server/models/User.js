import mongoose, { Schema } from 'mongoose';
import passport from 'passport';
import LocalStrategy from 'passport-local';
import passportLocalMongoose from 'passport-local-mongoose';
import moment from 'moment';
import { isOverlap } from '../services/user.js';


export const absenceSchema = new mongoose.Schema({
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true,
        validate: {
            validator: function (value) {
                return moment(this.startDate).isBefore(value);
            },
            message: 'End date must be greater  than the start date.'
        }
    },
    reason: {
        type: String,
        enum: ['sick', 'vacation', 'personal', 'other'], // Example reasons
        default: 'other'
    }
});

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
    },
    absences: {
        type: [absenceSchema],
        default: []
    },
});

userSchema.set('toJSON', { virtuals: true });
userSchema.set('toObject', { virtuals: true });

userSchema.virtual('isAbsentToday').get(function () {
    const today = moment();
    if (!this.absences) return false;
    for (const absence of this.absences) {

        const { startDate, endDate } = absence;
        if (today.isBetween(startDate, endDate, 'day', '[)')) return true;
    }
    return false;
})


userSchema.statics.getAbsenceDays = function (absences, from, to) {
    if (!absences) return [];
    try {
        from = moment(from);
        to = moment(to);
        if (!from.isValid() || !to.isValid()) {
           throw new Error("Dates are invaid");
        }
        let allDays = [];
        for (const absence of absences) {
            let currentDate = moment(absence.startDate);
            while (currentDate.isBefore(absence.endDate) && currentDate.isBetween(from, to, 'day', '[]')) {
                allDays.push(
                    {
                        absence_id: absence._id,
                        date: currentDate.format('YYYY/MM/DD'),
                        startDate: moment(absence.startDate).format('YYYY/MM/DD'),
                        endDate: moment(absence.endDate).format('YYYY/MM/DD'),
                    }
                );
                currentDate.add(1, 'days');
            }
        }
        return allDays;
    } catch (error) {
        throw new Error(error.message);
        
    }
}


userSchema.statics.addAbsence = async function (userId, absence) {
    try {
        const user = await this.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }

        const hasOverlap = user.absences.some(existingAbsence =>
            isOverlap(absence, existingAbsence)
        );

        if (hasOverlap) {
            throw new Error('The new absence overlaps with an existing absence.');
        }

        user.absences.push(absence);
        await user.save();
        return user;
    } catch (error) {
        throw new Error(error.message);
    }
};

userSchema.statics.deleteAbsence = async function (userId, absenceId) {
    try {
        const user = await this.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }
        const absenceIndex = user.absences.findIndex(absence => { return new mongoose.Types.ObjectId(absenceId).equals(absence._id) });
        if (absenceIndex === -1) {
            throw new Error("Absence not found");
        }
        user.absences.splice(absenceIndex, 1) // Removes the absence with the matching ID
        await user.save();
        return user;
    } catch (error) {
        throw new Error(error.message);
    }
};


userSchema.plugin(passportLocalMongoose);

const User = mongoose.model('User', userSchema);

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

export { userSchema, User }
export default User;