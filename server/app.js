import express from 'express';

import config from 'config';
import MongoSanitize from 'express-mongo-sanitize';

import './settings/db.js';
import cors from './settings/cors.js'
import logger from './settings/logger.js';
import session from './settings/session.js';
import passport from 'passport';
import { handle404, basicErrorHandler } from './support.js';
import { setRoutes } from './routes/index.js';
import dotenv from 'dotenv'

// Load environment variables from.env file (if it exists)
dotenv.config({
    path: '../.env',
    debug: true,
});

const app = express();

export const port = config.get('port');
export const host = config.get('host');
app.set('port', port);
app.set('host', host);

app.use(cors());
// app.use(logger());
app.use(session());
app.use(express.static('public'))

app.use(express.json());
app.use(MongoSanitize({ replaceWith: '_' }));

app.use(passport.initialize());
app.use(passport.session());

app.get('/healthcheck', (req, res) => {
    res.send({
        success: true,
        payload: { message: "server is up!" }
    });
});

setRoutes(app);

app.use(handle404);
app.use(basicErrorHandler);

export default app;