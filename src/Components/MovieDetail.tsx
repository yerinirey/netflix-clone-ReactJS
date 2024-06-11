import { motion, useScroll } from "framer-motion";
import styled from "styled-components";
import { IMovie, IMovieDetail, getMovieDetail } from "../api";
import { makeImagePath } from "../utils";
import { useQuery } from "@tanstack/react-query";

const Container = styled(motion.div)`
  position: absolute;
  width: 50vw;
  height: 90vh;
  left: 0;
  right: 0;
  margin: 0 auto;
  background-color: ${(props) => props.theme.black.darker};
  border-radius: 10px;
  overflow: hidden;
`;
const Cover = styled.div`
  width: 100%;
  height: 49%;
  background-size: cover;
  background-position: center center;
`;
const Details = styled.div`
  display: flex;
  flex-direction: row;
  padding: 0 30px;
  color: ${(props) => props.theme.white.lighter};
  border: 1px solid yellow;
`;
const Detail = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
  width: 60%;
  &:first-child {
    border: 1px solid red;
  }
  &:last-child {
    border: 1px solid blue;
    width: 40%;
    display: flex;
  }
`;
const Title = styled.h2`
  font-size: 2vw;
  position: relative;
`;
const Tagline = styled.h3`
  font-style: italic;
  font-size: 0.8vw;
`;
const Overview = styled.p`
  position: relative;
  font-size: 0.8vw;
  line-height: 1.5;
`;
const Genre = styled.ul`
  background-color: teal;
  display: flex;
  flex-direction: row;
`;
interface IDetail {
  movie: IMovie;
}
export default function MovieDetail({ movie }: IDetail) {
  const { scrollY } = useScroll();
  const movieId = movie.id;
  const { data, isLoading } = useQuery<IMovieDetail>({
    queryKey: ["movies", movieId + ""],
    queryFn: () => getMovieDetail(movieId + ""),
  });
  return (
    <Container layoutId={movie.id + ""} style={{ top: scrollY.get() + 32 }}>
      {!isLoading && (
        <>
          <Cover
            style={{
              backgroundImage: `linear-gradient(transparent 50%, #181818 100%),
                          url(${makeImagePath(
                            movie.backdrop_path ?? movie.poster_path
                          )})`,
            }}
          />
          <Details>
            <Detail>
              <Title>{movie.title}</Title>
              <Tagline>{data?.tagline && `❝${data.tagline}❞`}</Tagline>
              <Overview>{movie.overview}</Overview>
            </Detail>
            <Detail>
              <Genre>
                장르:
                {data?.genres.map((genre, idx) => (
                  <li key={idx}>{genre.name}</li>
                ))}
              </Genre>
            </Detail>
          </Details>
        </>
      )}
    </Container>
  );
}
