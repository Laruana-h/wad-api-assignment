import chai from "chai";
import request from "supertest";
const mongoose = require("mongoose");
import User from "../../../../api/users/userModel";
import api from "../../../../index";
import { getActors, getMovies, getTVs } from "../../../../api/tmdb-api";
const expect = chai.expect;
let db;
let id;
let movies;
let actors;
let tvs;
let user1token;
describe("Users endpoint", () => {
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
      movies = await getMovies();
      actors = await getActors();
      tvs = await getTVs();
      await User.deleteMany();
      // Register two users
      await request(api).post("/api/users?action=register").send({
        username: "user1",
        password: "test1",
      });
      await request(api).post("/api/users?action=register").send({
        username: "user2",
        password: "test2",
      });
    } catch (err) {
      console.error(`failed to Load user test Data: ${err}`);
    }
  });
  afterEach(() => {
    api.close();
  });
  describe("GET /api/users ", () => {
    it("should return the 2 users and a status 200", (done) => {
       request(api)
        .get("/api/users")
        .set("Accept", "application/json")
        .expect("Content-Type", /json/)
        .expect(200)
        .end((err, res) => {
          if (err){throw err;}
          expect(res.body).to.be.a("array");
          expect(res.body.length).to.equal(2);
          let result = res.body.map((user) => user.username);
          expect(result).to.have.members(["user1", "user2"]);
         done();
        });
    });
  });

  describe("POST /api/users ", () => {
    describe("For a register action", () => {
      describe("when the payload is correct", () => {
        it("should return a 201 status and the confirmation message", () => {
          return request(api)
            .post("/api/users?action=register")
            .send({
              username: "user3",
              password: "test3",
            })
            .expect(201)
            .expect({ msg: "Successful created new user.", code: 201 });
        });
        after(() => {
          return request(api)
            .get("/api/users")
            .set("Accept", "application/json")
            .expect("Content-Type", /json/)
            .expect(200)
            .then((res) => {
              expect(res.body.length).to.equal(3);
              const result = res.body.map((user) => user.username);
              expect(result).to.have.members(["user1", "user2", "user3"]);
            });
        });
      });
    });
    describe("For an authenticate action", () => {
      describe("when the payload is correct", () => {
        it("should return a 200 status and a generated token", () => {
          return request(api)
            .post("/api/users?action=authenticate")
            .send({
              username: "user1",
              password: "test1",
            })
            .expect(200)
            .then((res) => {
              expect(res.body.success).to.be.true;
              expect(res.body.token).to.not.be.undefined;
              user1token = res.body.token.substring(7);
            });
        });
      });
    });
  });
  describe('PUT /:id ', () => {
    before(() => {
       return request(api)
        .get("/api/users")
        .set("Accept", "application/json")
        .expect("Content-Type", /json/)
        .expect(200)
        .then((res) => {
          const ids = res.body.map(user => user._id)
          id = ids[0]
        });
    })
    it('When id is invalid', () => {
       request(api)
        .put("/api/users/123")
        .set("Accept", "application/json")
        .expect(404)
        .expect({ msg: "Unable to Update User", code: 404 })
       
    })

    it('When password is valid', () => {
       request(api)
        .put(`/api/users/${id}`)
        .set("Accept", "application/json")
        .send({
          username: 'user1',
          password: 'test1111111'
        })
        .expect(200)
        .expect({
          status_code:200,
          message:"User Updated Sucessfully"
        })
    })
  })
  
  describe("/api/users/:userName/favourites endpoint",()=>{
    beforeEach((done)=>{
      getMovies().then((res)=>{
        request(api)
        .post('/api/users/user1/favourites')
        .send({
          "id":movies[0].id
        })
        .expect(200)
        .end(() => done())
      })
    })

    describe("GET /api/users/:userName/favourites",()=>{
      it("should return the added movies list and a status 200",(done)=>{
        request(api)
          .get('/api/users/user1/favourites')
          .expect(200)
          .end((req,res)=>{
            expect(res.body[0].id).to.eq(movies[0].id);
            expect(res.body[0].title).to.eq(movies[0].title);
            done();
          })
      })
    })
    
    describe("POST /api/users/:userName/favourites",()=>{
      it("should return the added movie and a status 200",(done)=>{
        request(api)
        .post('/api/users/user1/favourites')
        .send({
          "id":movies[1].id
        })
        .expect(200)
        .end((req,res) =>{
          expect(res.body.favourites.length).to.eq(2);
          done();
        })
      })
      describe("When request with movie already in favourites",()=>{
        it("should return error message and a status 404.",(done)=>{
          request(api)
          .post('/api/users/user1/favourites')
          .send({
            "id":movies[0].id
          })
          .expect(404)
          .end((req,res) =>{
            expect(res.body.msg).to.eq("Unable to add duplicates");
            done();
          })
        })
      })
    })
  })

  describe("/api/users/:userName/liked_actors endpoint",()=>{
    beforeEach((done)=>{
      getMovies().then((res)=>{
        request(api)
        .post('/api/users/user1/liked_actors')
        .send({
          "id":actors[0].id
        })
        .expect(200)
        .end(() => done())
      })
    })

    describe("GET /api/users/:userName/liked_actors",()=>{
      it("should return the added actor list and a status 200",(done)=>{
        request(api)
          .get('/api/users/user1/liked_actors')
          .expect(200)
          .end((req,res)=>{
            expect(res.body[0].id).to.eq(actors[0].id);
            done();
          })
      })
    })
    
    describe("POST /api/users/:userName/liked_actors",()=>{
      it("should return the added actor and a status 200",(done)=>{
        request(api)
        .post('/api/users/user1/liked_actors')
        .send({
          "id":actors[1].id
        })
        .expect(200)
        .end((req,res) =>{
          expect(res.body.liked_actors.length).to.eq(2);
          done();
        })
      })
      describe("When request with actor already in liked_actors",()=>{
        it("should return error message and a status 404.",(done)=>{
          request(api)
          .post('/api/users/user1/liked_actors')
          .send({
            "id":actors[0].id
          })
          .expect(404)
          .end((req,res) =>{
            expect(res.body.msg).to.eq("Unable to add duplicates");
            done();
          })
        })
      })
    })
  })
  describe("/api/users/:userName/tvlist endpoint",()=>{
    beforeEach((done)=>{
      getMovies().then((res)=>{
        request(api)
        .post('/api/users/user1/tvlist')
        .send({
          "id":tvs[0].id
        })
        .expect(200)
        .end(() => done())
      })
    })

    describe("GET /api/users/:userName/tvlist",()=>{
      it("should return the added tv list and a status 200",(done)=>{
        request(api)
          .get('/api/users/user1/tvlist')
          .expect(200)
          .end((req,res)=>{
            expect(res.body[0].id).to.eq(tvs[0].id);
            done();
          })
      })
    })
    
    describe("POST /api/users/:userName/tvlist",()=>{
      it("should return the added tvs and a status 200",(done)=>{
        request(api)
        .post('/api/users/user1/tvlist')
        .send({
          "id":tvs[1].id
        })
        .expect(200)
        .end((req,res) =>{
          expect(res.body.tvlist.length).to.eq(2);
          done();
        })
      })
      describe("When request with tv already in tvlist",()=>{
        it("should return error message and a status 404.",(done)=>{
          request(api)
          .post('/api/users/user1/tvlist')
          .send({
            "id":tvs[0].id
          })
          .expect(404)
          .end((req,res) =>{
            expect(res.body.msg).to.eq("Unable to add duplicates");
            done();
          })
        })
      })
    })
  })
})




