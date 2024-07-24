import { Router } from "express";
import { catchAsync } from "../utils/catchAsync.js";
import { isSup, isLoggedIn } from '../middlewares/auth.js';
import {
    getAll, getDep,
    createDep, updateDep,
    destroyDep
} from '../controllers/department.js';

const router = Router();

router.get('/', isLoggedIn, isSup, catchAsync(getAll))
    .post('/', isLoggedIn, isSup, catchAsync(createDep))
    .get('/:id', isLoggedIn, isSup, catchAsync(getDep))
    .patch('/:id', isLoggedIn, isSup, catchAsync(updateDep))
    .delete('/:id', isLoggedIn, isSup, catchAsync(destroyDep));

export default router;