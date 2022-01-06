import chai from "chai";
import request from "supertest";
const mongoose = require("mongoose");
import TV from "../../../../api/tvs/tvModel";
import api from "../../../../index";
import { getTVs,getPopularTVs } from "../../../../api/tmdb-api";
const expect = chai.expect;
let db;
let tvs;

describe("TVs endpoint", () => {
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
      tvs = await getTVs();
      await TV.deleteMany();
      await TV.collection.insertMany(tvs);

    } catch (err) {
      console.error(`failed to Load tv Data: ${err}`);
    }
  });
  afterEach(() => {
    api.close(); // Release PORT 8080
  });
  describe("GET /api/tvs ", () => {
    it("should return 20 tvs and a status 200", (done) => {
      request(api)
        .get("/api/tvs/?page=1&limit=20")
        .set("Accept", "application/json")
        .expect("Content-Type", /json/)
        .expect(200)
        .end((err, res) => {
          if (err){throw err;}
          expect(res.body.results).to.be.a("array");
          expect(res.body.results.length).to.equal(20);
          done();
        });
    });
  });

  describe("GET /api/tvs/:id", () => {
    describe("when the id is valid", () => {
      it("should return the matching tv", (done) => {
        request(api)
          .get(`/api/tvs/${tvs[0].id}`)
          .set("Accept", "application/json")
          .expect("Content-Type", /json/)
          .expect(200)
          .end((err,res) => {
            if (err){throw err;}
            expect(res.body).to.have.property("name", tvs[0].name);
            done();
          });
      });
    });
    describe("when the id is invalid", () => {
      it("should return the NOT found message", () => {
        return request(api)
          .get("/api/tvs/9999")
          .set("Accept", "application/json")
          .expect("Content-Type", /json/)
          .expect(404)
          .expect({
            status_code: 404,
            message: "The resource you requested could not be found.",
          });
      });
    });
  });

  // describe('GET /api/tvs/tmdb/populartv', () => {
  //   it.only('should return 200 status and 20 movies', (done) => {
  //      request(api)
  //       .get('/api/tvs/tmdb/populartv')
  //       .set('Accept', 'application/json')
  //       .expect(200)
  //       .end((err,res) => {
  //         if (err){throw err;}
  //         expect(res.body.results).to.be.a("array");
  //         expect(res.body.results.length).to.equal(20);
  //         done();
  //       })
  //   })
  // })

})

