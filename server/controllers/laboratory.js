import fs from 'fs/promises';
import Lab from '../models/Laboratory.js';
import ExpressError from '../utils/ExpressError.js';
import User from '../models/User.js';


import { UserTask } from '../models/views/UserTasks.js';
import moment from 'moment';

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
    const { sup_username, sup_email, sup_password, ...data } = req.body;

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
        if (updates.lab_pfp && oldLab.lab_pfp) {
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

export const getAllLabsStats = async (req, res) => {

    try {
        const labsAnnullayStats = await UserTask.getAllLabsStats({
            startDate: moment().startOf('year'),
            endDate: moment(),
        });

        const labsMonthlyStats = await UserTask.getAllLabsStats({
            startDate: moment().startOf('month'),
            endDate: moment(),
        });


        let labs = await Lab.find({}, {
            name: 1,
            email: 1,
            category: 1,
            phone:1
        }).lean();

        labs = labs.map(lab => {
            const annullStats = labsAnnullayStats.find(stat => stat._id.toString() === lab._id.toString());
            const monthStats = labsMonthlyStats.find(stat => stat._id.toString() === lab._id.toString());

            const result = {
                ...lab,
                stats: {
                    logs: {
                        currentYear: {
                            total: 0,
                        },
                        currentMonth: {
                            total: 0,
                        }
                    }
                }
            }

            if (annullStats) {
                const { total, done } = annullStats;
                result.stats.logs.currentYear = {
                    total,
                    done,
                    unDone: total - done
                }
            }
            if (monthStats) {
                const { total, done } = monthStats;
                result.stats.logs.currentMonth = {
                    total,
                    done,
                    unDone: total - done
                }
            }
            return result;
        })

        res.status(200).json({
            success: true,
            payload: labs,
        });
    } catch (error) {
        // If there's an error, send an error response
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

export const getLabUsersStats = async (req, res) => {

    const lab_id = req.params.id;
    try {
        const labAnnullayStats = await UserTask.getLabUsersStats(lab_id,{
            startDate: moment().startOf('year'),
            endDate: moment(),
        });

        const labMonthlyStats = await UserTask.getLabUsersStats(lab_id,{
            startDate: moment().startOf('month'),
            endDate: moment(),
        });


        let users = await User.find({ lab_id }, {
            name: 1,
            username: 1
        }).lean();

        users = users.map(user => {
            const annullStats = labAnnullayStats.find(stat => stat._id.toString() === user._id.toString());
            const monthStats = labMonthlyStats.find(stat => stat._id.toString() === user._id.toString());

            const result = {
                ...user,
                stats: {
                    logs: {
                        currentYear: {
                            total: 0,
                        },
                        currentMonth: {
                            total: 0,
                        }
                    }
                }
            }

            if (annullStats) {
                const { total, done } = annullStats;
                result.stats.logs.currentYear = {
                    total,
                    done,
                    unDone: total - done
                }
            }
            if (monthStats) {
                const { total, done } = monthStats;
                result.stats.logs.currentMonth = {
                    total,
                    done,
                    unDone: total - done
                }
            }
            return result;
        })

        res.status(200).json({
            success: true,
            payload: users,
        });
    } catch (error) {
        // If there's an error, send an error response
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

