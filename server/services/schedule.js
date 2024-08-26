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
            case 'daily':
                interval = interval.every(1).day();
                break;
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

export function generateScheduleIntervals(startDate, endDate, recurrence) {
    const dates = [];
    let currentDate = moment(startDate);
    console.log()
    while (currentDate.isBefore(endDate)) {
        dates.push(currentDate.clone().format('YYYY-MM-DD')); // Format as needed
        switch (recurrence) {
            case 'daily':
                currentDate.add(1, 'day');
                break;
            case 'weekly':
                currentDate.add(1, 'week');
                break;
            case 'monthly':
                currentDate.add(1, 'month');
                break;
            case 'quarterly':
                currentDate.add(3, 'month');
                break;
            case 'semiannually':
                currentDate.add(6, 'month');
                break;
            case 'annually':
                currentDate.add(1, 'year')
                break;
        }
    }

    return dates;
}