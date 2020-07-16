const { Pool } = require('pg');
const dotenv = require('dotenv');
dotenv.config();

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASS,
    port: process.env.DB_PORT,
});

pool.connect((err, client, release) => {
    if (err) {
        return console.error('Error acquiring client', err.stack);
    }
    client.query(`CREATE TABLE IF NOT EXISTS users(
        id VARCHAR(100) PRIMARY KEY,
        login VARCHAR(100), 
        name VARCHAR(100),
        salary NUMERIC(10, 2),
        CONSTRAINT users_login UNIQUE(login) DEFERRABLE INITIALLY DEFERRED
    )`, (err, res) => {
        if (err) {
            return console.error('Error executing query', err.stack)
        }
        console.log('Database setup complete...');
        release();
    })
})

module.exports = pool;