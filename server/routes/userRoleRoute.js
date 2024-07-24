import { Router } from "express";
import { catchAsync } from "../utils/catchAsync.js";
import { isAdmin, isLoggedIn } from '../middlewares/auth.js';

import { createUserRole, deleteUserRole, getAllUserRole, getUserRole, updateUserRole } from '../controllers/userRole.js';

const router = Router();

router.get('/', isLoggedIn, isAdmin, catchAsync(getAllUserRole))
    .post('/', isLoggedIn, isAdmin, catchAsync(createUserRole))
    .get('/:id', isLoggedIn, isAdmin, catchAsync(getUserRole))
    .patch('/:id', isLoggedIn, isAdmin, catchAsync(updateUserRole))
    .delete('/:id', isLoggedIn, isAdmin, catchAsync(deleteUserRole));


export default router;