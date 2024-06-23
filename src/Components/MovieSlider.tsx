import { IGetMoviesResult, IMovie } from "../api";
import {
  Box,
  Button,
  SliderContainer,
  Info,
  InfoBtn,
  InfoBtnContainer,
  Row,
  Slider,
  SliderTitle,
  arrow,
  boxVars,
  categories,
  infoVars,
  makeImagePath,
} from "../utils";
import { useQueryClient } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
interface IProps {
  category: string;
  title: string;
  width: number;
}

export default function MovieSlider({ category, title, width }: IProps) {
  const cache = useQueryClient();
  const data = cache.getQueryData(["movies", category]) as IGetMoviesResult;
  const [loading, setLoading] = useState(true);
  const [isNext, setIsNext] = useState<boolean>();
  const [leaving, setLeaving] = useState(false);
  const [index, setIndex] = useState(0);
  const toggleLeaving = () => setLeaving((p) => !p);
  const navigate = useNavigate();
  const [movies, setMovies] = useState<IMovie[] | undefined>(data?.results);
  useEffect(() => {
    if (category === categories.movie.NOW_PLAYING)
      setMovies(data?.results.filter((_, idx) => idx !== 0));
    setLoading(false);
  }, [data?.results]);
  const onNextIndex = async (dir: string) => {
    if (movies) {
      if (leaving) return;
      let newMovies;
      toggleLeaving();
      if (dir === arrow.NEXT) {
        // next
        const copyMovies1 = movies.slice(0, 6);
        const copyMovies2 = movies.slice(6, movies.length);
        newMovies = [...copyMovies2, ...copyMovies1];
        await setIsNext(true);
      } else if (dir === arrow.PREV) {
        // previous
        const copyMovies1 = movies.slice(movies.length - 6, movies.length);
        const copyMovies2 = movies.slice(0, movies.length - 6);
        newMovies = [...copyMovies1, ...copyMovies2];
        await setIsNext(false);
      }
      setMovies(newMovies);
      setIndex((p) => p + 1);
    }
  };
  const onBoxClick = (movieId: number) => {
    navigate(`/movies/${movieId}`);
  };
  return loading ? (
    <div>Loading</div>
  ) : (
    <SliderContainer>
      <SliderTitle>{title}</SliderTitle>
      <Slider>
        <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
          <Row
            initial={{ x: isNext ? width : -width }}
            animate={{ x: 0 }}
            exit={{ x: isNext ? -width : width }}
            transition={{ type: "tween", duration: 0.5 }}
            key={index}
          >
            {movies?.slice(0, 8).map((movie, idx) => (
              <Box
                layoutId={movie.id + category}
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
                  <InfoBtnContainer>
                    <InfoBtn>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="#000"
                        viewBox="0 0 24 24"
                        role="img"
                        data-icon="PlayStandard"
                        aria-hidden="true"
                      >
                        <path d="M5 2.69127C5 1.93067 5.81547 1.44851 6.48192 1.81506L23.4069 11.1238C24.0977 11.5037 24.0977 12.4963 23.4069 12.8762L6.48192 22.1849C5.81546 22.5515 5 22.0693 5 21.3087V2.69127Z"></path>
                      </svg>
                    </InfoBtn>
                    <InfoBtn>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        role="img"
                        data-icon="PlusStandard"
                        aria-hidden="true"
                      >
                        <path
                          d="M11 11V2H13V11H22V13H13V22H11V13H2V11H11Z"
                          fill="currentColor"
                        ></path>
                      </svg>
                    </InfoBtn>
                    <InfoBtn>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 1 24 24"
                        role="img"
                        data-icon="ThumbsUpStandard"
                        aria-hidden="true"
                      >
                        <path
                          d="M10.696 8.7732C10.8947 8.45534 11 8.08804 11 7.7132V4H11.8377C12.7152 4 13.4285 4.55292 13.6073 5.31126C13.8233 6.22758 14 7.22716 14 8C14 8.58478 13.8976 9.1919 13.7536 9.75039L13.4315 11H14.7219H17.5C18.3284 11 19 11.6716 19 12.5C19 12.5929 18.9917 12.6831 18.976 12.7699L18.8955 13.2149L19.1764 13.5692C19.3794 13.8252 19.5 14.1471 19.5 14.5C19.5 14.8529 19.3794 15.1748 19.1764 15.4308L18.8955 15.7851L18.976 16.2301C18.9917 16.317 19 16.4071 19 16.5C19 16.9901 18.766 17.4253 18.3994 17.7006L18 18.0006L18 18.5001C17.9999 19.3285 17.3284 20 16.5 20H14H13H12.6228C11.6554 20 10.6944 19.844 9.77673 19.5382L8.28366 19.0405C7.22457 18.6874 6.11617 18.5051 5 18.5001V13.7543L7.03558 13.1727C7.74927 12.9688 8.36203 12.5076 8.75542 11.8781L10.696 8.7732ZM10.5 2C9.67157 2 9 2.67157 9 3.5V7.7132L7.05942 10.8181C6.92829 11.0279 6.72404 11.1817 6.48614 11.2497L4.45056 11.8313C3.59195 12.0766 3 12.8613 3 13.7543V18.5468C3 19.6255 3.87447 20.5 4.95319 20.5C5.87021 20.5 6.78124 20.6478 7.65121 20.9378L9.14427 21.4355C10.2659 21.8094 11.4405 22 12.6228 22H13H14H16.5C18.2692 22 19.7319 20.6873 19.967 18.9827C20.6039 18.3496 21 17.4709 21 16.5C21 16.4369 20.9983 16.3742 20.995 16.3118C21.3153 15.783 21.5 15.1622 21.5 14.5C21.5 13.8378 21.3153 13.217 20.995 12.6883C20.9983 12.6258 21 12.5631 21 12.5C21 10.567 19.433 9 17.5 9H15.9338C15.9752 8.6755 16 8.33974 16 8C16 6.98865 15.7788 5.80611 15.5539 4.85235C15.1401 3.09702 13.5428 2 11.8377 2H10.5Z"
                          fill="currentColor"
                        ></path>
                      </svg>
                    </InfoBtn>
                  </InfoBtnContainer>
                  <h4>{movie.title}</h4>
                </Info>
              </Box>
            ))}
          </Row>
        </AnimatePresence>
        <Button position="prev" onClick={() => onNextIndex(arrow.PREV)}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
            fill="white"
            width="1.6vw"
            height="1.6vw"
          >
            <path d="M512 256A256 256 0 1 0 0 256a256 256 0 1 0 512 0zM271 135c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-87 87 87 87c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0L167 273c-9.4-9.4-9.4-24.6 0-33.9L271 135z" />
          </svg>
        </Button>
        <Button position="next" onClick={() => onNextIndex(arrow.NEXT)}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
            fill="white"
            width="1.6vw"
            height="1.6vw"
          >
            <path d="M0 256a256 256 0 1 0 512 0A256 256 0 1 0 0 256zM241 377c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l87-87-87-87c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0L345 239c9.4 9.4 9.4 24.6 0 33.9L241 377z" />
          </svg>
        </Button>
      </Slider>
    </SliderContainer>
  );
}
