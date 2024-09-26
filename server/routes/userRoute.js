import { Router } from "express";
import multer from "multer";
import { catchAsync } from "../utils/catchAsync.js";
import auth, { isLoggedIn, isAdmin, isSup } from '../middlewares/auth.js';
import userTaskRouter from './userTaskRoute.js'

import {
    getAll, getUser,
    login, logout,
    createUser, updateUser,
    destroyUser,
    setAdminLab,
    getSelf,
    toggleUser,
    resetPassword,
    changePassword
} from '../controllers/user.js';

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
});

router.use('/task', userTaskRouter);

router.get('/', isLoggedIn , catchAsync(getAll))
    .post('/login', auth, login)
    .get('/logout', isLoggedIn, logout)
    .get('/self', isLoggedIn, getSelf)
    .post('/', isLoggedIn, isSup, catchAsync(createUser))
    .get('/:id', isLoggedIn, isSup, catchAsync(getUser))
    .patch('/:id', isLoggedIn, catchAsync(updateUser))
    // .patch('/:id', isLoggedIn, isSup, upload.fields([
    //     { name: 'ceu', maxCount: 1},
    //     { name: 'degree', maxCount: 1},
    //     { name: 'cv', maxCount: 1},
    //     { name: 'training_records', maxCount: 1},
    //     { name: 'license', maxCount: 1},
    // ]), catchAsync(updateUser))
    .patch('/toggle/:id', isLoggedIn, isSup, catchAsync(toggleUser))
    .delete('/:id', isLoggedIn, isSup, catchAsync(destroyUser))
    .get('/admin/:lab_id', isLoggedIn, isAdmin, catchAsync(setAdminLab))
    .post('/reset-password/:id', isLoggedIn,isSup, catchAsync(resetPassword))
    .post('/change-password/:id', isLoggedIn , catchAsync(changePassword))

export default router;