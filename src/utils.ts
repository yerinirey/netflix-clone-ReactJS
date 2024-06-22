import { motion } from "framer-motion";
import styled from "styled-components";
import { IImages, IWatchProviders } from "./api";

export const categories = {
  movie: {
    NOW_PLAYING: "now_playing",
    TOP_RATED: "top_rated",
    UPCOMING: "upcoming",
  },
  tv: {
    TOP_RATED: "top_rated",
  },
};
export function makeImagePath(id: string, format?: string) {
  return `https://image.tmdb.org/t/p/${format ? format : "original"}/${id}`;
}
/* get Available Providers(OTT) */
export const getProviders = (data: IWatchProviders) => {
  if (data.results) {
    const buys = data.results?.KR?.buy?.map((c) => c.logo_path) || [];
    const flatrates =
      data?.results?.KR?.flatrate?.map((c) => c.logo_path) || [];
    const rents = data?.results?.KR?.rent?.map((c) => c.logo_path) || [];
    const result = [...buys, ...flatrates, ...rents];
    return Array.from(new Set(result));
  }
  return [];
};
export const getStarRating = (vote_average: number) => {
  const rating = vote_average / 2;
  const fullStar = Math.floor(rating);
  let halfStar = rating - fullStar;
  halfStar >= 0.5 ? (halfStar = 1) : (halfStar = 0);
  return [fullStar, halfStar, 5 - fullStar - halfStar];
};
export const getMainLogo = (
  img: IImages | undefined,
  imgUs: IImages | undefined
) => {
  if (img?.logos && img?.logos.length !== 0) {
    return img.logos[0].file_path;
  } else if (imgUs?.logos && imgUs?.logos.length !== 0) {
    return imgUs.logos[0].file_path;
  }
  return "";
};
/* Banner Components */
export const BannerContainer = styled.div<{ $bgPhoto: string }>`
  height: 84vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 60px;
  background-image: linear-gradient(
      rgba(0, 0, 0, 1) 0%,
      rgba(0, 0, 0, 0.5) 10%,
      rgba(0, 0, 0, 0.3),
      ${(props) => props.theme.black.veryDark}
    ),
    url(${(props) => props.$bgPhoto});
  background-size: cover;
  text-shadow: 2px 2px 20px rgba(0, 0, 0, 0.45);
`;
export const BannerDetail = styled.div`
  width: 40%;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;
export const BannerLogo = styled.div`
  width: 100%;
  height: 16vw;
  background-size: contain;
  background-position: center center;
  background-repeat: no-repeat;
  filter: drop-shadow(0px 10px 30px black);
`;
export const BannerTitle = styled.h2`
  font-size: 3.2vw;
  font-weight: 600;
`;
export const BannerOverview = styled.p`
  font-size: 1vw;
  line-height: 1.3;
  font-weight: 500;
`;
export const BannerBtnBox = styled.div`
  display: flex;
  flex-direction: row;
  gap: 10px;
`;
export const BannerBtn1 = styled.div`
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
export const BannerBtn2 = styled(BannerBtn1)`
  background-color: rgba(109, 109, 110, 1);
  color: white;
  fill: white;
`;

/* Shared Components for Router */
export const Wrapper = styled.div`
  background-color: ${(props) => props.theme.black.veryDark};
  overflow-x: hidden;
  overflow-y: hidden;
  padding-bottom: 100px;
`;
export const Loader = styled.div`
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1vw;
`;
export const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  opacity: 0;
`;

/* Shared Components for Slider */
export const SliderContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 300px;
`;
export const SliderTitle = styled.h1`
  font-size: 1.6vw;
  padding-left: 4%;
  padding-bottom: 0.6vw;
`;
export const Slider = styled.div`
  overflow-x: visible;
  width: 100%;
  position: relative;
  bottom: 0px;
`;
export const Row = styled(motion.div)`
  display: flex;
  flex-direction: row;
  gap: 10px;
  width: 124%;
  left: -12%;
  position: absolute;
  :nth-child(2) {
    transform-origin: center left !important;
  }
  :nth-child(7) {
    transform-origin: center right !important;
  }
`;
export const Box = styled(motion.div)<{ $bgPhoto: string }>`
  background-image: url(${(props) => props.$bgPhoto});
  background-position: center center;
  font-size: 40px;
  background-size: cover;
  height: 200px;
  width: calc(100% / 8);
  border-radius: 8px;

  cursor: pointer;
`;
export const Info = styled(motion.div)`
  padding: 10px;
  background-color: ${(props) => props.theme.black.darker};
  opacity: 0;
  position: absolute;
  width: 100%;
  left: 0;
  right: 0;
  bottom: -2.7vw;
  border-radius: 0 0 8px 8px;
  h4 {
    text-align: left;
    font-size: 1vw;
  }
`;
export const InfoBtnContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 5px;
  margin-bottom: 10px;
