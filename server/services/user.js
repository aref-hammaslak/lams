import UserModel from "../models/User.js";

export async function getUserById(id) {
    return await UserModel.findById(id);
}