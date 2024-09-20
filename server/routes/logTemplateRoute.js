import { Router } from "express";
import { catchAsync } from "../utils/catchAsync.js";

import { isSup, isLoggedIn } from "../middlewares/auth.js";

import {
    getAllLogTemplates, createLogTemplate,
    removeLogTemplate, updateLogTemplate,
    getLogTemplate
} from "../controllers/logTemplate.js";

const router = Router();

router.get('/', isLoggedIn , catchAsync(getAllLogTemplates))
    .post('/', isLoggedIn, isSup, catchAsync(createLogTemplate))
    .get('/:id', isLoggedIn,  catchAsync(getLogTemplate))
    .delete('/:id', isLoggedIn, isSup, catchAsync(removeLogTemplate))
    .patch('/:id', isLoggedIn, isSup, catchAsync(updateLogTemplate));

export default router;