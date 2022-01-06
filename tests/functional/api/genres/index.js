import chai from "chai";
import request from "supertest";
const mongoose = require("mongoose");
import Genres from "../../../../api/genres/genresModel";
import api from "../../../../index";

const expect = chai.expect;
let db;
let token ="eyJhbGciOiJIUzI1NiJ9.dXNlcjE.FmYria8wq0aFDHnzYWhKQrhF5BkJbFNN1PqNyNQ7V4M";

describe("Genres endpoint", () => {
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
      // await Genres.deleteMany();
      // await Movie.collection.insertMany(movies);
      
    } catch (err) {
      console.error(`failed to Load user Data: ${err}`);
    }

  });
  afterEach(() => {
    api.close(); // Release PORT 8080
  });
  describe("GET /api/genres ", () => {
    it("should return 19 genres and a status 200", () => {
      request(api)
        .get("/api/genres")
        .set("Authorization","BEARER"+token)
        .set("Accept", "application/json")
        .expect("Content-Type", /json/)
        .expect(200)
        .then((err, res) => {
          expect(res.body.results).to.be.a("array");
          expect(res.body.results.length).to.equal(19);
        });
    });
  });
})