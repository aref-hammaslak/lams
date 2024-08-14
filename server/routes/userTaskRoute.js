import * as userTaskController from '../controllers/userTask.js';
import { Router } from 'express';
import { isAdmin, isLoggedIn, isSup } from '../middlewares/auth.js';


const router = Router();

router.get('/', isLoggedIn, isAdmin, isSup, userTaskController.getAllUserTasks);
router.get('/:id', isLoggedIn, userTaskController.getUserTaskById)

export default router;