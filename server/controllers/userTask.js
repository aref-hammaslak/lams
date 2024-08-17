import { UserTask } from "../models/views/UserTasks.js";
import moment from "moment";
import mongoose from "mongoose";


// Define the controller function
export const getAllUserTasks = async (req, res) => {
    const queries = req.query;
    // Apply any filters provided in the query parameters
    const lab_id = queries.lab_id ? queries.lab_id : req.user.lab_id;
    try {
        // Fetch all user tasks from the database
        const userTasks = await UserTask.getAllUserTasksInLab(lab_id, {
            startDate: queries.startDate,
            endDate: queries.endDate,
        });
        // Send the fetched user tasks as a response
        res.status(200).json({
            success: true,
            payload: userTasks,
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
                data:{},
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



