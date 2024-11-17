
import { Router } from "express";
import { autoFillLogTemplateWithId, autoFillOneLogTemplateWithSchId } from "../controllers/equipLogAutoFill.js";
import { catchAsync } from "../utils/catchAsync.js";
const router = Router();


router.get('/:logTemp_id', catchAsync(autoFillLogTemplateWithId));
router.get('/:logTemp_id/:sch_id', catchAsync(autoFillOneLogTemplateWithSchId));

export default router;
