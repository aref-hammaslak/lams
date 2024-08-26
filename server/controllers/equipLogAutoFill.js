import EquipmentLogModel from "../models/EquipmentLog.js";
import LogTemplate from "../models/LogTemplate.js";
import { generateScheduleIntervals } from "../services/schedule.js";


export async function autoFillLogTemplateWithId(req, res) {
    try {
        const { start_date, end_date } = req.query;
        // console.log('start_date :', start_date);
        const { logTemp_id } = req.params;
        // console.log('req.param :', req.param);
        const { lab_id, id:user_id } = req.user;
        const {schedules} = await LogTemplate.getAllLogTemplateSchedules({ lab_id, logTemp_id, start_date, end_date })
        const logTemp = await LogTemplate.findById(logTemp_id);
        // console.log('logTemp :', logTemp);

        const logs = await autoFill(logTemp, schedules, user_id);
        // console.log(logs);
        res.send({
            succsus: true,
            payload: logs,
        })
    } catch (error) {
        console.log(error);
        res.status(400).send({
            succsus: false,
            error: {
                message:error.message
            }
        })
    }
}

async function autoFill(logTemp, schedules, user_id) {
    const autoFilledLogs = [];
    const items = logTemp.items.reduce((acc, item) => {
        acc[item.label] = item.default ?? 'some random value';
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

        const intervals = generateScheduleIntervals(start_date, end_date, recurrence);
        // console.log(intervals);
        for(const date of intervals) {
            const log = await EquipmentLogModel.findOne({
            temp_id: logTemp._id,
            sch_id: schedule._id,
            date
            })
            if (log) continue;
            newLog.date = date;
            const autoFilledLog = await new EquipmentLogModel(newLog);
            autoFilledLogs.push(autoFilledLog);
        }
    }
    return autoFilledLogs;
}