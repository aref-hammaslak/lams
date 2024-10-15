import userRoute from './userRoute.js';
import laboratoryRoute from './laboratoryRoute.js';
import departmentRoute from './departmentRoute.js';
import equipmentRoute from './equipmentRoute.js';
import thermometerRoute from './thermometerRoute.js';
import surfaceRoute from './surfaceRoute.js';
import logTemplateRoute from './logTemplateRoute.js';
import scheduleRoute from './scheduleRoute.js';
import scheduleMapRoute from './scheduleMapRoute.js';
import docRoute from "./docRoute.js";
import userRoleRouter from "./userRoleRoute.js";
import calibrationRouter from "./calibrationRoute.js";
import pmServiceRouter from "./pmServiceRoute.js";
import equipmentLogRoute from "./equipmentLogRoute.js";
import surfaceLogRoute from "./surfaceLogRoute.js";
import equipLogAutoFillRoute from './equipLogAutoFillRoute.js';
import messagesRoute from './messageRoute.js';
import { Router } from 'express';

export const appRouter = Router();

appRouter.use('/users', userRoute);
appRouter.use('/laboratory', laboratoryRoute);
appRouter.use('/department', departmentRoute);
appRouter.use('/equipment', equipmentRoute);
appRouter.use('/thermometer', thermometerRoute);
appRouter.use('/surface', surfaceRoute);
appRouter.use('/logTemplate', logTemplateRoute);
appRouter.use('/schedule', scheduleRoute);
appRouter.use('/schedule-map', scheduleMapRoute);
appRouter.use('/upload', docRoute);
appRouter.use('/user-role', userRoleRouter);
appRouter.use('/calibration', calibrationRouter);
appRouter.use('/pm-service', pmServiceRouter);
appRouter.use('/messages', messagesRoute)
appRouter.use('/log/equipment/auto-fill', equipLogAutoFillRoute)
appRouter.use('/log/equipment', equipmentLogRoute);
appRouter.use('/log/surface', surfaceLogRoute);
