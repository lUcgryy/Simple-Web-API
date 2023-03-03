const multer = require('multer');
const path = require('path');
const { promisify } = require('util');

const maxSize = 2 * 1024 * 1024; // 2MB

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
    if (!file.mimetype.startsWith('image')) {
        return cb(new AppError(400, 'fail', 'Please upload only images'), false);
    }
    // check file extension
    if (!path.extname(file.originalname).match(/\.(jpg|jpeg|png|gif)$/)) {
        return cb(new AppError(400, 'fail', 'Please upload only images'), false);
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