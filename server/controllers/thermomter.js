import Thermometer from "../models/Thermometer.js";

export const getAllThermometers = async (req, res) => {
    const { lab_id } = req.user;

    const therms = await Thermometer.find({ lab_id }).lean();

    res.send({
        success: true,
        payload: therms
    });
};

export const getThermometer = async (req, res) => {
    const { lab_id } = req.user;
    const { id } = req.params;

    const therm = await Thermometer.findOne({ _id: id, lab_id });

    res.send({
        success: true,
        payload: therm
    });
};

export const createThermometer = async (req, res) => {
    const { lab_id } = req.user;
    const data = req.body;

    const therm = new Thermometer({ lab_id, ...data });
    await therm.save();

    res.send({
        success: true,
        payload: therm
    });
};

export const updateThermometer = async (req, res) => {
    const { lab_id } = req.user;
    const { id } = req.params;
    const updates = req.body;

    const therm = await Thermometer.findOneAndUpdate({ _id: id, lab_id }, updates, { new: true });

    res.send({
        success: true,
        payload: therm
    });
};

export const deleteThermometer = async (req, res) => {
    const { lab_id } = req.user;
    const { id } = req.params;

    const therm = await Thermometer.findOneAndDelete({ _id: id, lab_id });
    res.send({
        success: true,
        payload: therm
    });
};
