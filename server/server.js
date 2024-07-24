import http from 'http';
import app, { host, port } from './app.js'
import { logger } from './settings/logger.js';

/**
 * Event listener for HTTP server "error" event.
 */
function onError(error) {
    logger.error(error);
    if (error.syscall !== 'listen') {
        throw error;
    }

    const bind = typeof port === 'string'
        ? 'Pipe ' + port
        : 'Port ' + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            logger.error(`${bind} requires elevated privileges`);
            process.exit(1);
            break;
        case 'EADDRINUSE':
            logger.error(`${bind} is already in use`);
            process.exit(1);
            break;
        default:
            throw error;
    }
}

/**
 * Event listener for HTTP server "listening" event.
 */
export function onListening() {
    const addr = server.address();
    const bind = typeof addr === 'string'
        ? 'Pipe ' + addr
        : 'Port ' + addr.port;
    logger.info(`Listening on ${bind}`);
}

export const server = http.createServer(app);
server.listen(port);
server.on('error', onError);
server.on('listening', onListening);