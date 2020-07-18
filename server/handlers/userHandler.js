const multer = require('multer');
const path = require('path');
const csv = require('csv-parser');
const fs = require('fs');
const { promisify } = require('util');
const pool = require("../db");
const e = require('express');

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

// handlers
async function handleShowAllRequest(req, res) {
    try {
        if (Object.keys(req.query).length !== 5) {
            throw Error("Missing request params");
        }

        if (Object.values(req.query).includes(undefined)) {
            throw Error("Invalid request params");
        }

        const minSalary = req.query.minSalary;
        const maxSalary = req.query.maxSalary;
        const offset = req.query.offset;
        const limit = req.query.limit;
        const sortOrder = req.query.sort[0] === "-" ? "DESC" : "ASC";
        const sortCategory = req.query.sort.slice(1);

        const query = `SELECT id, login, name, salary FROM users 
            WHERE salary >= ${minSalary} AND salary <= ${maxSalary}
            ORDER BY ${sortCategory} ${sortOrder} 
            OFFSET ${offset} 
            LIMIT ${limit}`;

        const allUsers = await pool.query(query);
        const resp = { results: allUsers.rows }
        return res.status(200).json(resp);
    } catch(err) {
        return res.status(400).send({
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

async function handleUpdateRequest(res, fileData) {
    const upsertQuery = `INSERT INTO users (id, login, name, salary) 
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (id) DO UPDATE SET login = $2, name = $3, salary = $4 WHERE users.id = $1`;

    const updateNameSalary = `UPDATE users SET name = $3, salary = $4 WHERE id = $1 AND login = $2`;
    const getLoginConflict = `SELECT id, login FROM users WHERE login = $1`;
    const updateLogin = `UPDATE users SET login = $2 WHERE id = $1`;
    const getPreviousLogin = `SELECT login FROM users WHERE id = $1`;

    const client = await pool.connect();
    try {
        await client.query("BEGIN");
        for (i in fileData) {
            const row = fileData[i]
            const values = Object.values(row);
            const [id, login, name, salary] = values
            if (salary < 0) {
                throw Error("Salary cannot be negative!");
            }
            let res = await client.query(updateNameSalary, values);
            res = await client.query(getLoginConflict, [login]);

            const affectedRows = res.rows;
            if (affectedRows.length !== 0) {
                const tid = affectedRows[0].id;
                const tlogin = affectedRows[0].login;
                const pid = id;
                if (pid !== tid) {
                    res = await client.query(getPreviousLogin, [pid]);
                    if (res.rows.length === 0) {
                        throw Error(`${pid} is a new entry so login must be unique!`);
                    } else {
                        const plogin = res.rows[0].login;
                        // swap logins here
                        // console.log(tid, plogin);
                        res = await client.query(updateLogin, [tid, `tmp${plogin}`]);
                        // console.log(pid, tlogin);
                        res = await client.query(updateLogin, [pid, tlogin]);
                        // console.log(tid, plogin);
                        res = await client.query(updateLogin, [tid, plogin]);
                    }
                }
            } else {
                res = await client.query(upsertQuery, values);
            }
        };
        await client.query("COMMIT");
        res.status(200).send({
            success: true,
            message: "Database updated!",
        });
    } catch (err) {
        console.log("Rolling back...");
        await client.query("ROLLBACK");
        res.status(200).send({
            success: false,
            message: `Transaction failed: ${err.message}`,
        });
    } finally {
        client.release();
    }
}

async function handleUploadFileRequest(req, res) {
    let fileData = [];
    upload(req, res, async (err) => {
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
                skipLines: 1,   // ignore header
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
                    await handleUpdateRequest(res, fileData);
                }
            });
        }
    })
};

module.exports = {
    handleShowAllRequest,
    handleUploadFileRequest,
}