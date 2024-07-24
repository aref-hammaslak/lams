import { Router } from "express";
import { catchAsync } from "../utils/catchAsync.js";
import { isSup, isLoggedIn } from '../middlewares/auth.js';
import {
    getAll, getEqu,
    createEqu, updateEqu,
    destroyEqu
} from '../controllers/equipment.js';

const router = Router();

router.get('/', isLoggedIn, isSup, catchAsync(getAll))
    .post('/', isLoggedIn, isSup, isSup, catchAsync(createEqu))
    .get('/:id', isLoggedIn, isSup, catchAsync(getEqu))
    .patch('/:id', isLoggedIn, isSup, catchAsync(updateEqu))
    .delete('/:id', isLoggedIn, isSup, catchAsync(destroyEqu));

export default router;