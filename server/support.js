import ExpressError from './utils/ExpressError.js';

export function handle404(req, res, next) {
    const err = new ExpressError('Not Found', 404);
    next(err);
}

export function basicErrorHandler(err, req, res, next) {
    // Defer to built-in error handler if handlersSent
    // See: http://expressjs.com/en/guide/error-handling.html
    if (res.headersSent) {
        return next(err);
    }

    if (err instanceof ExpressError) {
        // req.log.info(err.message);
        return res.status(err.code).send({
            success: false,
            error: process.env.NODE_ENV === 'deployment'
                ? { message: err.message, code: err.code }
                : err
        });
    } else {
        // req.log.error(err);
        console.error(err)
        return res.status(500).send({
            success: false,
            error: process.env.NODE_ENV === 'deployment'
                ? { message: err.message, code: err.code }
                : err
        });
    }
}
