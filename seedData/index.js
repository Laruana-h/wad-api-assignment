import userModel from '../api/users/userModel';
import genresModel from '../api/genres/genresModel';
import users from './users';
import dotenv from 'dotenv';
import movieModel from '../api/movies/movieModel';
import actorsModel from '../api/actors/actorsModel';
import tvModel from '../api/tvs/tvModel';

const {getMovies,getGenres,getActors,getTVs} = require('../api/tmdb-api')

dotenv.config();

// deletes all user documents in collection and inserts test data
async function loadUsers() {
  console.log('load user Data');
  try {
    await userModel.deleteMany();
    // await userModel.collection.insertMany(users);
    await users.forEach(user => userModel.create(user));
    console.info(`${users.length} users were successfully stored.`);
  } catch (err) {
    console.error(`failed to Load user Data: ${err}`);
  }
}
async function loadGenres() {
  console.log('load genre Data');
  try {
    await genresModel.deleteMany();
    const genres = await getGenres();
    await genresModel.collection.insertMany(genres);
    console.info(`${genres.length} genres were successfully stored.`);
  } catch (err) {
    console.error(`failed to Load genres Data: ${err}`);
  }
}
// deletes all movies documents in collection and inserts test data
export async function loadMovies() {
  const movies = await getMovies();
  console.log('load movie data');
  console.log(movies.length);
  try {
    await movieModel.deleteMany();
    await movieModel.collection.insertMany(movies);
    console.info(`${movies.length} Movies were successfully stored.`);
  } catch (err) {
    console.error(`failed to Load movie Data: ${err}`);
  }
}

export async function loadActors() {
  const actors = await getActors();
  console.log('load actor data');
  console.log(actors.length);
  try {
    await actorsModel.deleteMany();
    await actorsModel.collection.insertMany(actors);
    console.info(`${actors.length} Actors were successfully stored.`);
  } catch (err) {
    console.error(`failed to Load actor Data: ${err}`);
  }
}

export async function loadTvs() {
  const tvs = await getTVs();
  console.log('load TV data');
  console.log(tvs.length);
  try {
    await tvModel.deleteMany();
    await tvModel.collection.insertMany(tvs);
    console.info(`${tvs.length} TVs were successfully stored.`);
  } catch (err) {
    console.error(`failed to Load actor Data: ${err}`);
  }
}

if (process.env.SEED_DB == 'true') {
  loadUsers();
  loadGenres();
  loadMovies();
  loadActors();
  loadTvs();

}

