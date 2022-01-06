import chai from "chai";
import request from "supertest";
const mongoose = require("mongoose");
import Movie from "../../../../api/movies/movieModel";
import api from "../../../../index";
import { getMovies,getMovieReviews, getRecommendations, getMovieSimilar, searchMovies } from "../../../../api/tmdb-api";

const expect = chai.expect;
let db;
let movies;
let reviews;
let recommend;
let similar;
let query;
let token ="eyJhbGciOiJIUzI1NiJ9.dXNlcjE.FmYria8wq0aFDHnzYWhKQrhF5BkJbFNN1PqNyNQ7V4M";

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
      // await Movie.deleteMany();
      movies = await getMovies();
      reviews = await getMovieReviews();
      recommend = await getRecommendations();
      similar = await getMovieSimilar();
      query =await searchMovies();
      // await Movie.collection.insertMany(movies);
      
    } catch (err) {
      console.error(`failed to Load movie Data: ${err}`);
    }
  });
  afterEach(() => {
    api.close(); // Release PORT 8080
  });
  describe("GET /api/movies ", () => {
    it("should return 20 movies and a status 200", () => {
      request(api)
        .get("/api/movies?page=1&limit=20")
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

  describe("GET /api/movies/:id", () => {
    describe("when the id is valid", () => {
      it("should return the matching movie", () => {
         request(api)
          .get(`/api/movies/${movies[0].id}`)
          .set("Authorization","BEARER"+token)
          .set("Accept", "application/json")
          .expect("Content-Type", /json/)
          .expect(200)
          .then((res) => {
            expect(res.body).to.have.property("title",movies[0].title);
          });
      });
    });
    describe("when the id is invalid", () => {
      it("should return the NOT found message", () => {
         request(api)
          .get("/api/movies/9999")
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

  describe('GET /api/movies/:id/reviews', () => {
    it('should return the reviews', () => {
      request(api)
        .get(`/api/movies/${movies[0].id}/reviews`)
        .set('Accept', 'application/json')
        .set('Authorization', 'Bearer ' + token)
        .expect("Content-Type", /json/)
        .expect(200)
        .then(res => {
          expect(res.body.length).to.eq(reviews.length)
        })
    })
  })
  describe("POST /api/movies/:id/reviews",()=>{
    describe("When request with exist movie id",()=>{
      it("should return success, rate information and a status 200",()=>{
        request(api)
          .post("/api/movies/${movies[0].id}/reviews")
          .send({
            "author":"ll",
            "content": "It is an excellent movie"
          })
          .set('Authorization', 'bearer ' + token)
          .set("Accept", "application/json")
          .expect("Content-Type", /json/)
          .expect(200)
          .then((req,res)=>{
            expect(res.body.id).to.eq(movies[0].id);
            expect(res.body).to.be.a("array");
            expect(res.body.length).to.equal(reviews.length);
            
          })
      })
    })
  })
  describe('GET /api/movies/tmdb/upcoming', () => {
    it('should return 200 status and 20 movies', () => {
       request(api)
        .get('/api/movies/tmdb/upcoming')
        .set('Accept', 'application/json')
        .expect(200)
        .then(res => {
          expect(res.body.results).to.be.a("array");
          expect(res.body.results.length).to.equal(20);
        })
    })
  })
  describe('GET /tmdb/nowplaying', () => {
    it('should return 200 status and 20 movies', () => {
       request(api)
        .get('/api/movies/tmdb/nowplaying')
        .set('Accept', 'application/json')
        .expect(200)
        .then(res => {
          expect(res.body.results).to.be.a("array");
          expect(res.body.results.length).to.equal(20);
        })
    })
  })
  describe('GET /api/movies/:id/recommend', () => {
    it('should return the recommend movies', () => {
      request(api)
        .get('/api/movies/${movies[0].id}/recommend')
        .set('Accept', 'application/json')
        .set('Authorization', 'Bearer ' + token)
        .expect("Content-Type", /json/)
        .expect(200)
        .then(res => {
          expect(res.body.results).to.be.a("array");
          expect(res.body.results.length).to.equal(recommend.length);
        })
    })
  })
  describe('GET /api/movies/:id/similar', () => {
    it('should return the similar movies', () => {
      request(api)
        .get('/api/movies/${movies[0].id}/similar')
        .set('Accept', 'application/json')
        .set('Authorization', 'Bearer ' + token)
        .expect("Content-Type", /json/)
        .expect(200)
        .then(res => {
          expect(res.body.results).to.be.a("array");
          expect(res.body.results.length).to.equal(similar.length);
        })
    })
  })
  describe('GET /api/movies/search/:query', () => {
    it('should return 200 status and tv detail', () => {
       request(api)
        .get(`/api/movies/search/spider`)
        .set('Accept', 'application/json')
        .set('Authorization', 'Bearer ' + token)
        .expect("Content-Type", /json/)
        .expect(200)
        .then(res => {
          expect(res.body.length).to.eq(query.length)
        })
    })
  })
})

