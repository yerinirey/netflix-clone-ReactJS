import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  IGetMoviesResult,
  IImages,
  getMovieImages,
  getMovieImagesUs,
} from "../api";
import {
  BannerBtn1,
  BannerBtn2,
  BannerBtnBox,
  BannerContainer,
  BannerDetail,
  BannerOverview,
  BannerTitle,
  BannerLogo,
  categories,
  makeImagePath,
} from "../utils";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function MovieBanner() {
  const cache = useQueryClient();
  const movie = (
    cache.getQueryData([
      "movies",
      categories.movie.NOW_PLAYING,
    ]) as IGetMoviesResult
  ).results[0];
  const navigate = useNavigate();
  const { data: img, isLoading: imgLoading } = useQuery<IImages>({
    queryKey: ["movies", movie.id + "", "images"],
    queryFn: () => getMovieImages(movie.id + ""),
  });
  const { data: imgUs, isLoading: imgUsLoading } = useQuery<IImages>({
    queryKey: ["movies", movie.id + "", "images-us"],
    queryFn: () => getMovieImagesUs(movie.id + ""),
  });
  const [logo, setLogo] = useState<string>("");
  useEffect(() => {
    if (img && img?.logos.length !== 0) setLogo(img?.logos[0].file_path);
    else if (imgUs && imgUs?.logos.length !== 0)
      setLogo(imgUs?.logos[0].file_path);
  }, [img, imgUs]);
  return (
    <BannerContainer $bgPhoto={makeImagePath(movie.backdrop_path || "")}>
      <BannerDetail>
        {logo !== "" ? (
          <BannerLogo
            style={{ backgroundImage: `url(${makeImagePath(logo)})` }}
          />
        ) : (
          <BannerTitle>{movie.title}</BannerTitle>
        )}

        <BannerOverview>{movie.overview}</BannerOverview>
        <BannerBtnBox>
          <BannerBtn1>
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
          <BannerBtn2 onClick={() => navigate(`/movies/${movie.id}`)}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              role="img"
              data-icon="CircleIStandard"
              aria-hidden="true"
            >
              <path
                d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2ZM0 12C0 5.37258 5.37258 0 12 0C18.6274 0 24 5.37258 24 12C24 18.6274 18.6274 24 12 24C5.37258 24 0 18.6274 0 12ZM13 10V18H11V10H13ZM12 8.5C12.8284 8.5 13.5 7.82843 13.5 7C13.5 6.17157 12.8284 5.5 12 5.5C11.1716 5.5 10.5 6.17157 10.5 7C10.5 7.82843 11.1716 8.5 12 8.5Z"
                fill="currentColor"
              ></path>
            </svg>
            <span>상세 정보</span>
          </BannerBtn2>
        </BannerBtnBox>
      </BannerDetail>
    </BannerContainer>
  );
}
