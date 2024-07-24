import multer from 'multer';
import path from 'path';
import { customAlphabet } from "nanoid";
import config from 'config';
const nanoid = customAlphabet('abcdefghijklmnopqrstuvwxyz0123456789', 10);

const {
    destination,
    allowed,
    limits
} = config.get('upload')

class IllegalFileExtensionError extends Error {
    constructor(ext) {
        super();
        this.message = `File with extension '${ext}' is not Allowed`;
    }
}

const fileFilter = (req, file, cb) => {
    const ext = path.extname(file.originalname);
    if (allowed.includes(ext)) {
        cb(null, true);
    } else {
        cb(new IllegalFileExtensionError(ext));
    }
};

const filename = (
    req,
    file,
    cb
) => {
    const ext = path.extname(file.originalname);
    const uniqueName = file.fieldname + '_' + nanoid() + ext;
    cb(null, uniqueName);
};

const storage = multer.diskStorage({
    destination,
    filename,
});

const upload = multer({
    dest: destination,
    fileFilter,
    limits,
    storage,
}).any();

export default function (req, res, next) {
    upload(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            return res.status(400).send({
                success: false,
                message: err.message,
            });
        } else if (err instanceof IllegalFileExtensionError) {
            return res.status(400).send({
                success: false,
                message: err.message,
            });
        } else if (err) {
            return next(err);
        }
        return next();
    });
}
