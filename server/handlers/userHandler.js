const multer = require('multer');
const path = require('path');
const csv = require('csv-parser');
const fs = require('fs');
const { promisify } = require('util');
const pool = require("../db");
const e = require('express');

// Set storage engine
const storage = multer.diskStorage({
    destination: './public/uploads',
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
}).single('csvfile');

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

// handlers
async function handleShowAllRequest(req, res) {
    try {
        const allUsers = await pool.query("SELECT id, login, name, salary FROM users");
        return res.status(200).json(allUsers.rows);
    } catch(err) {
        return res.status(404).send({
            success: false,
            message: err.message,
        })
    }
};

// remove file 
const unlinkAsync = promisify(fs.unlink);

const handleUpdateError = (res, err) => {
    return res.status(200).send({
        success: false,
        message: err.message,
    });
}

async function handleUploadFileRequest(req, res) {
    let fileData = [];
    upload(req, res, async (err) => {
        console.log(req.file)
        if (req.file === undefined) {
            handleUpdateError(res, Error("No file uploaded"));
        } else if(err) {
            await unlinkAsync(req.file.path);
            handleUpdateError(res, err);
        } else {
            // store file in public/uploads directory
            fs.createReadStream(`${req.file.path}`).pipe(csv({
                headers: ["id", "login", "name", "salary"],
                skipComments: true, 
                strict: true,  // number of columns in each row must match number of headers
            })).on('error', async (err) => {
                // catches incorrect number of columns
                await unlinkAsync(req.file.path);
                handleUpdateError(res, err);
            }).on('data', (row) => {
                fileData.push(row)
            }).on('end', async () => {
                if (fileData.length === 0) {
                    await unlinkAsync(req.file.path);
                    handleUpdateError(res, Error("Cannot upload empty csv file!"));
                } else {
                    // insert items into db here
                }
            });
        }
    })
};

module.exports = {
    handleShowAllRequest,
    handleUploadFileRequest,
}