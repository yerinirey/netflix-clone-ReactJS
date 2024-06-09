import { useQuery } from "@tanstack/react-query";
import {
  IGetMoviesResult,
  IMovie,
  getNowPlayingMovies,
  getTopRatedMovies,
} from "../api";
import styled from "styled-components";
import { makeImagePath } from "../utils";
import { motion, AnimatePresence, px, useScroll } from "framer-motion";
import { useEffect, useState } from "react";
import { PathMatch, useMatch, useNavigate } from "react-router-dom";

/* Base Components */
const Wrapper = styled.div`
  background-color: ${(props) => props.theme.black.veryDark};
  overflow-x: hidden;
`;
const Loader = styled.div`
  height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;
/* Main Banner Components */
const Banner = styled.div<{ $bgPhoto: string }>`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 60px;
  background-image: linear-gradient(
      rgba(0, 0, 0, 1) 0%,
      rgba(0, 0, 0, 0.5) 10%,
      rgba(0, 0, 0, 0),
      ${(props) => props.theme.black.veryDark}
    ),
    url(${(props) => props.$bgPhoto});
  background-size: cover;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.45), 2px 2px 20px rgba(0, 0, 0, 0.45);
`;
const BannerDetail = styled.div`
  width: 40%;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;
const BannerTitle = styled.h2`
  font-size: 3.2vw;
  font-weight: 600;
`;
const BannerOverview = styled.p`
  font-size: 1vw;
  line-height: 1.3;
  font-weight: 500;
`;
const BannerBtnBox = styled.div`
  display: flex;
  flex-direction: row;
  gap: 10px;
`;
const BannerBtn1 = styled.div`
  background-color: #fff;
  padding: 0.4vw 1vw;
  font-size: 1vw;
  font-weight: 500;
  text-shadow: none;
  color: black;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border-radius: 0.3rem;
  svg {
    width: 1.3vw;
    height: 1.3vw;
  }
  &:hover {
    opacity: 0.7;
    cursor: pointer;
  }
`;
const BannerBtn2 = styled(BannerBtn1)`
  background-color: rgba(109, 109, 110, 1);
  color: white;
  fill: white;
`;
/* Slider Components */
const Sliders = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  top: -90px;
`;
const Title = styled.h1`
  font-size: 1.6vw;
  padding-left: 4%;
  padding-bottom: 0.6vw;
`;
const Slider = styled.div`
  position: relative;
  overflow-x: visible;
  /* top: -100px; */
  width: 100%;
`;
const Row = styled(motion.div)`
  display: flex;
  flex-direction: row;
  gap: 10px;
  position: absolute;
  width: 124%;
  left: -12%;
`;
const Box = styled(motion.div)<{ $bgPhoto: string }>`
  background-image: url(${(props) => props.$bgPhoto});
  background-position: center center;
  font-size: 40px;
  background-size: cover;
  height: 200px;
  width: calc(100% / 8);
  border-radius: 8px;
  &:nth-child(2) {
    transform-origin: center left;
  }
  &:nth-child(7) {
    transform-origin: center right;
  }
  cursor: pointer;
