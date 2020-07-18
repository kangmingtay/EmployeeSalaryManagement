const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { promisify } = require('util');

const fileUploadPath = (process.env.NODE_ENV === 'test') ? './test/public/uploads': './public/uploads';

// Set storage engine
const storage = multer.diskStorage({
    destination: fileUploadPath,
    filename: (req, file, cb) => {
        cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
    }
});
const upload = multer({ 
    storage: storage,
    limits:{filesize: 1000000},
    fileFilter: (req, file, cb) => {
        checkFileType(file, cb);
    }
}).single('file');

// check file type to allow only csv
const checkFileType = (file, cb) => {
    const filetypes = /csv/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (extname && mimetype) {
        return cb(null, true);
    } else {
        cb('Error: Csv files only!');
    }
}

// remove file 
const unlinkAsync = promisify(fs.unlink);

const handleUpdateError = (res, err) => {
    return res.status(200).send({
        success: false,
        message: err.message,
    });
}

module.exports = {
    upload,
    unlinkAsync,
    handleUpdateError
}