`;
export const InfoBtn = styled.div`
  border: 2px solid rgba(255, 255, 255, 0.4);
  background-color: rgba(42, 42, 42, 0.6);
  width: 1.2vw;
  height: 1.2vw;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  &:hover {
    background-color: rgba(255, 255, 255, 0.2);
  }
  svg {
    width: 0.7vw;
    height: 0.7vw;
  }
  &:first-child {
    background-color: white;
    &:hover {
      opacity: 0.8;
    }
  }
`;
export const Button = styled.button<{ position: "next" | "prev" }>`
  transform: translateY(-50%);
  height: 200px;
  width: calc(124% / 8 - 8px - 12%);
  background-color: rgba(0, 0, 0, 0.6);
  border: none;
  border-radius: ${(props) =>
    props.position === "next" ? "8px 0 0 8px" : "0 8px 8px 0"};
  cursor: pointer;
  position: absolute;
  top: 100px; // half of Box height
  ${(props) => (props.position === "next" ? "right: 0;" : "left: 0;")}
  display: flex;
  justify-content: center;
  align-items: center;
  svg {
    opacity: 0;
  }
  &:hover {
    background-color: rgba(0, 0, 0, 0.8);
    svg {
      opacity: 1;
    }
  }
`;
export const infoVars = {
  hover: {
    opacity: 1,
    transition: { delay: 0.4, type: "tween", duration: 0.2 },
  },
};
export const boxVars = {
  normal: {
    scale: 1,
    boxShadow: "none",
  },
  hover: {
    scale: 1.3,
    y: -50,
    transition: { delay: 0.4, type: "tween", duration: 0.2 },
    boxShadow: "0px 0px 10px black",
  },
};
export const arrow = { PREV: "prev", NEXT: "next" };

/* Shared Components for Detail */
export const DetailContainer = styled(motion.div)`
  position: absolute;
  width: 50vw;
  min-height: 90vh;
  height: auto;
  left: 0;
  right: 0;
  margin: 0 auto;
  background-color: ${(props) => props.theme.black.darker};
  border-radius: 10px;
  overflow: hidden;
  z-index: 2;
  box-shadow: 0 0 2vw black;
  padding-bottom: 7vw;
`;
export const Cover = styled.div`
  width: 100%;
  height: 49vh;
  background-size: cover;
  background-position: center center;
  position: relative;
`;
export const Logo = styled.div`
  width: 20vw;
  height: 8vw;
  background-size: contain;
  background-position: center center;
  background-repeat: no-repeat;
  position: absolute;
  bottom: 3vw;
  left: 1vw;
`;
export const Details = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 0 30px;
  padding-top: 1vw;
  padding-bottom: 1vw;
  color: ${(props) => props.theme.white.lighter};
`;
export const Detail = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
  width: 60%;
  &:nth-child(2) {
    width: 35%;
    display: flex;
    flex-direction: column;
  }
`;

export const ContentName = styled.h2`
  font-size: 3vw;
  position: absolute;
  bottom: 3vw;
  left: 1vw;
  text-shadow: 0 0 10px black;
`;
export const Tagline = styled.h3`
  font-style: italic;
  font-size: 0.8vw;
`;
export const Overview = styled.p`
  position: relative;
  font-size: 0.7vw;
  line-height: 1.8;
`;
export const SmallDetailR = styled.div`
  justify-content: right;
  font-size: 0.7vw;
`;
export const SmallDetailL = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;
export const SmallBox = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  gap: 0.5vw;
  font-size: 0.8vw;
  color: #bcbcbc;
  align-items: center;
`;
export const Adult = styled.span`
  border: 1px solid gray;
  color: white;
  width: 2.2vw;
  text-align: center;
`;
export const Rating = styled.div`
  display: flex;
  width: 50%;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  svg {
    fill: #ffd900;
    width: 1vw;
  }
`;
export const Companies = styled.div`
  display: flex;
  float: right;
  gap: 5px;
  position: absolute;
  bottom: 3.6vw;
`;
export const Company = styled.div`
  width: 5vw;
  height: 3vw;
  background-size: contain;
  background-position: center center;
  background-repeat: no-repeat;
  background-color: rgba(255, 255, 255, 0.8);
  border-radius: 0.2vw;
`;
export const OTTs = styled.div`
  display: flex;
  flex-direction: row;
  gap: 5px;
  position: absolute;
  bottom: 1vw;
`;
export const OTT = styled.div`
  width: 2.2vw;
  height: 2.2vw;
  background-size: contain;
  background-position: center center;
  background-repeat: no-repeat;
  border-radius: 0.5rem;
`;
export const NoOTT = styled.span`
  position: absolute;
  bottom: 1vw;
  font-size: 1.2vw;
  font-style: italic;
  color: gray;
`;
export const bannerVars = {
  initial: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
  },
  exit: {
    opacity: 0,
  },
};
