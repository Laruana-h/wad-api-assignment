import express from 'express';
import tvModel from './tvModel';
import asyncHandler from 'express-async-handler';
import { getPopularTVs,searchTVByPage } from '../tmdb-api';
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

  router.get('/:id/ratings', (req, res, next) => {
    const id = parseInt(req.params.id)
    try {
      tvModel.find({ "id": id }).populate({
        "path": "ratings",
        "populate": {
          "path": "user",
          "model": "User"
        }
      }).exec((err, docs) => {
        if (err) {
          next(err)
        } else {
          res.status(200).send(docs)
        }
      })
    }catch(err) {
      next(err)
    }
    
  })