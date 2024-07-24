import { ScheduleModel } from "../models/Schedule.js";

import moment from "moment";
import "moment-recur";

/**
 * Retrieves a Schedule by its ID
 * @param {(import("mongoose").ObjectId|str)} schId Schedule ID
 * @param {(import("mongoose").ObjectId|str)} labId Lab ID
 */
export async function getScheduleById(schId, labId) {
    return await ScheduleModel.findOne({ _id: schId, lab_id: labId });
}


/**
 * Check whether a schedule ID is in lab or not
 * @param {(import("mongoose").ObjectId|str)} schId Schedule I D
 * @param {(import("mongoose").ObjectId|str)} labId Lab ID
 */
export async function isScheduleInLab(schId, labId) {
    const sched = await getScheduleById(schId, labId);
    return (sched != null);
}

/**
 * Check whether a date belongs to a schedule entry or not
 * @param {ScheduleModel} schedule The schedule to check
 * @param {Date} date The date to check
 */
export function isDateInSchedule(schedule, date) {
    date = moment(date);

    const m = moment(schedule.initial_date);

    if (schedule.recurrence) {
        const endDate = (schedule.end_date) ? moment(schedule.end_date) : null;
        let interval = m.recur(m, endDate);
        switch (schedule.recurrence) {
            case 'weekly':
                interval = interval.every(1).week();
                break;
            case 'monthly':
                interval = interval.every(1).month();
                break;
            case 'quarterly':
                interval = interval.every(3).month();
                break;
            case 'semiannually':
                interval = interval.every(6).month();
                break;
            case 'annually':
                interval = interval.every(1).year();
                break;
        }

        return interval.matches(date);
    } else {
        return m.isSame(date);
    }
}