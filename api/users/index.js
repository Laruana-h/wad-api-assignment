import express from 'express';
import User from './userModel';
import asyncHandler from 'express-async-handler';
import jwt from 'jsonwebtoken';
import movieModel from '../movies/movieModel';
import actorsModel from '../actors/actorsModel';

const router = express.Router(); // eslint-disable-line

// Get all users
router.get('/', async (req, res) => {
    const users = await User.find();
    res.status(200).json(users);
});
// Register OR authenticate a user
router.post('/',asyncHandler( async (req, res, next) => {
    if (!req.body.username || !req.body.password) {
      res.status(401).json({success: false, msg: 'Please pass username and password.'});
      return next();
    }
    if (req.query.action === 'register') {
      let pwdFormat =/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{5,}$/;
      let aa = pwdFormat.test(req.body.password);
      if (aa == true){
      await User.create(req.body);
      res.status(201).json({code: 201, msg: 'Successful created new user.'});
    }else {
      res.status(404).json({ code: 404, msg: 'Bad password' });

    }

    } else {
      const user = await User.findByUserName(req.body.username);
        if (!user) return res.status(401).json({ code: 401, msg: 'Authentication failed. User not found.' });
        user.comparePassword(req.body.password, (err, isMatch) => {
          if (isMatch && !err) {
            // if user is found and password matches, create a token
            const token = jwt.sign(user.username, process.env.SECRET);
            // return the information including token as JSON
            res.status(200).json({success: true, token: 'BEARER ' + token});
          } else {
            res.status(401).json({code: 401,msg: 'Authentication failed. Wrong password.'});
          }
        });
      }
  }));
// Update a user
router.put('/:id', async (req, res) => {
    if (req.body._id) delete req.body._id;
    const result = await User.updateOne({
        _id: req.params.id,
    }, req.body);
    if (result.matchedCount) {
        res.status(200).json({ code:200, msg: 'User Updated Sucessfully' });
    } else {
        res.status(404).json({ code: 404, msg: 'Unable to Update User' });
    }
});
//Add a favourite. Can't add duplicates.
router.post('/:userName/favourites', asyncHandler(async (req, res) => {
  const newFavourite = req.body.id;
  const userName = req.params.userName;
  const movie = await movieModel.findByMovieDBId(newFavourite);
  //if the movie's id not exits,it will have error.
  if (movie == null){
    res.status(401).json({ code: 401, msg: 'The movie id not exits' });
  }
  const user = await User.findByUserName(userName);
  if (user.favourites.indexOf(movie._id)==-1){
    await user.favourites.push(movie._id);
    await user.save(); 
    res.status(201).json(user); 
  }else{
    res.status(404).json({ code: 404, msg: 'Unable to add duplicates' });
  }
  
}));
router.get('/:userName/favourites', asyncHandler( async (req, res) => {
  const userName = req.params.userName;
  const user = await User.findByUserName(userName).populate('favourites');
  res.status(200).json(user.favourites);
}));

//Add a actor. Can't add duplicates.
router.post('/:userName/liked_actors', asyncHandler(async (req, res) => {
  const newLikedActors = req.body.id;
  const userName = req.params.userName;
  const actor = await actorsModel.findByActorDBId(newLikedActors);
  if (actor == null){
    res.status(401).json({ code: 401, msg: 'The actor id not exits' });
  }
  const user = await User.findByUserName(userName);
  if (user.liked_actors.indexOf(actor._id)==-1){
    await user.liked_actors.push(actor._id);
    await user.save(); 
    res.status(201).json(user); 
  }else{
    res.status(404).json({ code: 404, msg: 'Unable to add duplicates' });
  }
  
}));
router.get('/:userName/liked_actors', asyncHandler( async (req, res) => {
  const userName = req.params.userName;
  const user = await User.findByUserName(userName).populate('liked_actors');
  res.status(200).json(user.liked_actors);
}));
export default router;