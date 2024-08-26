
import { Router } from "express";
import { autoFillLogTemplateWithId } from "../controllers/equipLogAutoFill.js";
const router = Router();

// router.get('/', () => console.log('request recievd'));
router.get('/:logTemp_id', autoFillLogTemplateWithId);

export default router;
