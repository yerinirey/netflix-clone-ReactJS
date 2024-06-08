const API_KEY = "0a61e6abbc460b2dbf8a754c1c363f7c";
const BASE_PATH = "https://api.themoviedb.org/3";

export interface IMovie {
  id: number;
  backdrop_path: string;
  poster_path: string;
  title: string;
  overview: string;
}

export interface IGetMoviesResult {
  dates: {
    minimum: string;
    maximum: string;
  };
  page: number;
  results: IMovie[];
  total_pages: number;
  total_results: number;
}

interface IGenre {
  id: number;
  name: string;
}
export interface IMovieDetail {
  adult: boolean;
  genres: IGenre[];
  tagline: string;
  vote_average: number;
  release_date: string;
}

export function getMovies() {
  console.log(`${BASE_PATH}/movie/now_playing?api_key=${API_KEY}`);
  return fetch(`${BASE_PATH}/movie/now_playing?api_key=${API_KEY}`).then(
    (response) => response.json()
  );
}

export function getMovieDetail(movieId: string) {
  return fetch(`${BASE_PATH}/movie/${movieId}?api_key=${API_KEY}`).then(
    (response) => response.json()
  );
}
