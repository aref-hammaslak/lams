import User, { absenceSchema } from '../models/User.js';

import lodash from 'lodash';
const { omit } = lodash;

import { canUserAccessRole, canUserChangeOther, isUserPrivileged } from '../services/userRole.js';
import ExpressError from '../utils/ExpressError.js';
import moment from 'moment';
import Thermometer from '../models/Thermometer.js';

/**
 * @type {import("express").RequestHandler}
 */
export const getAll = async (req, res) => {
    try {
        const { q } = req.query;

        const query = { lab_id: req.user.lab_id, roles: { $ne: 2005 }, _id: { $ne: req.user._id } };
        if (q) {
            query.$or = [{ username: { $regex: q } }, { name: { $regex: q } }];
        }

        const users = await User.find(query, { username: 1, name: 1, active: 1, absences: 1 });
        // const users = await User.find(query);

        res.send({
            success: true,
            payload: users
        });
    } catch (error) {
        throw new ExpressError(error.message, 500);
    }

};

/**
 * @type {import("express").RequestHandler}
 */
export const getUser = async (req, res) => {
    const { id } = req.params;
    const { expand_absences } = req.query;
    try {
        const user = await User.findById(id).lean();

        if (!user) throw new Error("User not found");
        if (expand_absences) {
            const from = req.query.from || moment().startOf('month');
            const to = req.query.to || moment().endOf('month').add(1, 'days');
            user.absences = User.getAbsenceDays(user.absences, from, to);
        }

        return res.send({
            success: true,
            payload: user
        });
    } catch (error) {
        throw new ExpressError(error.message, 400);
    }


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

    const user = new User({ ...data, lab_id: req.user?.lab_id });

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
    const { add_absence, delete_absence } = req.query;
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


    if (add_absence) {

        try {
            const newAbsence = {
                startDate: req.body.start_date,
                endDate: req.body.end_date,
                reason: req.body.resoan,
            }
            const user = await User.addAbsence(id, newAbsence);
            return res.status(200).send({
                success: true,
                payload: user
            })
        } catch (error) {
            throw new ExpressError(error.message, 400);
        }
    }

    if (delete_absence) {
        try {
            user = await User.deleteAbsence(id, req.query.absence_id);

            return res.status(200).send({
                success: true,
                payload: user
            })
        } catch (error) {
            console.error(error);
            throw new ExpressError(error.message, 400);
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
 * @type { import('express').RequestHandler} 
 */
export const resetPassword = async (req, res) => {
    const { id: userId } = req.params;
    const { newPassword } = req.body
    try {
        const user = await User.findById(userId);
        if (!user) throw new ExpressError('User not found', 400);
        if (req.user._id === userId) throw new ExpressError('You are not allow to reset your password', 401);
        if (!canUserChangeOther(req.user, user)) throw new ExpressError("Unauthorized request!", 401);
        await user.setPassword(newPassword);
        await user.save();

        res.send({
            success: true,
            payload: user,
            message: 'Password reseted successfully'
        })

    } catch (error) {
        throw new ExpressError(error.message, 500);
    }
}

/**
 *@type {import('express').RequestHandler} 
 * @param {import('express').Request} req 
 * @param {import('express').Response} res
 */
export const changePassword = async (req, res) => {
    const { id: userId } = req.params;
    const { oldPassword, newPassword } = req.body;
    try {
        const user = await User.findById(userId);
        if (!user) throw new ExpressError("User not found", 400);
        if (!canUserChangeOther(req.user, user)) throw new ExpressError("Unauthorized request!", 401);
        if (!oldPassword || !newPassword) throw new ExpressError("oldPassword or newPassword not provided", 400);

        await user.changePassword(oldPassword, newPassword); 
        await user.save();
        res.send({
            success: true,
            payload: user,
            message: 'User password changed sucessfully'
        })

    } catch (error) {
         throw new ExpressError(error.message, 500);
    }
}


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