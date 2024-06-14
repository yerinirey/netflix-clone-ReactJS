import styled from "styled-components";

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
export const Logo = styled.div`
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
