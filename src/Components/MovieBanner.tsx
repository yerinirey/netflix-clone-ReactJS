import styled from "styled-components";
import { makeImagePath } from "../utils";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  IGetMoviesResult,
  IImages,
  getMovieImages,
  getMovieImagesUs,
} from "../api";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const BannerContainer = styled.div<{ $bgPhoto: string }>`
  height: 84vh;
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
const Logo = styled(motion.div)`
  width: 100%;
  height: 16vw;
  background-size: contain;
  background-position: center center;
  background-repeat: no-repeat;
  filter: drop-shadow(0px 10px 12px black);
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

export default function MovieBanner() {
  const cache = useQueryClient();
  const movie = (
    cache.getQueryData(["movies", "now_playing"]) as IGetMoviesResult
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
          <Logo style={{ backgroundImage: `url(${makeImagePath(logo)})` }} />
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
