import { NumericKeys } from "react-hook-form/dist/types/path/common";

const API_KEY = "0a61e6abbc460b2dbf8a754c1c363f7c";
const BASE_PATH = "https://api.themoviedb.org/3";
const QUERY_PARAMS = `api_key=${API_KEY}&language=ko-KO&region=KR`;
/* ------------------API and Interface for Movies------------------ */
/* get movies by category */
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
export function getNowPlayingMovies() {
  return fetch(`${BASE_PATH}/movie/now_playing?${QUERY_PARAMS}`).then(
    (response) => response.json()
  );
}
export function getTopRatedMovies() {
  return fetch(`${BASE_PATH}/movie/top_rated?${QUERY_PARAMS}`).then(
    (response) => response.json()
  );
}
export function getUpcomingMovies() {
  return fetch(`${BASE_PATH}/movie/upcoming?${QUERY_PARAMS}`).then((response) =>
    response.json()
  );
}
/* get movie detail by id */
interface IGenre {
  id: number;
  name: string;
}
interface ICompany {
  id: number;
  logo_path: string;
  name: string;
}
export interface IMovieDetail {
  adult: boolean;
  genres: IGenre[];
  tagline: string;
  vote_average: number;
  release_date: string;
  runtime: number;
  production_companies: ICompany[];
}
export function getMovieDetail(movieId: string) {
  return fetch(`${BASE_PATH}/movie/${movieId}?${QUERY_PARAMS}`).then(
    (response) => response.json()
  );
}
/* get movie's watch provider */
interface IProvider {
  logo_path: string;
  provider_name: string;
}
export interface IWatchProviders {
  id: number;
  results?: {
    KR?: {
      buy?: IProvider[];
      flatrate?: IProvider[];
      rent?: IProvider[];
    };
  };
}
export function getWatchProvidersForMovie(movieId: string) {
  return fetch(
    `${BASE_PATH}/movie/${movieId}/watch/providers?${QUERY_PARAMS}`
  ).then((response) => response.json());
}
/* get movie's credit(actors) */
interface IMovieCreditActor {
  id: number;
  name: number;
  character: number;
}
export interface IMovieCredit {
  id: number;
  cast: IMovieCreditActor[];
}
export function getMovieCredits(movieId: string) {
  return fetch(`${BASE_PATH}/movie/${movieId}/credits?${QUERY_PARAMS}`).then(
    (response) => response.json()
  );
}
/*get movie's image for logo */
export interface IImage {
  file_path: string;
}
export interface IImages {
  id: number;
  logos: IImage[];
  posters: IImage[];
}
export function getMovieImages(movieId: string) {
  return fetch(
    `${BASE_PATH}/movie/${movieId}/images?include_image_language=ko&api_key=${API_KEY}`
  ).then((response) => response.json());
}
export function getMovieImagesUs(movieId: string) {
  return fetch(
    `${BASE_PATH}/movie/${movieId}/images?include_image_language=en&api_key=${API_KEY}`
  ).then((response) => response.json());
}

/* ------------------API and Interface for TV------------------ */

export interface ITv {
  adult: boolean;
  backdrop_path: string;
  genre_ids: number[];
  id: number;
  origin_country: string[];
  name: string;
  overview: string;
  vote_average: number;
  poster_path: string;
  first_air_date: string;
}
export interface IGetTvResult {
  results: ITv[];
}
export function getTopRatedTv() {
  return fetch(`${BASE_PATH}/tv/top_rated?${QUERY_PARAMS}`).then((response) =>
    response.json()
  );
}
export function getTvImages(tvId: string) {
  return fetch(
    `${BASE_PATH}/tv/${tvId}/images?include_image_language=ko&api_key=${API_KEY}`
  ).then((response) => response.json());
}
export function getTvImagesUs(tvId: string) {
  return fetch(`${BASE_PATH}/tv/${tvId}/images?api_key=${API_KEY}`).then(
    (response) => response.json()
  );
}
interface ICreatedBy {
  id: number;
  name: string;
  profile_path: string;
}
interface ISeason {
  air_date: string;
  episode_count: number;
  id: number;
  name: string;
  overview: string;
  poster_path: string;
  season_number: number;
}
export interface ITvDetail {
  adult: boolean;
  id: number;
  backdrop_path: string;
  created_by: ICreatedBy[];
  genres: { id: number; name: string }[];
  name: string;
  number_of_episodes: number;
  number_of_seasons: number;
  production_companies: ICompany[];
  vote_average: number;
  first_air_date: string;
  last_air_date: string;
  status: string; // 완결 정도
  tagline: string;
  seasons: ISeason[];
}

export function getTvDetail(tvId: string) {
  return fetch(`${BASE_PATH}/tv/${tvId}?${QUERY_PARAMS}`).then((response) =>
    response.json()
  );
}
export function getWatchProvidersForTv(tvId: string) {
  return fetch(
    `${BASE_PATH}/tv/${tvId}/watch/providers?api_key=${API_KEY}`
  ).then((response) => response.json());
}
interface IEpisode {
  id: number;
  episode_number: number;
  name: string; // episode title
  overview: string;
  runtime: number;
  still_path: string;
}

export interface IGetEpisodes {
  episodes: IEpisode[];
  name: string;
  overview: string;
  id: number;
  poster_path: number;
  season_number: number;
}
export function getTvEpisodes(tvId: string, seasonNumber: string) {
  return fetch(
    `${BASE_PATH}/tv/${tvId}/season/${seasonNumber}?${QUERY_PARAMS}`
  ).then((response) => response.json());
}

export function getSearchForMovies(query: string) {
  return fetch(
    `${BASE_PATH}/search/movie?query=${query}&include_adult=true&${QUERY_PARAMS}`
  ).then((response) => response.json());
}
export function getSearchForTvs(query: string) {
  return fetch(
    `${BASE_PATH}/search/tv?query=${query}&include_adult=true&${QUERY_PARAMS}`
  ).then((response) => response.json());
}
