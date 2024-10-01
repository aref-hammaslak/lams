import { Router } from "express";
import { catchAsync } from "../utils/catchAsync.js";
import { isLoggedIn, isSup } from '../middlewares/auth.js';

import {
    getSchedule, getWholeSchedule, setScheduleAssignment,
    getScheduleAssignment, updateScheduleAssignment,
    deleteScheduleAssignment
} from '../controllers/schedule.js';

const router = Router();

router.get('/', isLoggedIn, isSup, catchAsync(getWholeSchedule))
    .get('/:type/:id', isLoggedIn, isSup, catchAsync(getSchedule))
    .post('/:type/:id', isLoggedIn, isSup, catchAsync(setScheduleAssignment))
    .get('/:id', isLoggedIn, isSup, catchAsync(getScheduleAssignment))
    .patch('/:id', isLoggedIn, isSup, catchAsync(updateScheduleAssignment))
    .delete('/:ids', isLoggedIn, isSup, catchAsync(deleteScheduleAssignment));

export default router;