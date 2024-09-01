import UserModel from "../models/User.js";

export async function getUserById(id) {
    return await UserModel.findById(id);
}

export async function isUserInLab(user_id, lab_id) {
    const user = UserModel.findOne({ _id: user_id, lab_id: lab_id })
    if (user) return true;
}