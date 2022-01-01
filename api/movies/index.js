import { getUpcomingMovies, getNowplayingMovies, getRecommendations, getMovieReviews,getMovieSimilar } from '../tmdb-api';

import express from 'express';
import uniqid from 'uniqid'
import asyncHandler from 'express-async-handler';
import movieModel from './movieModel';
import reviewModel from '../reviews/reviewModel';


const router = express.Router();
router.get('/', asyncHandler(async (req, res) => {
    let { page = 1, limit = 10 } = req.query; // destructure page and limit and set default values
    [page, limit] = [+page, +limit]; //trick to convert to numeric (req.query will contain string values)

    const totalDocumentsPromise = movieModel.estimatedDocumentCount(); //Kick off async calls
    const moviesPromise = movieModel.find().limit(limit).skip((page - 1) * limit);

    const totalDocuments = await totalDocumentsPromise; //wait for the above promises to be fulfilled
    const movies = await moviesPromise;

    const returnObject = { page: page, total_pages: Math.ceil(totalDocuments / limit), total_results: totalDocuments, results: movies };//construct return Object and insert into response object

    res.status(200).json(returnObject);
}));
// Get movie details
router.get('/:id', asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id);
    const movie = await movieModel.findByMovieDBId(id);
    if (movie) {
        res.status(200).json(movie);
    } else {
        res.status(404).json({ message: 'The resource you requested could not be found.', status_code: 404 });
    }
}));
// Get movie reviews
router.get('/:id/reviews', asyncHandler(async (req, res, next) => {
    const id = parseInt(req.params.id);
    const movie = await movieModel.findByMovieDBId(id);
    if (movie) {
        const reviews = movie.reviews
        if (reviews.length) {
            console.log('load in the database')
            movieModel.findOne({ "id": id }).populate('reviews')
                .exec((err, foundObject) => {
                    if (err) {
                        next(err)
                    }
                    res.status(200).send(foundObject.reviews)
                })
        } else {
            console.log('load from TMDB and store')
            const TMDBReviews = await getMovieReviews(id)
            if (TMDBReviews.length) {
                await reviewModel.deleteMany();
                await reviewModel.collection.insertMany(TMDBReviews);
                // store the reviews in movie collections
                const review_ids = await reviewModel.find({}, { _id: 1 })
                review_ids.forEach(async review_id => {
                    await movie.reviews.push(review_id)
                })
                await movie.save()
                res.status(200).send(TMDBReviews)
            } else {
                res.status(200).send([])
            }
        }
    }
}
));

//Post a movie review
router.post('/:id/reviews',asyncHandler(async (req, res,next) => {
    const id = parseInt(req.params.id);
    const movie = await movieModel.findByMovieDBId(id);
    if (movie) {
        req.body.created_at = new Date();
        req.body.updated_at = new Date();
        req.body.id = uniqid();
        if (!req.body.author || !req.body.content) {
            res.status(401).json({success: false, msg: 'Please enter author and content.'});
            return next();
          }else{
            let contentFormat = /^(a-z|A-Z|0-9)*[^$%^&*;:,<>?()\""\']{10,}$/;
            let aa = contentFormat.test(req.body.content);
            if (aa == true) {
                // await reviewModel.deleteMany();
                await reviewModel.create(req.body);
                const review_ids = await reviewModel.find({}, { _id: 1 })
                review_ids.forEach(async review_id => {
                    await movie.reviews.push(review_id)
                })
                await movie.save()
                res.status(201).json({ code: 201, msg: 'Successful created new review.' });
            } else {
                res.status(404).json({ code: 404, msg: 'Bad content.Please enter the length of content larger than 10' });

    } 
          }

    }
}));
// Update a movie review
router.put('/:id/reviews', async (req, res) => {
    if (req.body._id) delete req.body._id;
    const result = await movieModel.updateOne({
        _id: req.params.id,
    }, req.body);
    if (result.matchedCount) {
        res.status(200).json({ code: 200, msg: 'User Updated Sucessfully' });
    } else {
        res.status(404).json({ code: 404, msg: 'Unable to Update User' });
    }
});
//Get an upcoming movie
router.get('/tmdb/upcoming', asyncHandler(async (req, res) => {
    const upcomingMovies = await getUpcomingMovies();
    res.status(200).json(upcomingMovies);
}));

//Get a nowplaying movie
router.get('/tmdb/nowplaying', asyncHandler(async (req, res) => {
    const nowplayingMovies = await getNowplayingMovies();
    res.status(200).json(nowplayingMovies);
}));

//Get a recommend movie
router.get('/:id/recommend', asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id);
    const recommendMovies = await getRecommendations(id);
    res.status(200).json(recommendMovies);
}));

//Get a similar movie
router.get('/:id/similar', asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id);
    const similarMovies = await getMovieSimilar(id);
    res.status(200).json(similarMovies);
}));


export default router;