import { Router } from "express";
import multer from "multer";
import { catchAsync } from "../utils/catchAsync.js";
import { isAdmin, isLoggedIn, isSup } from '../middlewares/auth.js';
import {
    getAll, getLab,
    createLab, updateLab,
    destroyLab,
    getAllLabsStats,
    getLabUsersStats
} from '../controllers/laboratory.js';
import {
    storage,
    fileFilter,
    limits
} from '../settings/diskStorage.js';

const router = Router();
const upload = multer({
    storage,
    fileFilter,
    limits
})

router.get('/', isLoggedIn, isAdmin, catchAsync(getAll))
    .get('/statistics', isLoggedIn, isAdmin, catchAsync(getAllLabsStats))
    .get('/:id/statistics', isLoggedIn, isSup, catchAsync(getLabUsersStats))
    .post('/', isLoggedIn, isAdmin, upload.single('lab_pfp'), catchAsync(createLab))
    .get('/:id', isLoggedIn, catchAsync(getLab))
    .patch('/:id', isLoggedIn, isSup, upload.single('lab_pfp'), catchAsync(updateLab))
    .delete('/:id', isLoggedIn, isAdmin, catchAsync(destroyLab))
  

export default router;