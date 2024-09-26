import { Router } from "express";
const router = Router();
import { getMessages, createMessage, markMessageAsRead, getMessage, getUnreadCoun } from "../controllers/message.js";
import { catchAsync } from "../utils/catchAsync.js";
import { isLoggedIn } from "../middlewares/auth.js";

router.post('/', isLoggedIn, catchAsync(createMessage) )
    .get('/', isLoggedIn,catchAsync(getMessages))
    .get('/user/unReadCount',isLoggedIn, catchAsync(getUnreadCoun))
    .get('/messageId', isLoggedIn, catchAsync(getMessage))
    .put('/:messageId/read', isLoggedIn, catchAsync(markMessageAsRead));
    

export default router;