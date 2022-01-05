import chai from "chai";
import request from "supertest";
const mongoose = require("mongoose");

const expect = chai.expect;
let db;
let token ="eyJhbGciOiJIUzI1NiJ9.dXNlcjE.FmYria8wq0aFDHnzYWhKQrhF5BkJbFNN1PqNyNQ7V4M";
let api;
describe("Rate endpoint", () => {
  before(() => {
    mongoose.connect(process.env.MONGO_DB, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    db = mongoose.connection;
  });

  after(async () => {
    try {
      await db.dropDatabase();
    } catch (error) {
      console.log(error);
    }
  });

  beforeEach(async () => {
    try {
      api = require("../../../../index");
    } catch (err) {
      console.error(`failed to Load express server: ${err}`);
    }
    
    console.log('wait for optimizely...');
    setTimeout(()=>{
      console.log('optimizely done...');
      request(api)
      .post('/api/users')
      .send({
        "username": "user1",
        "password": "test1"
      })
      
    },7000)
  });

  afterEach(() => {
    api.close(); // Release PORT 8080
  });
  describe("GET /api/rate",()=>{
    describe("When request with valid token",()=>{
      it("should return success, recommend movies and status 200",()=>{
        request(api)
          .get("/api/rate")
          .set('Authorization', 'bearer ' + token)
          .set("Accept", "application/json")
          .expect("Content-Type", /json/)
          .expect(200)
          .then((req,res)=>{
            expect(res.body.success).to.be.true;
            expect(res.body.ratedMovies).to.exist;
          })
      })
    })

    describe("When request with invalid token",()=>{
      it("should return invalid token error and a status 403",()=>{
        request(api)
          .get("/api/rate")
          .set('Authorization', 'bearer Invalid' + token)
          .set("Accept", "application/json")
          .expect("Content-Type", /json/)
          .expect(403)
          .then((req,res)=>{
            expect(res.body.status).to.be.equal("fail");
            expect(res.body.message).to.be.equal("Invalid Token");
          })
      })
    })
  })

  describe("POST /api/rate",()=>{
    describe("When request with exist movie id",()=>{
      it("should return success, rate information and a status 200",()=>{
        request(api)
          .post("/api/rate")
          .send({
            "id":"508442",
            "rating": 10
          })
          .set('Authorization', 'bearer ' + token)
          .set("Accept", "application/json")
          .expect("Content-Type", /json/)
          .expect(200)
          .then((req,res)=>{
            expect(res.body.success).to.be.true;
            expect(res.body.rate.username).to.be.equal("user1");
            expect(res.body.rate.movie_id).to.be.equal(508442);
            expect(res.body.rate.rating).to.be.equal(10);
          })
      })
    })

    describe("When request with not exist movie id",()=>{
      it("should return movie not found and a status 404",()=>{
        request(api)
          .post("/api/rate")
          .send({
            "id":"508",
            "rating": 10
          })
          .set('Authorization', 'bearer ' + token)
          .set("Accept", "application/json")
          .expect("Content-Type", /json/)
          .expect(404)
          .then((req,res)=>{
            expect(res.body.success).to.be.false;
            expect(res.body.message).to.be.equal("Movie not found!");
            
          })
      })
    })

    describe("When request with a movie is already rated",()=>{
      let oldRating;
      beforeEach(()=>{
        request(api)
          .post("/api/rate")
          .send({
            "id":"508442",
            "rating": 10
          })
          .set('Authorization', 'bearer ' + token)
          .set("Accept", "application/json")
          .expect("Content-Type", /json/)
          .expect(200)
          .then((req,res)=>{
            expect(res.body.success).to.be.true;
            expect(res.body.rate.rating).to.be.equal(10);
            oldRating=res.body.rate.rating;
          })
      })

      it("should return different rating in rate information and a status 200",()=>{
        request(api)
          .post("/api/rate")
          .send({
            "id":"508442",
            "rating": 1
          })
          .set('Authorization', 'bearer ' + token)
          .set("Accept", "application/json")
          .expect("Content-Type", /json/)
          .expect(200)
          .then((req,res)=>{
            expect(res.body.success).to.be.true;
            expect(res.body.rate.username).to.be.equal("user1");
            expect(res.body.rate.movie_id).to.be.equal(508442);
            expect(res.body.rate.rating).to.not.equal(oldRating);
            expect(res.body.rate.rating).to.be.equal(1);
          })
      })
    })
  })
 
})