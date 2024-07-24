import { Router } from "express";

import { isSup, isLoggedIn } from "../middlewares/auth.js";
import { catchAsync } from "../utils/catchAsync.js";

import {
    getAllCalibrations,
    getCalibration,
    createCalibration,
    updateCalibration,
    deleteCalibration
} from "../controllers/calibration.js";

const router = Router();

router.get('/', isLoggedIn, isSup, catchAsync(getAllCalibrations))
    .post('/', isLoggedIn, isSup, catchAsync(createCalibration))
    .get('/:id', isLoggedIn, isSup, catchAsync(getCalibration))
    .patch('/:id', isLoggedIn, isSup, catchAsync(updateCalibration))
    .delete('/:id', isLoggedIn, isSup, catchAsync(deleteCalibration));

export default router;