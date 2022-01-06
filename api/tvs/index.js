import express from 'express';
import tvModel from './tvModel';
import asyncHandler from 'express-async-handler';
import reviewModel from '../reviews/reviewModel';
import uniqid from 'uniqid'
import { getPopularTVs,searchTVByPage,getTVReviews } from '../tmdb-api';
const router = express.Router(); 
router.get('/', asyncHandler(async (req, res) => {
    let { page = 1, limit = 10 } = req.query; // destructure page and limit and set default values
    [page, limit] = [+page, +limit]; //trick to convert to numeric (req.query will contain string values)

    const totalDocumentsPromise = tvModel.estimatedDocumentCount(); //Kick off async calls
    const tvsPromise = tvModel.find().limit(limit).skip((page - 1) * limit);

    const totalDocuments = await totalDocumentsPromise; //wait for the above promises to be fulfilled
    const tvs = await tvsPromise;

    const returnObject = { page: page, total_pages: Math.ceil(totalDocuments / limit), total_results: totalDocuments, results: tvs };//construct return Object and insert into response object

    res.status(200).json(returnObject);
}));
// Get tvs details
router.get('/:id', asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id);
    const tv = await tvModel.findByTVDBId(id);
    if (tv) {
        res.status(200).json(tv);
    } else {
        res.status(404).json({message: 'The resource you requested could not be found.', status_code: 404});
    }
}));
// Get movie reviews
router.get('/:id/reviews', asyncHandler(async (req, res, next) => {
    const id = parseInt(req.params.id);
    const tv = await tvModel.findByTVDBId(id);
    if (tv) {
        const reviews = tv.reviews
        if (reviews.length) {
            console.log('load in the database')
            tvModel.findOne({ "id": id }).populate('reviews')
                .exec((err, foundObject) => {
                    if (err) {
                        next(err)
                    }
                    res.status(200).send(foundObject.reviews)
                })
        } else {
            console.log('load from TMDB and store')
            const TMDBReviews = await getTVReviews(id)
            if (TMDBReviews.length) {
                await reviewModel.deleteMany();
                await reviewModel.collection.insertMany(TMDBReviews);
                // store the reviews in movie collections
                const review_ids = await reviewModel.find({}, { _id: 1 })
                review_ids.forEach(async review_id => {
                    await tv.reviews.push(review_id)
                })
                await tv.save()
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
    const tv = await tvModel.findByTVDBId(id);
    if (tv) {
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
                    await tv.reviews.push(review_id)
                })
                await tv.save()
                res.status(201).json({ code: 201, msg: 'Successful created new review.' });
            } else {
                res.status(404).json({ code: 404, msg: 'Bad content.Please enter the length of content larger than 10' });

    } 
          }

    }
}));
//Get a popular tv
router.get('/tmdb/populartv', asyncHandler(async (req, res) => {
    const popularTVs = await getPopularTVs();
    res.status(200).json(popularTVs);
}));

export default router;

//Search tvs by page
router.get('/search/:page', async (req, res, next) => {
    try {
      const page = parseInt(req.params.page)
      const query = req.query.search
      const tvs = await searchTVByPage(page, query)
      res.status(200).send(tvs)
    } catch (err) {
      next(err)
    }

  })

