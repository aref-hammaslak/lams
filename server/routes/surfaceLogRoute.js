import { Router } from "express";

import { isLoggedIn } from "../middlewares/auth.js";
import { catchAsync } from "../utils/catchAsync.js";

import {
    getAllSurfaceLogs, createSurfaceLog,
    getSurfaceLog, deleteSurfaceLog, updateSurfaceLog
} from "../controllers/surfaceLog.js";

const router = Router();

router.get('/', isLoggedIn, catchAsync(getAllSurfaceLogs))
    .post('/', isLoggedIn, catchAsync(createSurfaceLog))
    .get('/:logId', isLoggedIn, catchAsync(getSurfaceLog))
    .delete('/:logId', isLoggedIn, catchAsync(deleteSurfaceLog))
    .patch('/:logId', isLoggedIn, catchAsync(updateSurfaceLog));

export default router;