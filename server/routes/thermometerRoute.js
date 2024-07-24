import { Router } from "express";
import { catchAsync } from "../utils/catchAsync.js";
import { isSup, isLoggedIn } from '../middlewares/auth.js';
import {
    createThermometer,
    deleteThermometer,
    getAllThermometers,
    getThermometer,
    updateThermometer
} from '../controllers/thermomter.js';

const router = Router();

router.get('/', isLoggedIn, isSup, catchAsync(getAllThermometers))
    .post('/', isLoggedIn, isSup, isSup, catchAsync(createThermometer))
    .get('/:id', isLoggedIn, isSup, catchAsync(getThermometer))
    .patch('/:id', isLoggedIn, isSup, catchAsync(updateThermometer))
    .delete('/:id', isLoggedIn, isSup, catchAsync(deleteThermometer));

export default router;