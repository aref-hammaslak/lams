import { Router } from "express";
import { catchAsync } from "../utils/catchAsync.js";
import { isSup, isLoggedIn } from '../middlewares/auth.js';
import {
    getDoc,
    uploadDoc
} from '../controllers/doc.js';
import upload from "../middlewares/upload.js";

const router = Router();

router.post('/', isLoggedIn, upload, catchAsync(uploadDoc))
    .get('/:docId', isLoggedIn, catchAsync(getDoc))

export default router;
