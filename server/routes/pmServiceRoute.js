import { Router } from "express";

import { isSup, isLoggedIn } from "../middlewares/auth.js";
import { catchAsync } from "../utils/catchAsync.js";

import {
    getAllPMServices,
    getPMService,
    createPMService,
    updatePMService,
    deletePMService
} from "../controllers/pmservice.js";

const router = Router();

router.get('/', isLoggedIn, isSup, catchAsync(getAllPMServices))
    .post('/', isLoggedIn, isSup, catchAsync(createPMService))
    .get('/:id', isLoggedIn, isSup, catchAsync(getPMService))
    .patch('/:id', isLoggedIn, isSup, catchAsync(updatePMService))
    .delete('/:id', isLoggedIn, isSup, catchAsync(deletePMService));

export default router;