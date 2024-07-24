import Equipment from "../models/Equipment.js"

export const getAll = async (req, res) => {
    const { lab_id } = req.user;
    const equs = await Equipment.find({ lab_id }).lean();
    res.send({
        success: true,
        payload: equs
    });
}

export const getEqu = async (req, res) => {
    const { lab_id } = req.user.lab_id;
    const { id } = req.params;
    const equ = await Equipment.findOne({ _id: id, lab_id });
    res.send({
        success: true,
        payload: equ
    });
}

export const createEqu = async (req, res) => {
    const { lab_id } = req.user;
    const data = req.body;
    const equ = new Equipment({ lab_id, ...data });
    await equ.save();

    res.send({
        success: true,
        payload: equ
    })
}

export const updateEqu = async (req, res) => {
    const { lab_id } = req.user;
    const { id } = req.params;
    const updates = req.body;

    const equ = await Equipment.findOneAndUpdate({ _id: id, lab_id }, updates, {new: true});
    
    res.send({
        success: true,
        payload: equ
    });
}

export const destroyEqu = async (req, res) => {
    const { lab_id } = req.user;
    const { id } = req.params;

    const equ = await Equipment.findOneAndDelete({ _id: id, lab_id});
    res.send({
        success: true,
        payload: equ
    });
}
