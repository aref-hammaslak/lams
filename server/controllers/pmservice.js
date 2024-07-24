import mongoose from "mongoose";

import PMService from "../models/PMService.js";
import ExpressError from "../utils/ExpressError.js";

import {
    getPMServiceById,
    getPMServices
} from "../services/pmservice.js";
import {
    getEquipmentById
} from "../services/equipment.js";

const pmSvcNotFoundError = new ExpressError('PM Service not found', 404);
const eqNotFoundError = new ExpressError('Equipment not found', 400);

/**
 * @type {import("express").RequestHandler}
 */
export async function getAllPMServices(req, res) {
    const { lab_id: labId } = req.user;

    const eqId = req.query['eq-id'] ? new mongoose.Types.ObjectId(req.query['eq-id']) : null;
    const dateStart = req.query['date-start'] ? new Date(req.query['date-start']) : null;
    const dateEnd = req.query['date-end'] ? new Date(req.query['date-end']) : null;


    res.send({
        success: true,
        payload: await getPMServices(labId, eqId, dateStart, dateEnd)
    });
}

/**
 * @type {import("express").RequestHandler}
 */
export async function getPMService(req, res) {
    const { lab_id: labId } = req.user;
    const { id } = req.params;

    const pmSvc = await getPMServiceById(id, labId);
    if (!pmSvc) {
        throw pmSvcNotFoundError;
    }

    res.send({
        success: true,
        payload: pmSvc
    });
}

/**
 * @type {import("express").RequestHandler}
 */
export async function createPMService(req, res) {
    const { lab_id: labId } = req.user;
    const data = req.body;

    if (!await getEquipmentById(data.eq_id, labId)) {
        throw eqNotFoundError;
    }

    const pmSvc = new PMService(data);
    await pmSvc.save();

    res.send({
        success: true,
        payload: pmSvc
    });
}

/**
 * @type {import("express").RequestHandler}
 */
export async function updatePMService(req, res) {
    const { lab_id: labId } = req.user;
    const { id } = req.params;
    const updates = req.body;

    let pmSvc = await getPMServiceById(id, labId);
    if (!pmSvc) {
        throw pmSvcNotFoundError;
    }

    if ('eq_id' in updates) {
        if (!await getEquipmentById(updates.eq_id, labId)) {
            throw eqNotFoundError;
        }
    }

    await pmSvc.updateOne(updates);

    res.send({
        success: true,
        payload: await getPMServiceById(id, labId)
    });
}

/**
 * @type {import("express").RequestHandler}
 */
export async function deletePMService(req, res) {
    const { lab_id: labId } = req.user;
    const { id } = req.params;

    const pmSvc = await getPMServiceById(id, labId);
    if (!pmSvc) {
        throw pmSvcNotFoundError;
    }
    await pmSvc.deleteOne();

    res.send({
        success: true,
        payload: pmSvc
    });
}