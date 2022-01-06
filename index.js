import dotenv from 'dotenv';
import express from 'express';
import moviesRouter from './api/movies';
import genresRouter from './api/genres';
import './db';
import './seedData'
import usersRouter from './api/users';
import actorsRouter from './api/actors';
import tvsRouter from './api/tvs';
import session from 'express-session';
import passport from './authenticate';
import rateRouter from './api/rate';
import bodyParser from "body-parser";

const swaggerUI = require('swagger-ui-express')
const swaggerDocument = require('./swagger.json')


const errHandler = (err, req, res, next) => {
  /* if the error in development then send stack trace to display whole error,
  if it's in production then just send error message  */
  if(process.env.NODE_ENV === 'production') {
    return res.status(500).send(`Something went wrong!`);
  }
  res.status(500).send(`Hey!! You caught the error 👍👍. Here's the details: ${err.stack} `);
};
dotenv.config();
const app = express();

const port = process.env.PORT;
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument))
app.use(express.json());
app.use(
  session({
    secret: "ilikecake",
    resave: true,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded());


app.use('/api/movies', passport.authenticate('jwt', {session: false}), moviesRouter);
app.use('/api/actors', passport.authenticate('jwt', {session: false}), actorsRouter);
app.use('/api/tvs', passport.authenticate('jwt', {session: false}), tvsRouter);
app.use('/api/rate', passport.authenticate('jwt', {session: false}), rateRouter);
// app.use('/api/movies', authenticate, moviesRouter);
app.use('/api/genres', genresRouter);
app.use('/api/users', usersRouter);
app.use(errHandler);

let server = app.listen(port, () => {
  console.info(`Server running at ${port}`);
});
module.exports = server