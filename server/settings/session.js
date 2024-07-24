import config from 'config';
import MongoStore from 'connect-mongo';
import session from 'express-session';

const name = config.get('session.name');
const secret = config.get('session.secret');
const touchAfter = config.get('session.touchAfter');
const secure = config.get('https');
const dbUri = config.get('dbUri');

const store = MongoStore.create({
    mongoUrl: dbUri,
    secret,
    touchAfter
});

export default () => {
    return session({
        store,
        name,
        secret,
        resave: false,
        saveUninitialized: true,
        cookie: {
            httpOnly: true,
            secure,
            expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
            maxAge: 1000 * 60 * 60 * 24 * 7
        }
    });
};