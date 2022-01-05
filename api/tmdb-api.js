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
export const getMovie = (args) => {
  // console.log(args)
  const [, idPart] = args.queryKey;
  const { id } = idPart;
  return fetch(
    `https://api.themoviedb.org/3/movie/${id}?api_key=${process.env.TMDB_KEY}`
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

export const getRecommendations = id => {
  return fetch(
    `https://api.themoviedb.org/3/movie/${id}/recommendations?api_key=${process.env.TMDB_KEY}`
  )
    .then(res => res.json())
    .then(json => json.results);
}; 

export const getMovieSimilar = id => {
  return fetch(
    `https://api.themoviedb.org/3/movie/${id}/similar?api_key=${process.env.TMDB_KEY}`
  )
    .then(res => res.json())
    .then(json => json.results);
};

export const getMovieReviews = id => {
  return fetch(
    `https://api.themoviedb.org/3/movie/${id}/reviews?api_key=${process.env.TMDB_KEY}`
  )
    .then(res => res.json())
    .then(json => json.results);
};

export const getPopularTVs = () => {
  return fetch(
    `https://api.themoviedb.org/3/tv/popular?api_key=${process.env.TMDB_KEY}&language=en-US&page=1`
  )
  .then(res => res.json())
  .then(json => json.results)
}
export const searchTVByPage = (query, page) => {
  return fetch(`https://api.themoviedb.org/3/search/tv?api_key=${process.env.TMDB_KEY}&language=en-US&page=${page}&query=${query}&include_adult=false`)
  .then(res => res.json())
  .then(json => json.results)
}
export const searchMovies = (query_string) => {
  return fetch(
    `https://api.themoviedb.org/3/search/movie?api_key=${process.env.TMDB_KEY}&language=en-us&query=${query_string}&page=1&include_adult=false`
  )
  .then(res => res.json())
  .then(json => json.results)
}