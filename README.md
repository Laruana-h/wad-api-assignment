
# Assignment 2 - Web API.

Name: Sijie He

## Features.

...... A bullet-point list of the ADDITIONAL features you have implemented in the API **THAT WERE NOT IN THE LABS** ......,
 
 + Feature 1 - Delete username by uername.
 + Feature 2 - Post like_actors by actor id and detect whether the id exist without repeatedly adding.
 + Feature 3 - Get like_actor list by username.
 + Feature 4 - Post liked_tv by tv id and detect whether the id exist without repeatedly adding.
 + Feature 5 - Get tvlist list by username.
 + Feature 6 - Delete favourite movies from favourite list.
 + Feature 7 - Get movies reviews by movies id and determine if it's in the database.If the movie id is not in database,get information from TMDB.
 + Feature 8 - Post movies reviews by author and check it.
 + Feature 9 - Get upcoming movies from TMDB
 + Feature 10 - Get nowplaying movies from TMDB
 + Feature 11 - Search for the movies with the particular keyword.
 + Feature 12 - Get recommend movies by id
 + Feature 13 - Get similar movies by id
 + Feature 14 - Post rate for movies by username
 + Feature 15 - User can view all the rated movies and get rate about movies in the database
 + Feature 16 - Get the actors by page for the pagination functionality.
 + Feature 17 - Get the actors details by actors id
 + Feature 18 - Search intresested tvs by page
 + Feature 19 - Get the tvs by page for the pagination functionality.
 + Feature 20 - Get the tvs details by tvs id
 + Feature 21 - Get popular tv.
 + Feature 22 - Realize the addition, deletion, modification and query of mongoDB
 + Feature 23 - Implemented get, post, put and delete API 
 + Feature 24 - Customized password validation 
 + Feature 25 - Custom validation using Mongoose.
 + Feature 26 - Basic Authentication and protected routes.(User must login can get homepage)
 + Feature 27 - Good use of express middleware (e.g. Error handling).
 + Feature 28 - Substantial React App integration.
 + Feature 29 - Use cloud MongoDB
 + Feature 30 - Get data from TMDB
 + Feature 31 - Get movies reviews by movies id and determine if it's in the database.If the movie id is not in database,get information from TMDB.
 + Feature 32 - Post movies reviews by author and check it.
 + Feature 33 - API documentation (Swagger)
 

## Installation Requirements

Describe what needs to be on the machine to run the API (Node v?, NPM, MongoDB instance, any other 3rd party software not in the package.json). 

Describe getting/installing the software, perhaps:

```bat
git clone https://github.com/Laruana-h/wad-api-assignment.git
```
followed by installation

```bat
git install
npm install
"deDependencies"
"@babel/runtime": "^7.6.3",
    "bcrypt-nodejs": "^0.0.3",
    "dotenv": "^10.0.0",
    "express": "^4.17.1",
    "express-async-handler": "^1.2.0",
    "express-session": "^1.17.2",
    "jsonwebtoken": "^8.5.1",
    "mongoose": "^6.0.13",
    "node-fetch": "^2.6.6",
    "passport": "^0.5.0",
    "passport-jwt": "^4.0.0",
    "swagger-jsdoc": "^6.1.0",
    "swagger-ui-express": "^4.3.0",
    "uniqid": "^5.4.0"
```

## API Configuration
Describe any configuration that needs to take place before running the API. For example, creating an ``.env`` and what variables to put in it. Give an example of how this might be structured/done.
REMEMBER: DON'T PUT YOUR OWN USERNAMES/PASSWORDS/AUTH KEYS IN THE README OR ON GITHUB, just placeholders as indicated below:

```bat
NODE_ENV=development
PORT=8080
HOST=localhost
mongoDB=mongodb+srv://Lareina:hj730726@cluster0.m02ya.mongodb.net/test?retryWrites=true&w=majority
seedDB=true
secret=ilikecake
```


## API Design
Give an overview of your web API design, perhaps similar to the following: 

