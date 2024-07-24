import UserRoleModel from "../models/UserRole.js";
import { findUserRoleById } from "../services/userRole.js";
import ExpressError from "../utils/ExpressError.js";

const ADMIN_ROLE_ID = 2005;

const ADMIN_ACL = {
    role_id: ADMIN_ROLE_ID
};

/**
 * @type {import("express").RequestHandler}
 */
export async function createUserRole(req, res) {
    const data = req.body;

    if (!('acl' in data)) {
        data.acl = [];
    }
    if (data.role_id !== ADMIN_ROLE_ID) {
        data.acl.push(ADMIN_ACL);
    }

    const userRole = new UserRoleModel(data);
    await userRole.save();

    res.send({
        success: true,
        payload: userRole,
    });
}

/**
 * @type {import("express").RequestHandler}
 */
export async function getAllUserRole(req, res) {
    const userRoles = await UserRoleModel.find({});

    res.send({
        success: true,
        payload: userRoles,
    });
}

/**
 * @type {import("express").RequestHandler}
 */
export async function getUserRole(req, res) {
    const { id } = req.params;

    const userRole = await findUserRoleById(id);
    if (!userRole) {
        throw new ExpressError('User role not found', 404);
    }

    res.send({
        success: true,
        payload: userRole,
    });
}

/**
 * @type {import("express").RequestHandler}
 */
export async function deleteUserRole(req, res) {
    const { id } = req.params;

    let userRole = await findUserRoleById(id);
    if (!userRole) {
        throw new ExpressError('User role not found', 404);
    }


    await userRole.deleteOne();

    res.send({
        success: true,
        payload: userRole,
    });
}

/**
 * @type {import("express").RequestHandler}
 */
export async function updateUserRole(req, res) {
    const { id } = req.params;
    const updates = req.body;

    let userRole = await findUserRoleById(id);
    if (!userRole) {
        throw new ExpressError('User role not found', 404);
    }

    await userRole.updateOne(updates);
    userRole = await findUserRoleById(id);

    res.send({
        success: true,
        payload: userRole,
    });
}