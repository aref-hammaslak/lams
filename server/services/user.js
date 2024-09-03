import UserModel from "../models/User.js";
import { userSchema } from "../models/User.js";
import moment from "moment";

export async function getUserById(id) {
    return await UserModel.findById(id);
}

export async function isUserInLab(user_id, lab_id) {
    const user = UserModel.findOne({ _id: user_id, lab_id: lab_id })
    if (user) return true;
}

export function isOverlap(newAbsence, existingAbsence) {
    const newAbStartDate = moment(newAbsence.startDate);
    const newAbEndDate = moment(newAbsence.endDate);
    const { startDate, endDate } = existingAbsence;
    return (
        newAbStartDate.isBetween(startDate, endDate, 'day', '[)') ||
        newAbEndDate.isBetween(startDate, endDate, 'day', '(]' )
    );
}