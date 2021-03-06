const csv = require('csv-parser');
const fs = require('fs');
const pool = require("../db");
const upload = require("../utils").upload;
const unlinkAsync = require("../utils").unlinkAsync;
const handleUpdateError = require("../utils").handleUpdateError;

// handlers
async function handleShowRequest(req, res) {
    try {
        const { id, name, login, salary } = req.body;
        const query = `SELECT id, login, name, salary FROM users 
            WHERE id = '${id}' AND name = '${name}' AND login = '${login}' AND salary = '${salary}'`
        const singleUser = await pool.query(query);
        if (singleUser.rows.length === 0) {
            throw Error(`User ${req.params.id} does not exist!`);
        }
        const resp = { results: singleUser.rows };
        return res.status(200).json(resp);
    } catch (err) {
        return res.status(400).send({
            success: false,
            message: err.message,
        })
    }

}
async function handleCreateRequest(req, res) {
    try {
        const id = req.body.id
        const login = req.body.login
        const name = req.body.name
        const salary = req.body.salary
        const values = [id, name, login, salary]
        
        if (parseInt(salary) < 0) {
            throw Error("Salary cannot be negative!");
        }

        const query = `INSERT into users (id, name, login, salary) VALUES ($1, $2, $3, $4)`;
        const createUser = await pool.query(query, values);
        
        return res.status(200).json({
            results: `User created successfully!`,
            rowCount: createUser.rowCount
        });
    } catch (err) {
        return res.status(400).send({
            success: false,
            message: err.message,
        })
    }
}

async function handleEditRequest(req, res) {
    try {
        const id = req.body.id
        const login = req.body.login
        const name = req.body.name
        const salary = req.body.salary
        const values = [id, name, login, salary]
        
        if (parseInt(salary) < 0) {
            throw Error("Salary cannot be negative!");
        }
        const query = `UPDATE users SET name = $2, login = $3, salary = $4 WHERE id = $1`

        const updateUser = await pool.query(query, values);
        if (updateUser.rowCount === 0) {
            throw Error(`User ${req.params.id} does not exist!`);
        }
        return res.status(200).json({
            results: `User updated successfully!`,
            rowCount: updateUser.rowCount
        });
    } catch (err) {
        return res.status(400).send({
            success: false,
            message: err.message,
        })
    }
}

async function handleDeleteRequest(req, res) {
    try {
        const query = `DELETE from users WHERE id = '${req.params.id}'`
        const deletedUser = await pool.query(query);
        if (deletedUser.rowCount === 0) {
            throw Error(`User ${req.params.id} does not exist!`);
        }
        return res.status(200).json({ 
            message: `User ${req.params.id} has been deleted successfully!`,
            rowCount: deletedUser.rowCount
        });
    } catch (err) {
        return res.status(400).send({
            success: false,
            message: err.message,
        })
    }
}

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

async function handleUpdateRequest(res, fileData) {
    const upsertQuery = `INSERT INTO users (id, login, name, salary) 
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (id) DO UPDATE SET login = $2, name = $3, salary = $4 WHERE users.id = $1`;

    const updateNameSalary = `UPDATE users SET name = $3, salary = $4 WHERE id = $1 AND login = $2`;
    const getLoginConflict = `SELECT id, login FROM users WHERE login = $1`;
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
                        const swapLogins = `
                            UPDATE users SET login = CASE 
                                WHEN login = '${tlogin}' then '${plogin}'
                                WHEN login = '${plogin}' then '${tlogin}'
                            END
                            WHERE login in ('${tlogin}', '${plogin}')
                        `;

                        res = await client.query(swapLogins);
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
    handleShowRequest,
    handleShowAllRequest,
    handleCreateRequest,
    handleEditRequest,
    handleDeleteRequest,
    handleUploadFileRequest,
}