|  |  GET | POST | PUT | DELETE
| -- | -- | -- | -- | -- 
| /api/movies |Gets a list of movies | N/A | N/A | N/A
| /api/movies/{movieid} | Get a Movie | N/A | N/A | N/A
| /api/movies/{movieid}/reviews | Get all reviews for movie | Create a new review for Movie | N/A | N/A  
| /api/movies/search/(query) | Search movies by particular key | N/A |  N/A |  N/A
| /api/movies/tmdb/upcoming | Get upcoming movies | N/A  | N/A  | N/A 
| /api/movies/tmdb/nowplaying | Get nowplaying movies | N/A  | N/A  | N/A 
| /api/movies/{id}/recommend | Get recommend movies by movie id | N/A  | N/A | N/A
|  /api/movies/{id}/similar | Get similar movies by movie id | N/A  | N/A | N/A
| /api/users |  Get all users for movie | Create a new user for Movie | N/A  | N/A 
| /api/users/{username} | N/A | N/A | N/A  | Delete user by user name
| api/users/{userName}/favourites | Get user favourite movie  | Add movies to favourite movies| N/A  | N/A 
| api/users/{userName}/liked_actors | Get user liked actors  | Add movies to actor list| N/A  | N/A 
| api/users/{userName}/tvlist | Get user favourite tv  | Add movies to favourite tv| N/A  | N/A 
| /api/users/{id} | N/A | N/A | Update user details  | N/A 
| /api/users/(userName)/favourites/{id} |N/A  | N/A | N/A  | Delete user favourite movies by id
| /api/tvs | Get a list of tv | N/A | N/A  | N/A 
| /api/tvs/tmdb/populartv | Get a list of popular tv | N/A | N/A  | N/A 
| /api/tvs/{id} | Get tv details by id | N/A | N/A  | N/A 
| /api/tvs/search/(page} | Search tv by page | N/A | N/A  | N/A 
| /api/tvs/{id}/reviews | Get all reviews for tv | Create a new review for tv | N/A | N/A  
| /api/actors | Get a list of actors | N/A | N/A  | N/A 
| /api/actors/{id} | Get actors by id | N/A | N/A  | N/A 
| /api/genres | Get a list of genres | N/A | N/A  | N/A 
| /api/rate | Get movies rate  | Add a rate to movie | N/A | N/A


If you have your API design on an online platform or graphic, please link to it (e.g. [Swaggerhub](https://app.swaggerhub.com/api/Laruana-h/movies-api_documentation/1.0.0)).


## Security and Authentication
Give details of authentication/ security implemented on the API(e.g. passport/sessions). Indicate which routes are protected.
- session file:

~~~Javascript
app.use(
  session({
    secret: "ilikecake",
    resave: true,
    saveUninitialized: true,
  })
);
~~~

- authentication file:

~~~Javascript
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;
let jwtOptions = {};
jwtOptions.jwtFromRequest = ExtractJWT.fromAuthHeaderAsBearerToken();
jwtOptions.secretOrKey = process.env.SECRET;
const strategy = new JWTStrategy(jwtOptions, async (payload, next) => {
  const user = await UserModel.findByUserName(payload);
  if (user) {
    next(null, user);
  } else {
    next(null, false);
  }
});
passport.use(strategy);
~~~
- protected route：

~~~Javascript
app.use('/api/actors', passport.authenticate('jwt', {session: false}), actorsRouter);
app.use('/api/rate', passport.authenticate('jwt', {session: false}), rateRouter);
~~~

## Integrating with React App

Describe how you integrated your React app with the API. Perhaps link to the React App repo and give an example of an API call from React App. For example: 
- API call from React App

~~~Javascript
export const getMovies = () => {
  return fetch(
     '/api/movies',{headers: {
       'Authorization': window.localStorage.getItem('token')
    }
  }
  )
    .then(res => res.json())
    .then(json => {return json.results;});
};

export const getPopularActor = () => {
  return fetch(
     '/api/actors',{headers: {
       'Authorization': window.localStorage.getItem('token')
    }
  }
  ).then(res => res.json());
  
  export const getUpcomingMovies = () => {
    return fetch(
      '/api/movies/tmdb/upcoming',{headers: {
        'Authorization': window.localStorage.getItem('token')
     }
   }
    ).then(res => res.json());
  };
  

export const getNowplayingMovies = () => {
  return fetch(
    '/api/movies/tmdb/nowplaying',{headers: {
      'Authorization': window.localStorage.getItem('token')
   }
 }
  ).then(res => res.json());
};
~~~
- login/sign up API
    can use mongoDB user login   
~~~Javascript
  export const login = (username, password) => {
    return fetch('/api/users', {
        headers: {
            'Content-Type': 'application/json'
        },
        method: 'post',
        body: JSON.stringify({ username: username, password: password })
    }).then(res => res.json())
};

export const signup = (username, password) => {
    return fetch('/api/users?action=register', {
        headers: {
            'Content-Type': 'application/json'
        },
        method: 'post',
        body: JSON.stringify({ username: username, password: password })
    }).then(res => res.json())
};

~~~





