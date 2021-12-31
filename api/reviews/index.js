import express from 'express';
import reviewModel from './reviewModel';
import asyncHandler from 'express-async-handler';

const router = express.Router(); 

// Get movie revew
router.get('/:id', asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id);
    const review = await reviewModel.findByReviewDBId(id);
    if (review) {
        res.status(200).json(review);
    } else {
        res.status(404).json({message: 'The resource you requested could not be found.', status_code: 404});
    }
}));

export default router;