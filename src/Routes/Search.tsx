import { useQuery } from "@tanstack/react-query";
import { useLocation } from "react-router-dom";
import { IMovie, ITv, getSearchForMovies, getSearchForTvs } from "../api";
import styled from "styled-components";
import { Loader, Overlay, makeImagePath } from "../utils";
import { motion, useScroll } from "framer-motion";
import { useEffect, useState } from "react";
import MovieDetail from "../Components/MovieDetail";
import TvDetail from "../Components/TvDetail";

const Container = styled.div`
  width: 100%;
  padding: 0 60px;
  padding-top: calc(68px + 5vw);
`;
const Keyword = styled(motion.h2)`
  font-size: 1.6vw;
`;
const Grid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  row-gap: 1vw;
  column-gap: 5vw;
  justify-content: stretch;
`;
const Poster = styled(motion.div)`
  height: 14vw;
  background-position: center center;
  background-size: cover;
  background-repeat: no-repeat;
  box-shadow: 0 0 1vw black;
  border-radius: 0.5rem;
  position: relative;
`;
const keywordVars = {
  start: {
    opacity: 0,
    y: 20,
  },
  end: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
    },
  },
};
const gridVars = {
  start: {
    opacity: 0,
  },
  end: {
    opacity: 1,
    transition: {
      delay: 0.8,
      staggerChildren: 0.03,
      delayChildren: 0.8,
    },
  },
};
const posterVars = {
  start: {
    opacity: 0,
    y: 10,
  },
  end: {
    opacity: 1,
    y: 0,
  },
};
const Header = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 1vw;
`;
const ButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 10px;
`;
const Button = styled.button`
  padding: 0.5vw 1vw;
  background-color: ${(props) => props.theme.black.lighter};
  border: 1px solid ${(props) => props.theme.black.darker};
  color: white;
  font-weight: 600;
  border-radius: 0.3vw;
  &.selected {
    background-color: gray;
  }
  &:hover {
    cursor: pointer;
    background-color: ${(props) => props.theme.white.darker};
    color: black;
  }
`;

function Search() {
  const { scrollY } = useScroll();
  const location = useLocation();
  const keyword = new URLSearchParams(location.search).get("keyword");
  const { data: movies, isLoading: moviesLoading } = useQuery<{
    results: IMovie[];
  }>({
    queryKey: ["movies", keyword],
    queryFn: () => getSearchForMovies(keyword!),
  });
  const { data: tv, isLoading: tvLoading } = useQuery<{ results: ITv[] }>({
    queryKey: ["tv", keyword],
    queryFn: () => getSearchForTvs(keyword!),
  });
  const [selected, setSelected] = useState<any>();
  const loading = moviesLoading || tvLoading;
  useEffect(() => {
    // initial default
    if (movies) setSelected(movies);
    else if (tv) setSelected(tv);
  }, [movies, tv]);
  const [contentIdx, setContentIdx] = useState(-1); // 해당 탭에서 클릭한 영화의 인덱스
  console.log(selected);
  console.log(contentIdx);
  return loading ? (
    <Loader>Loading</Loader>
  ) : (
    <>
      <Container>
        <Header>
          <Keyword variants={keywordVars} initial="start" animate="end">
            {keyword}의 검색결과:
          </Keyword>
          <ButtonContainer>
            <Button
              className={selected === movies ? "selected" : ""}
              onClick={() => setSelected(movies)}
            >
              영화
            </Button>
            <Button
              className={selected === tv ? "selected" : ""}
              onClick={() => setSelected(tv)}
            >
              TV
            </Button>
          </ButtonContainer>
        </Header>
        <Grid variants={gridVars} initial="start" animate="end">
          {selected &&
            selected.results.map((content: ITv | IMovie, index: number) => (
              <Poster
                onClick={() => setContentIdx(index)}
                layoutId={content.id + ""}
                variants={posterVars}
                key={content.id}
                custom={content.id}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 1.0 }}
                style={{
                  backgroundImage: content.poster_path
                    ? `url(${makeImagePath(content.poster_path)})`
                    : `url(${makeImagePath(content.backdrop_path)})`,
                  display:
                    !content.poster_path && !content.backdrop_path
                      ? "none"
                      : "block",
                }}
              />
            ))}
        </Grid>
      </Container>
      {contentIdx !== -1 && (
        <>
          <Overlay style={{ opacity: 1 }} onClick={() => setContentIdx(-1)} />
          {selected === movies ? (
            <MovieDetail
              movie={selected.results[contentIdx]}
              $isBanner={false}
              category=""
              height={scrollY.get()}
            />
          ) : (
            <TvDetail
              tv={selected.results[contentIdx]}
              $isBanner={false}
              category=""
              height={scrollY.get()}
            />
          )}
        </>
      )}
    </>
  );
}

export default Search;
