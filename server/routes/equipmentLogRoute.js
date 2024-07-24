import { Router } from "express";

import { isLoggedIn } from "../middlewares/auth.js";
import { catchAsync } from "../utils/catchAsync.js";

import {
    getAllEquipmentLogs, createEquipmentLog,
    getEquipmentLog, deleteEquipmentLog, updateEquipmentLog
} from "../controllers/equipmentLog.js";

const router = Router();

router.get('/', isLoggedIn, catchAsync(getAllEquipmentLogs))
    .post('/', isLoggedIn, catchAsync(createEquipmentLog))
    .get('/:logId', isLoggedIn, catchAsync(getEquipmentLog))
    .delete('/:logId', isLoggedIn, catchAsync(deleteEquipmentLog))
    .patch('/:logId', isLoggedIn, catchAsync(updateEquipmentLog));

export default router;