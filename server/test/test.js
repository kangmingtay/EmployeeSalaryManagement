const chai = require('chai');
const chaiHttp = require('chai-http');

process.env.NODE_ENV = 'test'

const server = require("../app");
const { response } = require('express');
const fs = require('fs');
const path = require('path');
const pool = require("../db");

chai.should();

chai.use(chaiHttp);

describe('Users API', () => {
    /**
     * Test GET home page route
     */
    describe("GET /", () => {
        it("Get home page", (done) => {
            chai.request("http://localhost:8000").get("/").end((err, res) => {
                res.should.have.status(200);
                res.text.should.be.a('string');
                res.text.should.be.eq('Techhunt 2020 api');
                done();
            })
        })
    });

    /**
     * Test GET list of users route
     */
    describe("GET /users", () => {
        it("Get list of all employees", (done) => {
            chai.request(server).get("/users?minSalary=-500&maxSalary=400000&offset=0&limit=30&sort=+id").end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.results.length.should.be.eq(0);
                done();
            })
        });
        it("Error Missing request params", (done) => {
            chai.request(server).get("/users").end((err, res) => {
                res.should.have.status(400);
                res.body.should.be.a('object');
                res.body.message.should.be.eq("Missing request params");
                done();
            })
        });
    })

    /**
     * Test POST upload file success
     */
    describe("POST /users/upload", () => {
        afterEach((done) => {
            pool.query("TRUNCATE TABLE users", (err, result) => {
                done();
            })
            
        });
        after((done) => {
            const directory = './test/public/uploads';
            fs.readdir(directory, (err, files) => {
                if (err) throw err;

                for (const file of files) {
                    fs.unlink(path.join(directory, file), err => {
                        if (err) throw err;
                    });
                }
                done();
            })
        })
        it("Error No csv file upload", (done) => {
            chai.request(server).post("/users/upload").type('multipart/form-data').end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.message.should.be.eq("No file uploaded");
                done();
            })
        });
        it("Error Upload empty csv file", (done) => {
            chai.request(server).post("/users/upload")
                .type('multipart/form-data')
                .attach('file', fs.readFileSync('./test/test_empty.csv'), 'test_empty.csv')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.message.should.be.eq("Cannot upload empty csv file!");
                    done();
                })
        });
        it("Negative salary", (done) => {
            chai.request(server).post("/users/upload")
                .type('multipart/form-data')
                .attach('file', fs.readFileSync('./test/test_salary.csv'), 'test.csv')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.message.should.be.eq("Transaction failed: Salary cannot be negative!");
                    done();
                })
        });
        it("Error Upload csv file with non-unique logins", (done) => {
            chai.request(server).post("/users/upload")
                .type('multipart/form-data')
                .attach('file', fs.readFileSync('./test/test_login.csv'), 'test.csv')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.message.should.be.eq("Transaction failed: e0002 is a new entry so login must be unique!");
                    done();
                })
        });
        it("Upload csv file success", (done) => {
            chai.request(server).post("/users/upload")
                .type('multipart/form-data')
                .attach('file', fs.readFileSync('./test/test_success.csv'), 'test.csv')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.message.should.be.eq("Database updated!");
                    done();
                })
        });
    })
})