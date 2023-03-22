const multer = require('multer');
const path = require('path');
const AppError = require('../utils/appError');
const { promisify } = require('util');

const maxSize = 5 * 1024 * 1024; // 5MB

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images');
    },
    filename: (req, file, cb) => {
        cb(null, `${req.user.id}-${file.originalname}`);
    }
});

const imageFilter = (req, file, cb) => {
    // check file mimetype
    if (!file.mimetype.startsWith('image') && (file.mimetype !== 'application/octet-stream')) {
        return cb(new AppError(400, 'fail', 'Please upload only images (mimetype)'), false);
    }
    // check file extension
    if (!path.extname(file.originalname).match(/\.(jpg|jpeg|png|gif)$/)) {
        return cb(new AppError(400, 'fail', 'Please upload only images (extension)'), false);
    }
    cb(null, true);
};

let upload = multer({
    storage: storage,
    limits: { fileSize: maxSize },
    fileFilter: imageFilter
}).single('avatar');

let uploadFile = promisify(upload);

module.exports = uploadFile;