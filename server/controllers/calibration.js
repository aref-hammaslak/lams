import mongoose from "mongoose";

import Calibration from "../models/Calibration.js";
import ExpressError from "../utils/ExpressError.js";

import {
    getCalibrations,
    getCalibrationById
} from "../services/calibration.js";
import {
    getEquipmentById
} from "../services/equipment.js";

const calibNotFoundError = new ExpressError('Calibration not found', 404);
const eqNotFoundError = new ExpressError('Equipment not found', 400);

/**
 * @type {import("express").RequestHandler}
 */
export async function getAllCalibrations(req, res) {
    const { lab_id: labId } = req.user;

    const eqId = req.query['eq-id'] ? new mongoose.Types.ObjectId(req.query['eq-id']) : null;
    const dateStart = req.query['date-start'] ? new Date(req.query['date-start']) : null;
    const dateEnd = req.query['date-end'] ? new Date(req.query['date-end']) : null;


    res.send({
        success: true,
        payload: await getCalibrations(labId, eqId, dateStart, dateEnd)
    });
}

/**
 * @type {import("express").RequestHandler}
 */
export async function getCalibration(req, res) {
    const { lab_id: labId } = req.user;
    const { id } = req.params;

    const calibration = await getCalibrationById(id, labId);
    if (!calibration) {
        throw calibNotFoundError;
    }

    res.send({
        success: true,
        payload: calibration
    });
}

/**
 * @type {import("express").RequestHandler}
 */
export async function createCalibration(req, res) {
    const { lab_id: labId } = req.user;
    const data = req.body;

    if (!await getEquipmentById(data.eq_id, labId)) {
        throw eqNotFoundError;
    }

    const calibration = new Calibration(data);
    await calibration.save();

    res.send({
        success: true,
        payload: calibration
    });
}

/**
 * @type {import("express").RequestHandler}
 */
export async function updateCalibration(req, res) {
    const { lab_id: labId } = req.user;
    const { id } = req.params;
    const updates = req.body;

    let calibration = await getCalibrationById(id, labId);
    if (!calibration) {
        throw calibNotFoundError;
    }

    if ('eq_id' in updates) {
        if (!await getEquipmentById(updates.eq_id, labId)) {
            throw eqNotFoundError;
        }
    }

    await calibration.updateOne(updates);

    res.send({
        success: true,
        payload: await getCalibrationById(id, labId)
    });
}

/**
 * @type {import("express").RequestHandler}
 */
export async function deleteCalibration(req, res) {
    const { lab_id: labId } = req.user;
    const { id } = req.params;

    const calibration = await getCalibrationById(id, labId);
    if (!calibration) {
        throw calibNotFoundError;
    }
    await calibration.deleteOne();

    res.send({
        success: true,
        payload: calibration
    });
}