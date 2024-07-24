import { Router } from "express";
import { catchAsync } from "../utils/catchAsync.js";
import { isSup, isLoggedIn } from '../middlewares/auth.js';
import {
    getAllSurfaces,
    deleteSurface,
    createSurface,
    getSurface,
    updateSurface
} from '../controllers/surface.js';

const router = Router();

router.get('/', isLoggedIn, isSup, catchAsync(getAllSurfaces))
    .post('/', isLoggedIn, isSup, isSup, catchAsync(createSurface))
    .get('/:id', isLoggedIn, isSup, catchAsync(getSurface))
    .patch('/:id', isLoggedIn, isSup, catchAsync(updateSurface))
    .delete('/:id', isLoggedIn, isSup, catchAsync(deleteSurface));

export default router;