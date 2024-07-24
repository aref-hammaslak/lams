import User from '../models/User.js';
import lodash from 'lodash';
const { omit } = lodash;

import { canUserAccessRole, canUserChangeOther, isUserPrivileged } from '../services/userRole.js';
import ExpressError from '../utils/ExpressError.js';

/**
 * @type {import("express").RequestHandler}
 */
export const getAll = async (req, res) => {
    const { q } = req.query;

    const query = { lab_id: req.user.lab_id, roles: { $ne: 2005 }, _id: { $ne: req.user._id } };
    if (q) {
        query.$or = [{ username: { $regex: q } }, { name: { $regex: q } }];
    }

    const users = await User.find(query, { username: 1, name: 1, active: 1 });

    res.send({
        success: true,
        payload: users
    });
};

/**
 * @type {import("express").RequestHandler}
 */
export const getUser = async (req, res) => {
    const { id } = req.params;
    const user = await User.findById(id);

    res.send({
        success: true,
        payload: user
    });
};

/**
 * @type {import("express").RequestHandler}
 */
export const getSelf = (req, res) => {
    res.send({
        success: true,
        payload: req.user
    });
};

/**
 * @type {import("express").RequestHandler}
 */
export const login = async (req, res) => {
    const { _id: id, username, email, roles, lab_id, active } = req.user;
    res.send({
        success: true,
        payload: {
            id, username,
            email, roles,
            active, lab_id
        }
    });
};

/**
 * @type {import("express").RequestHandler}
 */
export const logout = async (req, res) => {
    console.log('--------->>>>>>---------');
    req.logout(function (err) {
        if (err) {
            throw err;
        }
    });
    res.send({
        success: true,
        payload: { message: 'logged out!' }
    });
};

/**
 * @type {import("express").RequestHandler}
 */
export const createUser = async (req, res) => {
    const { password, ...data } = req.body;

    const user = new User({ ...data, lab_id: req.user.lab_id });
    try {
        await User.register(user, password);
    } catch (error) {
        switch (error.name) {
            case 'UserExistsError':
            case 'EmailExistsError':
                throw new ExpressError(error.message, 409);
            case 'MongoServerError':
                if (error.code == '11000') {
                    if ('email' in error.keyValue) {
                        throw new ExpressError('A user with the given email is already registered', 409);
                    }
                }
            default:
                throw error;
        }
    }

    res.send({
        success: true,
        payload: omit(user.toJSON(), ['salt', 'hash', '__v'])
    });
};

/**
 * @type {import("express").RequestHandler}
 */
export const updateUser = async (req, res) => {
    const self = req.user;

    const { id } = req.params;
    const updates = req.body;

    let user = await User.findById(id);
    if (!user) {
        throw new ExpressError(`User does not exist`, 404);
    }

    if (id != self.id && ! await canUserChangeOther(self, user)) {
        throw new ExpressError(`Not authorized to add user to role ${role_id}`, 401);
    }

    // Only privileged role ids are allowed to change the lab_owner field
    if ('lab_owner' in updates) {
        if (! await isUserPrivileged(self)) {
            throw new ExpressError(`Not authorized change lab_owner field`, 401);
        }
    }

    // Validate roles
    if ('roles' in updates) {
        for (const role_id of updates.roles) {
            try {
                if (! await canUserAccessRole(self, user, role_id)) {
                    throw new ExpressError(`Not authorized to add user to role ${role_id}`, 401);
                }
            } catch {
                // Just in case role ID does not exist in the ACL
                throw new ExpressError(`Not authorized to add user to role ${role_id}`, 401);
            }
        }
    }

    try {
        user = await User.findByIdAndUpdate(id, updates, { new: true });
    } catch (error) {
        switch (error.name) {
            case 'MongoServerError':
                if (error.code == '11000') {
                    if ('email' in error.keyValue) {
                        throw new ExpressError('A user with the given email is already registered', 409);
                    }
                }
            default:
                throw error;
        }
    }

    res.send({
        success: true,
        payload: user
    });
};

/**
 * @type {import("express").RequestHandler}
 */
export const toggleUser = async (req, res) => {
    const { id } = req.params;
    const user = await User.findById(id, { username: 1, name: 1, active: 1 });
    user.active = !user.active;
    await user.save();
    res.send({
        success: true,
        payload: user
    });
};

/**
 * @type {import("express").RequestHandler}
 */
export const destroyUser = async (req, res) => {
    const { id } = req.params;

    const user = await User.findByIdAndDelete(id);

    res.send({
        success: true,
        payload: user
    });
};

/**
 * @type {import("express").RequestHandler}
 */
export const setAdminLab = async (req, res) => {
    const { lab_id } = req.params;
    const user = await User.findByIdAndUpdate(req.user._id, { lab_id }, { new: true });
    res.send({
        success: true,
        payload: user
    });
};