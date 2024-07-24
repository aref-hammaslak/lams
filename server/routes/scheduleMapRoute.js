import { Router } from "express";
import { catchAsync } from "../utils/catchAsync.js";
import { isLoggedIn, isSup } from '../middlewares/auth.js';

import {
    getAllScheduleMap, createScheduleMap,
    deleteScheduleMap, updateScheduleMap, getMyScheduleMaps
} from '../controllers/scheduleMap.js';

const router = Router();

router.get('/', isLoggedIn, isSup, catchAsync(getAllScheduleMap))
    .get('/mine', isLoggedIn, catchAsync(getMyScheduleMaps))
    .post('/', isLoggedIn, isSup, catchAsync(createScheduleMap))
    .delete('/:id', isLoggedIn, isSup, catchAsync(deleteScheduleMap))
    .patch('/:id', isLoggedIn, isSup, catchAsync(updateScheduleMap));

export default router;