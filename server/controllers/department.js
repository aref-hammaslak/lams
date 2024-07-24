import Department from "../models/Department.js"

export const getAll = async (req, res) => {
    const { lab_id } = req.user;
    const deps = await Department.find({ lab_id }).lean();
    res.send({
        success: true,
        payload: deps
    });
}

export const getDep = async (req, res) => {
    const { lab_id } = req.user.lab_id;
    const { id } = req.params;
    const dep = await Department.findOne({ _id: id, lab_id });
    res.send({
        success: true,
        payload: dep
    });
}

export const createDep = async (req, res) => {
    const { lab_id } = req.user;
    const { name } = req.body;
    const dep = new Department({ lab_id, name });
    await dep.save();

    res.send({
        success: true,
        payload: dep
    })
}

export const updateDep = async (req, res) => {
    const { lab_id } = req.user;
    const { id } = req.params;
    const {name, active} = req.body;

    const dep = await Department.findOneAndUpdate({ _id: id, lab_id }, {name, active}, {new: true});
    
    res.send({
        success: true,
        payload: dep
    });
}

export const destroyDep = async (req, res) => {
    const { lab_id } = req.user;
    const { id } = req.params;

    const dep = await Department.findOneAndDelete({ _id: id, lab_id});
    res.send({
        success: true,
        payload: dep
    });
}
