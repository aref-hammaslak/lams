import EquipmentLogModel from "../models/EquipmentLog.js";
import LogTemplate from "../models/LogTemplate.js";
import { generateScheduleIntervals } from "../services/schedule.js";
import moment from "moment";


export async function autoFillLogTemplateWithId(req, res) {
    try {
        const { start_date, end_date } = req.query;
        const { logTemp_id } = req.params;
        const { lab_id, id:user_id } = req.user;
        
        const { schedules } = await LogTemplate.getAllLogTemplateSchedules({ lab_id, logTemp_id, start_date, end_date }) ?? [];

        if (!schedules) {
            return res.send({
                success: false,
                error: {
                    message: 'No logs found for this month'
                }
            })
        }
        const logTemp = await LogTemplate.findById(logTemp_id);

        const logs = await autoFill(logTemp, schedules, user_id, start_date, end_date);

        res.send({
            success: true,
            payload: logs,
        })
    } catch (error) {
        console.log(error);
        res.status(400).send({
            success: false,
            error: {
                message:error.message
            }
        })
    }
}

export async function autoFillOneLogTemplateWithSchId(req, res) {
    const { date} = req.query;
    const { logTemp_id , sch_id} = req.params;
    const {  id: user_id } = req.user;

    const logTemp = await LogTemplate.findById(logTemp_id);
    const items = logTemp.items.reduce((acc, item) => {
        acc[item.label] = item.default_value ?? 'some random value';
        return acc;
    }, {});
    const log = {
        temp_id: logTemp._id,
        user_id,
        items: items,
        sch_id,
        date
    }
    const autoFilledLog = new EquipmentLogModel(log);
    await autoFilledLog.save();
    res.send({
        success: true,
        payload: autoFilledLog,
        message: 'The log Filled Automaticlly'
    })
}

async function autoFill(logTemp, schedules, user_id, rangeStartDate, rangeEndDate) {
    const autoFilledLogs = [];
    const items = logTemp.items.reduce((acc, item) => {
        acc[item.label] = item.default_value ?? 'some random value';
        return acc;
    }, {});
    const newLog = {
        temp_id: logTemp._id,
        user_id,
        items: items
    } 

    // console.log('logTemp, schedules :', logTemp, schedules);
    for( const schedule of schedules)  {
        const { initial_date: start_date, end_date, recurrence } = schedule;
        // console.log('start_date, end_date, reccurence :', start_date, end_date, recurrence);
        newLog.sch_id = schedule._id;

        const intervals = generateScheduleIntervals(
            moment(start_date).isBefore(rangeStartDate, 'day') ? rangeStartDate : start_date,
            moment(end_date).isAfter(rangeEndDate, 'day') ? moment(rangeEndDate).add(1, 'day') : end_date,
            recurrence);
        // console.log(intervals);
        for(const date of intervals) {
            const log = await EquipmentLogModel.findOne({
            temp_id: logTemp._id,
            date
            })
            if (log) continue;
            newLog.date = date;
            const autoFilledLog =  new EquipmentLogModel(newLog);
            await autoFilledLog.save();
            autoFilledLogs.push(autoFilledLog);
        }
    }
    return autoFilledLogs;
}