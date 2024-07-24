import mongoose from 'mongoose';

const aclSchema = new mongoose.Schema({
    role_id: {
        type: Number,
        required: true
    },
    same_lab: {
        type: Boolean,
        required: false,
        default: undefined
    },
    lab_owner: {
        type: Boolean,
        required: false,
        default: undefined
    }
}, { _id: 0 });

const userRoleSchema = new mongoose.Schema({
    name: String,
    role_id: Number,
    acl: [aclSchema],
    privileged: {
        type: Boolean,
        default: false
    },
    active: {
        type: Boolean,
        default: true
    }
});
userRoleSchema.index({ role_id: 1 }, { unique: true });

const UserRoleModel = mongoose.model('UserRole', userRoleSchema);

export default UserRoleModel;