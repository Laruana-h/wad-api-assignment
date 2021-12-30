import fetch from 'node-fetch';

export const getMovies = () => {
  return fetch(
    `https://api.themoviedb.org/3/discover/movie?api_key=${process.env.TMDB_KEY}&language=en-US&include_adult=false&page=1`
  )
    .then(res => res.json())
    .then(json => json.results)
    .catch((error) => {
      throw error
    });
};

export const getUpcomingMovies = () => {
  return fetch(
    `https://api.themoviedb.org/3/movie/upcoming?api_key=${process.env.TMDB_KEY}&language=en-US&page=1`
  ).then((response) => {
    if (!response.ok) {
      throw new Error(response.json().message);
    }
    return response.json();
  })
    .catch((error) => {
      throw error
    });
};
export const getNowplayingMovies = () => {
  return fetch(
    `https://api.themoviedb.org/3/movie/now_playing?api_key=${process.env.TMDB_KEY}&language=en-US&include_adult=false&page=1`
  ).then((response) => {
    if (!response.ok) {
      throw new Error(response.json().message);
    }
    return response.json();
  })
    .catch((error) => {
      throw error
    });
};

export const getGenres = () => {
  return fetch(
    `https://api.themoviedb.org/3/genre/movie/list?api_key=${process.env.TMDB_KEY}&language=en-US`
  ).then(res => res.json())
    .then(json => json.genres)
    .catch((error) => {
      throw error
    });
};

export const getActors = () => {
  return fetch(

    `https://api.themoviedb.org/3/person/popular?api_key=${process.env.TMDB_KEY}&language=en-US&page=1`
  )
    .then(res => res.json())
    .then(json => json.results)
    .catch((error) => {
      throw error
    });
};

export const getTVs = () => {
  return fetch(
    `https://api.themoviedb.org/3/discover/tv?api_key=${process.env.TMDB_KEY}&language=en-US&include_adult=false&page=1`
  )
    .then(res => res.json())
    .then(json => json.results)
    .catch((error) => {
      throw error
    });
};
