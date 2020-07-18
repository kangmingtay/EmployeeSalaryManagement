const chai = require('chai');
const chaiHttp = require('chai-http');

process.env.NODE_ENV = 'test'

const server = require("../app");
const { response } = require('express');

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
                console.log(err);
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.results.length.should.be.eq(0);
                done();
            })
        });
        it("Missing request params", (done) => {
            chai.request(server).get("/users").end((err, res) => {
                console.log(err);
                res.should.have.status(400);
                res.body.should.be.a('object');
                res.body.message.should.be.eq("Missing request params");
                done();
            })
        });
    })

    /**
     * Test POST upload file
     */

})