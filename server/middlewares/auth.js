import passport from "passport";
import ExpressError from '../utils/ExpressError.js'

export const USER_ROLES = {
    'admin': [1001, 1923, 2005],
    'supervisor': [1001, 1923],
    'staff': [1001]
}

const auth = (req, res, next) => {
    passport.authenticate('local', function (err, user, info, status) {
        if (err) return next(err);
        if (!user)
            throw new ExpressError('Incorrect Username or Password', 401);
        if (!user.active)
            throw new ExpressError('User is not active', 401);
        
        req.logIn(user, (err) => {
            if (err) return next(err);
            else return next();
        })
    }, { keepSessionInfo: true })(req, res, next);
}
export default auth;

export const isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        throw new ExpressError('Not logged in', 401);
    }
    if (!req.user.active) {
        req.logout(function (err) {
            if (err) {
                throw err;
            }
        });
        throw new ExpressError('User is not active', 401);
    }
    next();
}

export const isAdmin = (req, res, next) => {
    if (req.user.roles.includes(2005))
        return next();

    throw new ExpressError('Unauthorized Access!', 401);
}

export const isSup = (req, res, next) => {
    if (req.user.roles.includes(1923))
        return next();

    throw new ExpressError('Unauthorized Access!', 401);
}