`;
const Info = styled(motion.div)`
  padding: 10px;
  background-color: ${(props) => props.theme.black.lighter};
  opacity: 0;
  position: absolute;
  width: 100%;
  bottom: 0px;
  border-radius: 0 0 8px 8px;
  h4 {
    text-align: center;
    font-size: 18px;
  }
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
const DetailMovie = styled(motion.div)`
  position: absolute;
  width: 50vw;
  height: 80vh;
  left: 0;
  right: 0;
  margin: 0 auto;
  background-color: ${(props) => props.theme.black.darker};
  border-radius: 10px;
  overflow: hidden;
`;
const DetailCover = styled.div`
  width: 100%;
  height: 60%;
  background-size: cover;
  background-position: center center;
`;
const DetailTitle = styled.h2`
  color: ${(props) => props.theme.white.lighter};
  padding: 0 30px;
  font-size: 58px;
  position: relative;
  top: -20%;
`;
const DetailOverview = styled.p`
  padding: 0 30px;
  position: relative;
  color: ${(props) => props.theme.white.lighter};
  font-size: 20px;
  width: 50%;
  line-height: 1.5;
`;
/* Variants for framer-motion */
const boxVars = {
  normal: {
    scale: 1,
  },
  hover: {
    scale: 1.3,
    y: -50,
    transition: { delay: 0.4, type: "tween", duration: 0.2 },
  },
};
const infoVars = {
  hover: {
    opacity: 1,
    transition: { delay: 0.4, type: "tween", duration: 0.2 },
  },
};
const arrow = { PREV: "prev", NEXT: "next" };
function Home() {
  const { data: nowData, isLoading: nowLoading } = useQuery<IGetMoviesResult>({
    queryKey: ["movies", "nowPlaying"],
    queryFn: getNowPlayingMovies,
  });
  // const { data: topData, isLoading: topLoading } = useQuery<IGetMoviesResult>({
  //   queryKey: ["movies", "topRated"],
  //   queryFn: getTopRatedMovies,
  // });
  const detailMovieMatch: PathMatch<string> | null =
    useMatch("/movies/:movieId");
  const { scrollY } = useScroll(); // for modal
  const navigate = useNavigate();
  const [isNext, setIsNext] = useState<boolean>();
  const [movies, setMovies] = useState<IMovie[] | undefined>([]);
  const [width, setWidth] = useState(window.innerWidth * 1.24 * (7 / 8));
  const [index, setIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const toggleLeaving = () => setLeaving((p) => !p);
  const onNextIndex = async (dir: string) => {
    if (movies) {
      if (leaving) return;
      let newMovies;
      toggleLeaving();
      if (dir === arrow.NEXT) {
        // next
        const copyMovies1 = movies.slice(0, 7);
        const copyMovies2 = movies.slice(7, movies.length);
        newMovies = [...copyMovies2, ...copyMovies1];
        await setIsNext(true);
      } else if (dir === arrow.PREV) {
        // previous
        const copyMovies1 = movies.slice(movies.length - 7, movies.length);
        const copyMovies2 = movies.slice(0, movies.length - 7);
        newMovies = [...copyMovies1, ...copyMovies2];
        await setIsNext(false);
      }

      setMovies(newMovies);
      setIndex((p) => p + 1);
    }
  };

  /* navigate functions */
  const onOverlayClick = () => {
    navigate("/");
  };
  const onBoxClick = (movieId: number) => {
    navigate(`/movies/${movieId}`);
  };

  /* get movies from fetched data */
  useEffect(() => {
    if (nowData?.results) {
      setMovies(nowData.results.slice(1));
      console.log("successfully got movies");
    }
  }, [nowData?.results]);
  /* track window.innerWidth */
  useEffect(() => {
    window.addEventListener("resize", () =>
      setWidth(window.innerWidth * 1.24 * (7 / 8))
    );
    return () =>
      window.removeEventListener("resize", () =>
        setWidth(window.innerWidth * 1.24 * (7 / 8))
      );
  }, [window.innerWidth]);

  const clickedMovie =
    detailMovieMatch?.params.movieId &&
    nowData?.results.find(
      (movie) => movie.id + "" === detailMovieMatch.params.movieId
    );
  // console.log(topData);
  return (
    <Wrapper>
      {nowLoading || !movies ? (
        <Loader>Loading</Loader>
      ) : (
        <>
          <Banner
            $bgPhoto={makeImagePath(nowData?.results[0].backdrop_path || "")}
          >
            <BannerDetail>
              <BannerTitle>{nowData?.results[0].title}</BannerTitle>
              <BannerOverview>{nowData?.results[0].overview}</BannerOverview>
              <BannerBtnBox>
                <BannerBtn1
                  onClick={() => {
                    onNextIndex(arrow.PREV);
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    role="img"
                    data-icon="PlayStandard"
                    aria-hidden="true"
                  >
                    <path
                      d="M5 2.69127C5 1.93067 5.81547 1.44851 6.48192 1.81506L23.4069 11.1238C24.0977 11.5037 24.0977 12.4963 23.4069 12.8762L6.48192 22.1849C5.81546 22.5515 5 22.0693 5 21.3087V2.69127Z"
                      fill="currentColor"
                    ></path>
                  </svg>
                  <span>재생</span>
                </BannerBtn1>
                <BannerBtn2
                  onClick={() => {
                    onNextIndex(arrow.NEXT);
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    role="img"
                    data-icon="CircleIStandard"
                    aria-hidden="true"
                  >
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2ZM0 12C0 5.37258 5.37258 0 12 0C18.6274 0 24 5.37258 24 12C24 18.6274 18.6274 24 12 24C5.37258 24 0 18.6274 0 12ZM13 10V18H11V10H13ZM12 8.5C12.8284 8.5 13.5 7.82843 13.5 7C13.5 6.17157 12.8284 5.5 12 5.5C11.1716 5.5 10.5 6.17157 10.5 7C10.5 7.82843 11.1716 8.5 12 8.5Z"
                      fill="currentColor"
                    ></path>
                  </svg>
                  <span>상세 정보</span>
                </BannerBtn2>
              </BannerBtnBox>
            </BannerDetail>
          </Banner>
          <Sliders>
            {/* Now Playing */}
            <Title>지금 상영중인 영화</Title>
            <Slider>
              <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
                <Row
                  initial={{ x: isNext ? width : -width }}
                  animate={{ x: 0 }}
                  exit={{ x: isNext ? -width : width }}
                  // exit={{ x: "-108.5vw" }}
                  transition={{ type: "tween", duration: 1 }}
                  key={index}
                >
                  {movies?.slice(0, 8).map((movie, idx) => (
                    <Box
                      layoutId={movie.id + ""}
                      className="box"
                      key={movie.id}
                      onClick={() => onBoxClick(movie.id)}
                      variants={boxVars}
                      initial="normal"
                      whileHover={idx !== 0 && idx !== 7 ? "hover" : undefined}
                      transition={{ type: "tween" }}
                      $bgPhoto={makeImagePath(
                        movie.backdrop_path ?? movie.poster_path,
                        "w500"
                      )}
                    >
                      <Info variants={infoVars}>
                        <h4>{movie.title}</h4>
                      </Info>
                    </Box>
                  ))}
                </Row>
              </AnimatePresence>
            </Slider>
          </Sliders>

          <AnimatePresence>
            {detailMovieMatch ? (
              <>
                <Overlay
                  onClick={onOverlayClick}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                />
                <DetailMovie
                  layoutId={detailMovieMatch.params.movieId}
                  style={{ top: scrollY.get() + 32 }}
                >
                  {clickedMovie && (
                    <>
                      <DetailCover
                        style={{
                          backgroundImage: `linear-gradient(transparent 50%, #181818 ),
                          url(${makeImagePath(
                            clickedMovie.backdrop_path ??
                              clickedMovie.poster_path
                          )})`,
                        }}
                      />
                      <DetailTitle>{clickedMovie.title}</DetailTitle>
                      <DetailOverview>{clickedMovie.overview}</DetailOverview>
                    </>
                  )}
                </DetailMovie>
              </>
            ) : null}
          </AnimatePresence>
        </>
      )}
    </Wrapper>
  );
}

export default Home;
