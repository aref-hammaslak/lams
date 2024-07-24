import fs from 'fs/promises';
import Lab from '../models/Laboratory.js';
import ExpressError from '../utils/ExpressError.js';
import User from '../models/User.js';

export const getAll = async (req, res) => {
    const labs = await Lab.find({});

    res.send({
        success: true,
        payload: labs
    });
}
export const getLab = async (req, res) => {
    const { id } = req.params;

    if (id !== req.user.lab_id.toString())
        throw new ExpressError('Unauthorzed Access!', 401);

    const lab = await Lab.findById(id).lean();

    res.send({
        success: true,
        payload: lab
    });
}
export const createLab = async (req, res) => {
    const {sup_username, sup_email, sup_password, ...data} = req.body;

    const lab = new Lab(data);
    await lab.save();
    // create supervisor
    try {
    const sup = new User({
        username: sup_username,
        email: sup_email,
        roles: [1001, 1923],
        lab_id: lab._id,
        active: true
    });
    await User.register(sup, sup_password);
    } catch (error) {
        await Lab.findByIdAndDelete(lab._id);
        throw error;
    }

    res.send({
        success: true,
        payload: lab
    });
}
export const updateLab = async (req, res) => {
    const { id } = req.params;
    const updates = req.body;
    if (req.file) {
        updates.lab_pfp = req.file.path
    }

    const oldLab = await Lab.findByIdAndUpdate(id, updates).lean();

   try {
        console.log('updates.lab_pfp', updates.lab_pfp)
        if(updates.lab_pfp && oldLab.lab_pfp) {
            await fs.unlink(oldLab.lab_pfp);
        }
    } catch (e) {
        req.log.error(e);
    }

    res.send({
        success: true,
        payload: await Lab.findById(id).lean()
    });
}
export const destroyLab = async (req, res) => {
    const { id } = req.params;

    const lab = await Lab.findByIdAndDelete(id).lean();

    res.send({
        success: true,
        payload: lab
    })
}