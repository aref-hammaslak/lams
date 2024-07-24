// Telemetry setup
import config from 'config';
import bunyan from "bunyan";
import bunyanMiddleware from 'bunyan-middleware';
import rfs from "rotating-file-stream";

const logFilePath = config.get('logfile');

const rfsStream = rfs.createStream(logFilePath, {
    size: '10MB', // rotate every 10 MegaBytes written
    interval: '1d', // rotate daily
    compress: 'gzip'
});
export const logger = bunyan.createLogger({
    name: 'lams',
    streams: [
        {
            stream: process.stdout,
            level: 'debug'
        },
        {
            stream: rfsStream,
            level: 'trace'
        }
    ],
    serializers: bunyan.stdSerializers
});

export default () => {
    return bunyanMiddleware({
        propertyName: 'reqId',
        logName: 'req_id',
        obscureHeaders: [],
        logger: logger,
        requestStart: true,
        excludeHeaders: [
            'connection',
            'accept',
            'sec-gpc',
            'accept-language',
            'sec-fetch-site',
            'sec-fetch-mode',
            'sec-fetch-dest',
            'referer',
            'accept-encoding',
            'if-none-match',
            'X-Powered-By',
            'Access-Control-Allow-Origin',
            'Vary',
            'Access-Control-Allow-Credentials',
            'X-Request-Id',
            'ETag',
            'Date',
            'Connection',
            'Keep-Alive'
        ]
    });
}