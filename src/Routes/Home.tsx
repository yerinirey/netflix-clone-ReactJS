import { useQuery } from "@tanstack/react-query";
import { IGetMoviesResult, IMovie, getMovies } from "../api";
import styled from "styled-components";
import { makeImagePath } from "../utils";
import { motion, AnimatePresence, px } from "framer-motion";
import { useEffect, useState } from "react";

const Wrapper = styled.div`
  background-color: ${(props) => props.theme.black.veryDark};
  overflow-x: hidden;
  padding-bottom: 200px;
`;

const Loader = styled.div`
  height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Banner = styled.div<{ $bgPhoto: string }>`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 60px;
  background-image: linear-gradient(
      rgba(0, 0, 0, 0),
      rgba(0, 0, 0, 0),
      ${(props) => props.theme.black.veryDark}
    ),
    url(${(props) => props.$bgPhoto});
  background-size: cover;
  text-shadow: 0 0 1.5vw ${(props) => props.theme.black.veryDark},
    0 0 1.5vw ${(props) => props.theme.black.veryDark},
    0 0 1.5vw ${(props) => props.theme.black.veryDark};
`;

const Title = styled.h2`
  font-size: 3.2vw;
  margin-bottom: 20px;
`;
const Overview = styled.p`
  font-size: 1.2vw;

  width: 50%;
`;

const Slider = styled.div`
  position: relative;
  overflow-x: visible;
  top: -100px;
  width: 100%;
  background-color: tomato;
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

function Home() {
  const { data, isLoading } = useQuery<IGetMoviesResult>({
    queryKey: ["movies", "nowPlaying"],
    queryFn: getMovies,
  });
  const [movies, setMovies] = useState<IMovie[] | undefined>([]);
  const [width, setWidth] = useState(window.innerWidth * 1.24 * (7 / 8));

  const [index, setIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const toggleLeaving = () => setLeaving((p) => !p);
  const increaseIndex = () => {
    if (data) {
      if (leaving) return;
      toggleLeaving();
      if (movies) {
        const copyMovies1 = movies.slice(0, 7);
        const copyMovies2 = movies.slice(7, movies.length);
        setMovies([...copyMovies2, ...copyMovies1]);
        setIndex((p) => p + 1);
      }
    }
  };
  useEffect(() => {
    if (data?.results) {
      setMovies(data.results.slice(1));
      console.log(movies);
    }
  }, [data?.results]);

  useEffect(() => {
    window.addEventListener("resize", () =>
      setWidth(window.innerWidth * 1.24 * (7 / 8))
    );
    return () =>
      window.removeEventListener("resize", () =>
        setWidth(window.innerWidth * 1.24 * (7 / 8))
      );
  }, [window.innerWidth]);

  return (
    <Wrapper>
      {isLoading ? (
        <Loader>Loading</Loader>
      ) : (
        <>
          <Banner
            onClick={increaseIndex}
            $bgPhoto={makeImagePath(data?.results[0].backdrop_path || "")}
          >
            <Title>{data?.results[0].title}</Title>
            <Overview>{data?.results[0].overview}</Overview>
          </Banner>
          <Slider>
            <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
              <Row
                initial={{ x: width }}
                animate={{ x: 0 }}
                exit={{ x: -width }}
                transition={{ type: "tween", duration: 5 }}
                key={index}
              >
                {movies?.slice(0, 8).map((movie, idx) => (
                  <Box
                    className="box"
                    key={movie.id}
                    variants={boxVars}
                    whileHover={idx !== 0 && idx !== 7 ? "hover" : undefined}
                    initial="normal"
                    transition={{ type: "tween" }}
                    $bgPhoto={makeImagePath(movie.backdrop_path, "w500")}
                  >
                    <Info variants={infoVars}>
                      <h4>{movie.title}</h4>
                    </Info>
                  </Box>
                ))}
              </Row>
            </AnimatePresence>
          </Slider>
        </>
      )}
    </Wrapper>
  );
}

export default Home;
