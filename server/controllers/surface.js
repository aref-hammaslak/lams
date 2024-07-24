import Surface from "../models/Surface.js";

export const getAllSurfaces = async (req, res) => {
    const { lab_id } = req.user;

    const surfaces = await Surface.find({ lab_id }).lean();

    res.send({
        success: true,
        payload: surfaces
    });
};

export const getSurface = async (req, res) => {
    const { lab_id } = req.user;
    const { id } = req.params;

    const surface = await Surface.findOne({ _id: id, lab_id });

    res.send({
        success: true,
        payload: surface
    });
};

export const createSurface = async (req, res) => {
    const { lab_id } = req.user;
    const data = req.body;

    const surface = new Surface({ lab_id, ...data });
    await surface.save();

    res.send({
        success: true,
        payload: surface
    });
};

export const updateSurface = async (req, res) => {
    const { lab_id } = req.user;
    const { id } = req.params;
    const updates = req.body;

    const surface = await Surface.findOneAndUpdate({ _id: id, lab_id }, updates, { new: true });

    res.send({
        success: true,
        payload: surface
    });
};

export const deleteSurface = async (req, res) => {
    const { lab_id } = req.user;
    const { id } = req.params;

    const surface = await Surface.findOneAndDelete({ _id: id, lab_id });
    res.send({
        success: true,
        payload: surface
    });
};
