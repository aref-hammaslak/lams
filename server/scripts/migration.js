const mongoose = require("mongoose");
const config = require("config");
const bcrypt = require("bcrypt");

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: Number,
        required: true,
        enum: [0, 1]
    }
}, {
    timestamps: true
});

const User = mongoose.model('User', UserSchema);

mongoose.connect(config.get('dbUri'))

.then(_ => console.log("Migration started:"))

.then(_ => User.find({ role: 1 }).count())

.then(ac => ac? null : createAdminUser())

.then(_ => mongoose.disconnect())

.then(_ => console.log("OK"))

.catch(e => {
    console.error(e);
    process.exit(1);
});

async function createAdminUser() {

    const adminUsername = 'admin';
    const adminEmail = 'admin@email.com';
    const adminPassword = 'admin';

    const admin = new User({
        username: adminUsername,
        email: adminEmail,
        password: adminPassword,
        role: 1
    });

    const salt = await bcrypt.genSalt(config.get('saltWorkFactor'));
    const hash = await bcrypt.hash(adminPassword, salt);

    admin.password = hash;

    console.log("- Admin user created");

    await admin.save();

}
