import { UserTask } from "../models/views/UserTasks.js";
import moment from "moment";
import { ScheduleModel } from "../models/Schedule.js";
import { groupBy } from "../utils/arrayUtils.js";
import { expandAssignment } from "./schedule.js";
import ScheduleMapModel from "../models/ScheduleMap.js";
import EquipmentLogModel from "../models/EquipmentLog.js";

// Define the controller function
export const getAllUserTasks = async (req, res) => {
    const queries = req.query;
    const lastDayOfMonth = moment().endOf("month").toDate();
    const firstDayOfMonth = moment().startOf("month").toDate();

    let { startDate = firstDayOfMonth, endDate = lastDayOfMonth } = queries;
    startDate = moment(startDate);
    endDate = moment(endDate);


    // Apply any filters provided in the query parameters
    const lab_id = queries.lab_id ? queries.lab_id : req.user.lab_id;


    try {
        // Fetch all user tasks from the database
        const userTasks = await UserTask.getAllUserTasksInLab(lab_id, {
            startDate,
            endDate,
        });


        const raw = false;
        const sched = await ScheduleModel.find({});

        const assignments = sched.flatMap(val => expandAssignment(val, startDate, endDate, (raw == 'true'), true));
        const schedules = groupBy(assignments, 'date');
        const tasks = groupBy(userTasks, 'date');


        const status = [];
        for (const [day, schedulesOfDay] of Object.entries(schedules)) {

            const notAssignedEquipSchs = [];

            for (const { _id, type } of schedulesOfDay) {
                if (type !== 'equipment') continue;

                const map = await ScheduleMapModel.findOne({ sch_id: _id, date: day });
                if (!map) {
                    notAssignedEquipSchs.push({ _id, type });
                }
            }
            
            const notAssignedEquipSchIds = notAssignedEquipSchs.map(({ _id }) => _id);

            const notAssEquipSchsFilledCount = await EquipmentLogModel.countDocuments({
                date: day,
                sch_id: {
                    $in: notAssignedEquipSchIds
                }
            })

            //if no task or  no not assigned tasks exist go to next iteration
            if (!tasks[day] && !notAssignedEquipSchIds.length) continue;

            const dayStatus = {
                date: day,
            }

            // inlude tasks per day only if it exist
            if(tasks[day]) dayStatus.tasks = tasks[day][0].tasks
            // inlude notAssignedSchcdulesStatus per day only if it exist
            if (notAssignedEquipSchIds.length) {
                dayStatus.notAssignedSchcdulesStatus = {
                    total: notAssignedEquipSchIds.length,
                    done: notAssEquipSchsFilledCount
                }
            }
            status.push(dayStatus)
        }

        // Send the fetched user tasks as a response
        res.status(200).json({
            success: true,
            payload: status,
            message: "User tasks fetched successfully"
        });
    } catch (error) {
        // If there's an error, send an error response
        res.status(500).json({
            success: false,
            message: "Error fetching user tasks",
            error: error.message
        });
    }
};

// Define the controller function
export const getUserTaskById = async (req, res) => {
    const { id } = req.params; // Get the ID from the request parameters
    // Get the first day of the current month
    const { lab_id } = req.user;

    try {
        // Fetch the user task with the given ID from the database
        // const userTask = await UserTask.aggregate(pipline);

        const userTasks = await UserTask.getUserTasksById(id, {
            startDate: req.query.startDate,
            endDate: req.query.endDate,
            lab_id
        });
        console.log(req.query.endDate)

        if (userTasks.length === 0) {
            // If the user task is not found, send a not found response
            return res.status(200).json({
                success: true,
                data: {},
                message: "No tasks found",
            });
        }

        // Send the fetched user task as a response
        res.status(200).json({
            success: true,
            payload: userTasks,
            message: "User task fetched successfully",
        });
    } catch (error) {
        // If there's an error, send an error response
        res.status(500).json({
            success: false,
            message: "Error fetching user task",
            error: error.message,
        });
    }
};


