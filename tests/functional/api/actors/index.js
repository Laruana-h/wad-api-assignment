import chai from "chai";
import request from "supertest";
const mongoose = require("mongoose");
import Actor from "../../../../api/actors/actorsModel";
import { getActors } from "../../../../api/tmdb-api";
import api from "../../../../index";

const expect = chai.expect;
let db;
let actors;
let token ="eyJhbGciOiJIUzI1NiJ9.dXNlcjE.FmYria8wq0aFDHnzYWhKQrhF5BkJbFNN1PqNyNQ7V4M";

describe("Actors endpoint", () => {
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
      // await Actor.deleteMany();
      actors =await getActors();
      // await Movie.collection.insertMany(movies);
      
    } catch (err) {
      console.error(`failed to Load user Data: ${err}`);
    }
  });
  afterEach(() => {
    api.close(); // Release PORT 8080
  });
  describe("GET /api/actors/?page=1&limit=20 ", () => {
    it("should return 20 actors and a status 200", () => {
      request(api)
        .get("/api/actors")
        .set("Authorization","BEARER"+token)
        .set("Accept", "application/json")
        .expect("Content-Type", /json/)
        .expect(200)
        .then((err, res) => {
          expect(res.body.results).to.be.a("array");
          expect(res.body.results.length).to.equal(20);
        });
    });
  });

  describe("GET /api/actors/:id", () => {
    describe("when the id is valid", () => {
      it("should return the matching actor", () => {
         request(api)
          .get(`/api/actors/${actors[0].id}`)
          .set("Authorization","BEARER"+token)
          .set("Accept", "application/json")
          .expect("Content-Type", /json/)
          .expect(200)
          .then((res) => {
            expect(res.body).to.have.property("media_type",actors[0].media_type);
          });
      });
    });
    describe("when the id is invalid", () => {
      it("should return the NOT found message", () => {
         request(api)
          .get("/api/actors/9999")
          .set("Accept", "application/json")
          .set("Authorization","BEARER"+token)
          .expect("Content-Type", /json/)
          .expect(404)
          .expect({
            status_code: 404,
            message: "The resource you requested could not be found.",
          });
      });
    });
  });


})

