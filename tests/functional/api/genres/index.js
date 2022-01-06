import chai from "chai";
import request from "supertest";
const mongoose = require("mongoose");
import Genres from "../../../../api/genres/genresModel";
import { getGenres } from "../../../../api/tmdb-api";
import api from "../../../../index";

const expect = chai.expect;
let db;
let genres;

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
      await Genres.deleteMany();
      genres = await getGenres();
      await Genres.collection.insertMany(genres);
      
    } catch (err) {
      console.error(`failed to Load user Data: ${err}`);
    }

  });
  afterEach(() => {
    api.close(); // Release PORT 8080
  });
  describe("GET /api/genres ", () => {
    it("should return 19 genres and a status 200", (done) => {
      request(api)
        .get("/api/genres")
        .set("Accept", "application/json")
        .expect("Content-Type", /json/)
        .expect(200)
        .end((err, res) => {
          if (err){throw err;}
          expect(res.body).to.be.a("array");
          expect(res.body.length).to.equal(genres.length);
          done();
        });
    });
  });
})