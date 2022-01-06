import chai from "chai";
import request from "supertest";
const mongoose = require("mongoose");
import Movie from "../../../../api/movies/movieModel";
import api from "../../../../index";
import { getMovies, getMovieReviews, getRecommendations, getMovieSimilar, searchMovies } from "../../../../api/tmdb-api";

const expect = chai.expect;
let db;
let movies;
let reviews;
let recommend;
let similar;
let query;
let token = "eyJhbGciOiJIUzI1NiJ9.dXNlcjE.FmYria8wq0aFDHnzYWhKQrhF5BkJbFNN1PqNyNQ7V4M";

describe("Movies endpoint", () => {
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
      await Movie.deleteMany();
      movies = await getMovies();
      reviews = await getMovieReviews(movies[0].id);
      recommend = await getRecommendations(movies[0].id);
      similar = await getMovieSimilar(movies[0].id);
      query = await searchMovies();
      await Movie.collection.insertMany(movies);
    } catch (err) {
      console.error(`failed to Load movie Data: ${err}`);
    }
  });
  afterEach(() => {
    api.close(); // Release PORT 8080

  });
  describe("GET /api/movies ", () => {
    it("should return 20 movies and a status 200", (done) => {
      request(api)
        .get("/api/movies?page=1&limit=20")
        .set("Accept", "application/json")
        .expect("Content-Type", /json/)
        .expect(200)
        .end((err, res) => {
          if (err) { throw err; }
          expect(res.body.results).to.be.a("array");
          expect(res.body.results.length).to.equal(movies.length);
          done();
        });
    });
  });

  describe("GET /api/movies/:id", () => {
    describe("when the id is valid", () => {
      it("should return the matching movie", (done) => {
        request(api)
          .get(`/api/movies/${movies[0].id}`)
          .set("Accept", "application/json")
          .expect("Content-Type", /json/)
          .expect(200)
          .end((err, res) => {
            if (err) { throw err; }
            expect(res.body).to.have.property("title", movies[0].title);
            done()
          });
      });
    });
    describe("when the id is invalid", () => {
      it("should return the NOT found message", (done) => {
        request(api)
          .get("/api/movies/9999")
          .set("Accept", "application/json")
          .expect("Content-Type", /json/)
          .expect(404)
          .end((err, res) => {
            if (err) { throw err; }
            expect({ msg: "The resource you requested could not be found.", code: 404 });
            done();
          })
      });
    });
  });

  describe('GET /api/movies/:id/reviews', () => {
    it('should return the reviews', (done) => {
      request(api)
        .get(`/api/movies/${movies[0].id}/reviews`)
        .set('Accept', 'application/json')
        .expect("Content-Type", /json/)
        .expect(200)
        .end((err, res) => {
          if (err) { throw err; }
          expect(res.body.length).to.eq(reviews.length)
          done();
        })
    })
  })
  describe("POST /api/movies/:id/reviews", () => {
    describe("When request with exist movie id and valid content", () => {
      it("should return success and a status 201", (done) => {
        request(api)
          .post(`/api/movies/${movies[0].id}/reviews`)
          .send({
            author: "ll",
            content: "It is an excellent movie"
          })
          .set("Accept", "application/json")
          // .expect("Content-Type", /json/)
          .expect(201)
          .end((err, res) => {
            if (err) { throw err; }
            expect({ msg: "Created.", code: 201 });
            done();
          })
      })
    })
    describe("When request with not exist movie id", () => {
      it("should return false and a status 500", (done) => {
        request(api)
          .post(`/api/movies/mmm/reviews`)
          .set("Accept", "application/json")
          // .expect("Content-Type", /json/)
          .expect(500)
          .end((err, res) => {
            if (err) { throw err; }
            expect({ msg: "Internal Server Error", code: 500 });
            done();
          })
      })
    })
    describe("When request with invalid content", () => {
      it("should return false and a status 404", (done) => {
        request(api)
          .post(`/api/movies/${movies[0].id}/reviews`)
          .send({
            author: "ll",
            content: "Ikkkk"
          })
          .set("Accept", "application/json")
          .expect(404)
          .end((err, res) => {
            if (err) { throw err; }
            expect({ msg: "Bad content", code: 404 });
            done();
          })
      })
    })
    describe("When request with invalid content or author", () => {
      it("should return success and a status 401", (done) => {
        request(api)
          .post(`/api/movies/${movies[0].id}/reviews`)
          .send({
            author: "ll",
          })
          .set("Accept", "application/json")
          // .expect("Content-Type", /json/)
          .expect(401)
          .end((err, res) => {
            if (err) { throw err; }
            expect({ msg: "Please enter author and content.", code: 401 });
            done();
          })
      })
    })
  })
  describe('GET /api/movies/tmdb/upcoming', () => {
    it('should return 200 status and 20 movies', (done) => {
      request(api)
        .get('/api/movies/tmdb/upcoming')
        .set('Accept', 'application/json')
        .expect(200)
        .end((err, res) => {
          if (err) { throw err; }
          expect(res.body.results).to.be.a("array");
          expect(res.body.results.length).to.equal(20);
          done();
        })
    })
  })
  describe('GET /tmdb/nowplaying', () => {
    it('should return 200 status and 20 movies', (done) => {
      request(api)
        .get('/api/movies/tmdb/nowplaying')
        .set('Accept', 'application/json')
        .expect(200)
        .end((err, res) => {
          if (err) { throw err; }
          expect(res.body.results).to.be.a("array");
          expect(res.body.results.length).to.equal(20);
          done();
        })
    })
  })
  describe('GET /api/movies/:id/recommend', () => {
    it('should return the recommend movies', (done) => {
      request(api)
        .get(`/api/movies/${movies[0].id}/recommend`)
        .set('Accept', 'application/json')
        // .set('Authorization', 'Bearer ' + token)
        .expect("Content-Type", /json/)
        .expect(200)
        .end((err, res) => {
          if (err) { throw err; }
          expect(res.body).to.be.a("array");
          expect(res.body.length).to.equal(recommend.length);
          done();
        })
    })
  })
  describe('GET /api/movies/:id/similar', () => {
    it('should return the similar movies', (done) => {
      request(api)
        .get(`/api/movies/${movies[0].id}/similar`)
        .set('Accept', 'application/json')
        // .set('Authorization', 'Bearer ' + token)
        .expect("Content-Type", /json/)
        .expect(200)
        .end((err, res) => {
          if (err) { throw err; }
          expect(res.body).to.be.a("array");
          expect(res.body.length).to.equal(similar.length);
          done();
        })
    })
  })
  describe('GET /api/movies/search/:query', () => {
    it('should return 200 status and tv detail', () => {
      return request(api)
        .get(`/api/movies/search/spider`)
        .set('Accept', 'application/json')
        .set('Authorization', 'Bearer ' + token)
        // .expect("Content-Type", /json/)
        .expect(200)
        .then(res => {
          expect(res.body.length).to.eq(20)
        })
    })
  })
})

