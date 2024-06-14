import { useQuery } from "@tanstack/react-query";
import {
  IGetMoviesResult,
  IMovie,
  getNowPlayingMovies,
  getTopRatedMovies,
  getUpcomingMovies,
} from "../api";
import styled from "styled-components";

import { motion, AnimatePresence, useScroll } from "framer-motion";
import { useEffect, useState } from "react";
import { PathMatch, useMatch, useNavigate } from "react-router-dom";
import MovieSlider from "../Components/MovieSlider";
import MovieBanner from "../Components/MovieBanner";
import MovieDetail from "../Components/MovieDetail";

/* Base Components */
const Wrapper = styled.div`
  background-color: ${(props) => props.theme.black.veryDark};
  overflow-x: hidden;
  padding-bottom: 100px;
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
    NOW_PLAYING: "now_playing",
    TOP_RATED: "top_rated",
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
  const { scrollY } = useScroll();
  const [category, setCategory] = useState<string>();
  const [allMovies, setAllMovies] = useState<IMovie[]>([]);
  const detailMovieMatch: PathMatch<string> | null =
    useMatch("/movies/:movieId");

  /* navigate functions */
  const navigate = useNavigate();
  const onOverlayClick = () => {
    navigate("/");
  };

  /* track window.innerWidth */
  const [width, setWidth] = useState(window.innerWidth * 1.24 * (6 / 8));

  useEffect(() => {
    window.addEventListener("resize", () =>
      setWidth(window.innerWidth * 1.24 * (6 / 8))
    );
    return () =>
      window.removeEventListener("resize", () =>
        setWidth(window.innerWidth * 1.24 * (6 / 8))
      );
  }, [window.innerWidth]);
  /* check fetch success */
  useEffect(() => {
    if (nowData && topData && upcomingData) {
      console.log("successed fetching all movies");
      setAllMovies([
        ...nowData?.results.filter((_, idx) => idx !== 0),
        ...topData?.results,
        ...upcomingData?.results,
      ]);
    }
  }, [nowData, topData, upcomingData]);

  const onClick = (clickedCategory: string) => {
    setCategory(clickedCategory);
  };
  const clickedMovie =
    (detailMovieMatch?.params.movieId &&
      allMovies?.find(
        (movie) => movie.id + "" === detailMovieMatch.params.movieId
      )) ||
    nowData?.results[0];
  console.log("clickedMovie ?", clickedMovie);
  console.log("detailMatch?", detailMovieMatch);
  return (
    <Wrapper>
      {loading ? (
        <Loader>Loading</Loader>
      ) : (
        <>
          <div
            onClick={() => {
              onClick(categories.movie.NOW_PLAYING);
            }}
          >
            <MovieBanner />
          </div>
          <div onClick={() => onClick(categories.movie.NOW_PLAYING)}>
            <MovieSlider
              width={width}
              category={categories.movie.NOW_PLAYING}
              title={"지금 상영중인 영화"}
            />
          </div>
          <div onClick={() => onClick(categories.movie.TOP_RATED)}>
            <MovieSlider
              width={width}
              category={categories.movie.TOP_RATED}
              title={"TOP20"}
            />
          </div>
          <div onClick={() => onClick(categories.movie.UPCOMING)}>
            <MovieSlider
              width={width}
              category={categories.movie.UPCOMING}
              title={"개봉 예정작"}
            />
          </div>
          <AnimatePresence>
            {detailMovieMatch ? (
              <>
                <Overlay
                  onClick={onOverlayClick}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                />
                {clickedMovie && (
                  <MovieDetail
                    $isBanner={clickedMovie.id === nowData?.results[0].id}
                    height={scrollY.get()}
                    movie={clickedMovie}
                    category={category}
                  />
                )}
              </>
            ) : null}
          </AnimatePresence>
        </>
      )}
    </Wrapper>
  );
}

export default Home;
