import Equipment from "../models/Equipment.js";

export async function getEquipmentById(eqId, labId) {
    return await Equipment.findOne({ _id: eqId, lab_id: labId });
}