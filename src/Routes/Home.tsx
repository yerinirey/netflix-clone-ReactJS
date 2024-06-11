import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  IGetMoviesResult,
  IMovie,
  getNowPlayingMovies,
  getTopRatedMovies,
  getUpcomingMovies,
} from "../api";
import styled from "styled-components";
import { makeImagePath } from "../utils";
import { motion, AnimatePresence, px, useScroll } from "framer-motion";
import { useEffect, useState } from "react";
import { PathMatch, useMatch, useNavigate } from "react-router-dom";
import MovieSlider from "../Components/MovieSlider";
import MainBanner from "../Components/Banner";
import MovieDetail from "../Components/MovieDetail";

/* Base Components */
const Wrapper = styled.div`
  background-color: ${(props) => props.theme.black.veryDark};
  overflow-x: hidden;
  /* overflow-y: hidden; */
`;
const Loader = styled.div`
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1vw;
`;

/* Slider Components */
const Sliders = styled.div`
  /* position: relative; */
  /* top: -200px; */
`;
/* Overlay and Detail Components */
const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  opacity: 0;
`;
const categories = {
  movie: {
    NOW_PLAYING: "nowPlaying",
    TOP_RATED: "topRated",
    UPCOMING: "upcoming",
  },
};

function Home() {
  const { data: nowData, isLoading: nowLoading } = useQuery<IGetMoviesResult>({
    queryKey: ["movies", categories.movie.NOW_PLAYING],
    queryFn: getNowPlayingMovies,
  });
  const { data: topData, isLoading: topLoading } = useQuery<IGetMoviesResult>({
    queryKey: ["movies", categories.movie.TOP_RATED],
    queryFn: getTopRatedMovies,
  });
  const { data: upcomingData, isLoading: upcomingLoading } =
    useQuery<IGetMoviesResult>({
      queryKey: ["movies", categories.movie.UPCOMING],
      queryFn: getUpcomingMovies,
    });
  const loading = nowLoading || topLoading || upcomingLoading;
  const detailMovieMatch: PathMatch<string> | null =
    useMatch("/movies/:movieId");

  /* navigate functions */
  const navigate = useNavigate();
  const onOverlayClick = () => {
    navigate("/");
  };
  /* track window.innerWidth */
  const [width, setWidth] = useState(window.innerWidth * 1.24 * (7 / 8));
  useEffect(() => {
    window.addEventListener("resize", () =>
      setWidth(window.innerWidth * 1.24 * (7 / 8))
    );
    return () =>
      window.removeEventListener("resize", () =>
        setWidth(window.innerWidth * 1.24 * (7 / 8))
      );
  }, [window.innerWidth]);
  const [allMovies, setAllMovies] = useState<IMovie[]>([]);
  /* check fetch success */
  useEffect(() => {
    if (nowData && topData && upcomingData) {
      console.log("successed fetching all movies");
      setAllMovies([
        ...nowData?.results,
        ...topData?.results,
        ...upcomingData?.results,
      ]);
    }
  }, [nowData, topData, upcomingData]);

  const clickedMovie =
    detailMovieMatch?.params.movieId &&
    allMovies?.find(
      (movie) => movie.id + "" === detailMovieMatch.params.movieId
    );
  console.log("clickedMovie: ", clickedMovie);
  console.log(detailMovieMatch);
  return (
    <Wrapper>
      {loading ? (
        <Loader>Loading</Loader>
      ) : (
        <>
          <MainBanner />
          <Sliders>
            <MovieSlider
              width={width}
              category={categories.movie.NOW_PLAYING}
              title={"지금 상영중인 영화"}
            />
            <MovieSlider
              width={width}
              category={categories.movie.TOP_RATED}
              title={"TOP20"}
            />
            <MovieSlider
              width={width}
              category={categories.movie.UPCOMING}
              title={"개봉 예정작"}
            />
          </Sliders>
          <AnimatePresence>
            {detailMovieMatch ? (
              <>
                <Overlay
                  onClick={onOverlayClick}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                />
                {clickedMovie && <MovieDetail movie={clickedMovie} />}
              </>
            ) : null}
          </AnimatePresence>
        </>
      )}
    </Wrapper>
  );
}

export default Home;
