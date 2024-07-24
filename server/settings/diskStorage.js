import multer from 'multer';
import config from 'config';
import path from 'path';
import ExpressError from '../utils/ExpressError.js';

const uploadPath = config.get('upload.path');
const maxUploadSize = config.get('upload.max');

export const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        const filename = file.fieldname + '-' + uniqueSuffix + ext;
        cb(null, filename);
    },
});

export function fileFilter(req, file, callback) {
    var ext = path.extname(file.originalname);
        if (!['.pdf', '.jpg', '.webp', '.png'].includes(ext)) {
            return callback(new ExpressError('Only PDF/JPG/PNG/WEBP allowed', 400));
        }
        callback(null, true)
}

export const limits = {
    fileSize: config.get('upload.max')
}