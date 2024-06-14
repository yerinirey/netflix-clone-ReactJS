import { motion } from "framer-motion";
import styled from "styled-components";
import {
  IGetEpisodes,
  IImages,
  ITv,
  ITvDetail,
  IWatchProviders,
  getTvDetail,
  getTvEpisodes,
  getTvImages,
  getTvImagesUs,
  getWatchProvidersForTv,
} from "../api";
import { makeImagePath } from "../utils";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

const Container = styled(motion.div)`
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
const Cover = styled.div`
  width: 100%;
  height: 49vh;
  background-size: cover;
  background-position: center center;
`;
const Details = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 0 30px;
  padding-top: 1vw;
  padding-bottom: 1vw;
  color: ${(props) => props.theme.white.lighter};
`;
const Detail = styled.div`
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
const Episodes = styled.div`
  padding: 0 30px;
  margin-top: 2vw;
  h2 {
    font-size: 1.2vw;
  }
`;
const Logo = styled.div`
  width: 20vw;
  height: 8vw;
  background-size: contain;
  background-position: center center;
  background-repeat: no-repeat;
  position: absolute;
  top: 12vw;
`;
const Title = styled.h2`
  font-size: 3vw;
  position: absolute;
  top: 35%;
  text-shadow: 0 0 5px black;
`;
const Tagline = styled.h3`
  font-style: italic;
  font-size: 0.8vw;
`;
const Overview = styled.p`
  position: relative;
  font-size: 0.7vw;
  line-height: 1.8;
`;
const SmallDetailR = styled.div`
  justify-content: right;
  font-size: 0.7vw;
`;
const SmallDetailL = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;
const SmallBox = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  gap: 0.5vw;
  font-size: 0.8vw;
  color: #bcbcbc;
  align-items: center;
`;
const Adult = styled.span`
  border: 1px solid gray;
  color: white;
  width: 2.2vw;
  text-align: center;
`;
const Rating = styled.div`
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
const Companies = styled.div`
  display: flex;
  float: right;
  gap: 5px;
  position: absolute;
  bottom: 3.6vw;
`;
const Company = styled.div`
  width: 5vw;
  height: 3vw;
  background-size: contain;
  background-position: center center;
  background-repeat: no-repeat;
  background-color: rgba(255, 255, 255, 0.8);
  border-radius: 0.2vw;
`;
const OTTs = styled.div`
  display: flex;
  flex-direction: row;
  gap: 5px;
  position: absolute;
  bottom: 1vw;
`;
const OTT = styled.div`
  width: 2.2vw;
  height: 2.2vw;
  background-size: contain;
  background-position: center center;
  background-repeat: no-repeat;
  border-radius: 0.5rem;
`;
const NoOTT = styled.span`
  position: absolute;
  bottom: 1vw;
  font-size: 1.2vw;
  font-style: italic;
  color: gray;
`;
const EpisodeHeader = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 0.5vw;
`;
const Episode = styled.div`
  height: 6vw;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: 0 30px;
  gap: 0.5vw;
  border-radius: 0.3rem;
  border-bottom: 1px solid ${(props) => props.theme.black.lighter};
  h1 {
    font-size: 1.2vw;
    padding-right: 0.5vw;
  }
  h2 {
    font-weight: 600;
    font-size: 0.8vw;
  }
  h3 {
    font-size: 0.6vw;
  }
  &:hover {
    background-color: rgba(255, 255, 255, 0.2);
  }
`;
const EpisodeImg = styled.div`
  height: 4.6vw;
  width: 7.5vw;
  background-size: cover;
  background-position: center center;
  border-radius: 0.3rem;
`;
const EpisodeDetail = styled.div`
  display: flex;
  flex-direction: column;
  width: 80%;
`;
const SelectSeason = styled.select`
  background-color: ${(props) => props.theme.black.lighter};
  padding: 0.5vw 1vw;
  color: white;
`;

interface IDetail {
  tv: ITv;
  category?: string;
  height: number;
  $isBanner: boolean;
}
const bannerVars = {
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

export default function TvDetail({ tv, category, height, $isBanner }: IDetail) {
  const [seasonNumber, setSeasonNumber] = useState(1);
  const tvId = tv.id;
  const { data, isLoading } = useQuery<ITvDetail>({
    queryKey: ["tv", tvId + ""],
    queryFn: () => getTvDetail(tvId + ""),
  });
  const { data: img, isLoading: imgLoading } = useQuery<IImages>({
    queryKey: ["tv", tvId + "", "images"],
    queryFn: () => getTvImages(tvId + ""),
  });
  const { data: imgUs, isLoading: imgUsLoading } = useQuery<IImages>({
    queryKey: ["tv", tvId + "", "images_us"],
    queryFn: () => getTvImagesUs(tvId + ""),
  });
  const { data: providerData, isLoading: providerLoading } =
    useQuery<IWatchProviders>({
      queryKey: ["tv", tvId + "", "watch_providers"],
      queryFn: () => getWatchProvidersForTv(tvId + ""),
    });
  const { data: episodes } = useQuery<IGetEpisodes>({
    queryKey: ["tv", tvId + "", seasonNumber],
    queryFn: () => getTvEpisodes(tvId + "", seasonNumber + ""),
  });
  const handleSeasonChange = (event: any) => {
    setSeasonNumber(event.target.value);
  };
  console.log(data);
  const [stars, setStars] = useState<[number, number, number]>();
  const [providers, setProviders] = useState<string[]>();
  const [logo, setLogo] = useState<string>("");
  useEffect(() => {
    if (data?.vote_average) {
      const rating = data.vote_average / 2;
      const fullStar = Math.floor(rating);
      let halfStar = rating - fullStar;
      halfStar >= 0.5 ? (halfStar = 1) : (halfStar = 0);
      setStars([fullStar, halfStar, 5 - fullStar - halfStar]);
    }
    if (img?.logos && img?.logos.length !== 0) {
      setLogo(img.logos[0].file_path);
    } else if (imgUs?.logos && imgUs?.logos.length !== 0) {
      setLogo(imgUs.logos[0].file_path);
    }
    if (providerData && providerData?.results?.KR) {
      const buys =
        providerData?.results?.KR?.buy?.map((c) => c.logo_path) || [];
      const flatrates =
        providerData?.results?.KR?.flatrate?.map((c) => c.logo_path) || [];
      const rents =
        providerData?.results?.KR?.rent?.map((c) => c.logo_path) || [];
      const result = [...buys, ...flatrates, ...rents];
      setProviders(result);
    }
  }, [data?.vote_average, img?.logos, providerData?.results?.KR]);
  return (
    <Container
      layoutId={$isBanner ? "banner" : tv.id + category!}
      style={{ top: height + 32 }}
      variants={$isBanner ? bannerVars : undefined}
      initial={$isBanner ? "initial" : undefined}
      animate={$isBanner ? "visible" : undefined}
      exit={$isBanner ? "exit" : undefined}
    >
      {!isLoading && (
        <>
          <Cover
            style={{
              backgroundImage: `linear-gradient(transparent 50%, #181818 100%),
                          url(${makeImagePath(
                            tv.backdrop_path ?? tv.poster_path
                          )})`,
            }}
          />
          <Details>
            <Detail>
              {logo !== "" ? (
                <Logo
                  style={{
                    backgroundImage: `url(${makeImagePath(logo)})`,
                  }}
                />
              ) : (
                <Title>{tv.name}</Title>
              )}

              <SmallDetailL>
                <SmallBox>
                  <Adult>{data?.adult ? "19+" : "12+"}</Adult>
                  <span>{`${data?.first_air_date.split("-")[0]}-${
                    data?.last_air_date.split("-")[0]
                  }, ${data?.status} · ${
                    data?.number_of_seasons
                  }개 시즌`}</span>
                </SmallBox>
                {stars && (
                  <Rating>
                    {Array.from({ length: stars[0] }).map((_, idx) => (
                      <svg
                        key={idx}
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 576 512"
                      >
                        <path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z" />
                      </svg>
                    ))}
                    {Array.from({ length: stars[1] }).map((_, idx) => (
                      <svg
                        key={idx}
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 576 512"
                      >
                        <path d="M288 376.4l.1-.1 26.4 14.1 85.2 45.5-16.5-97.6-4.8-28.7 20.7-20.5 70.1-69.3-96.1-14.2-29.3-4.3-12.9-26.6L288.1 86.9l-.1 .3V376.4zm175.1 98.3c2 12-3 24.2-12.9 31.3s-23 8-33.8 2.3L288.1 439.8 159.8 508.3C149 514 135.9 513.1 126 506s-14.9-19.3-12.9-31.3L137.8 329 33.6 225.9c-8.6-8.5-11.7-21.2-7.9-32.7s13.7-19.9 25.7-21.7L195 150.3 259.4 18c5.4-11 16.5-18 28.8-18s23.4 7 28.8 18l64.3 132.3 143.6 21.2c12 1.8 22 10.2 25.7 21.7s.7 24.2-7.9 32.7L438.5 329l24.6 145.7z" />
                      </svg>
                    ))}
                    {Array.from({ length: stars[2] }).map((_, idx) => (
                      <svg
                        key={idx}
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 576 512"
                      >
                        <path d="M287.9 0c9.2 0 17.6 5.2 21.6 13.5l68.6 141.3 153.2 22.6c9 1.3 16.5 7.6 19.3 16.3s.5 18.1-5.9 24.5L433.6 328.4l26.2 155.6c1.5 9-2.2 18.1-9.7 23.5s-17.3 6-25.3 1.7l-137-73.2L151 509.1c-8.1 4.3-17.9 3.7-25.3-1.7s-11.2-14.5-9.7-23.5l26.2-155.6L31.1 218.2c-6.5-6.4-8.7-15.9-5.9-24.5s10.3-14.9 19.3-16.3l153.2-22.6L266.3 13.5C270.4 5.2 278.7 0 287.9 0zm0 79L235.4 187.2c-3.5 7.1-10.2 12.1-18.1 13.3L99 217.9 184.9 303c5.5 5.5 8.1 13.3 6.8 21L171.4 443.7l105.2-56.2c7.1-3.8 15.6-3.8 22.6 0l105.2 56.2L384.2 324.1c-1.3-7.7 1.2-15.5 6.8-21l85.9-85.1L358.6 200.5c-7.8-1.2-14.6-6.1-18.1-13.3L287.9 79z" />
                      </svg>
                    ))}
                  </Rating>
                )}
              </SmallDetailL>
              <Tagline>{data?.tagline && `❝${data.tagline}❞`}</Tagline>
              <Overview>{tv.overview}</Overview>
            </Detail>
            <Detail>
              {data?.genres && (
                <SmallDetailR>
                  <span style={{ color: "gray" }}>장르: </span>
                  {data?.genres.map(
                    (genre, idx) =>
                      `${genre.name}${idx < data.genres.length - 1 ? "," : ""}`
                  )}
                </SmallDetailR>
              )}
              {data?.created_by.length !== 0 && (
                <SmallDetailR>
                  <span style={{ color: "gray" }}>제작: </span>
                  {data?.created_by.map(
                    (member, idx) =>
                      `${member.name}${
                        idx < data.created_by.length - 1 ? "," : ""
                      }`
                  )}
                </SmallDetailR>
              )}
            </Detail>
            <>
              {data?.production_companies && (
                <Companies>
                  {data.production_companies.map(
                    (company, idx) =>
                      company.logo_path && (
                        <Company
                          key={idx}
                          style={{
                            backgroundImage: `url(${makeImagePath(
                              data?.production_companies[idx].logo_path!
                            )})`,
                          }}
                        ></Company>
                      )
                  )}
                </Companies>
              )}
              {providers && providers.length !== 0 ? (
                <OTTs>
                  {providers.map((provider, idx) => (
                    <OTT
                      key={idx}
                      style={{
                        backgroundImage: `url(${makeImagePath(provider)})`,
                      }}
                    ></OTT>
                  ))}
                </OTTs>
              ) : (
                <NoOTT>No OTT Provided Yet</NoOTT>
              )}
            </>
          </Details>
          <Episodes>
            <EpisodeHeader>
              <h2>회차</h2>
              <SelectSeason onChange={handleSeasonChange} value={seasonNumber}>
                {data?.seasons.map((season) => (
                  <option
                    key={season.season_number}
                    value={season.season_number}
                  >
                    {season.name}
                  </option>
                ))}
              </SelectSeason>
            </EpisodeHeader>
            <div>{episodes?.name}:</div>
            {episodes &&
              episodes.episodes.length > 0 &&
              episodes.episodes.map((episode) => (
                <Episode key={episode.id}>
                  <h1>{episode.episode_number}</h1>
                  <EpisodeImg
                    style={{
                      backgroundImage: `url(${makeImagePath(
                        episode.still_path
                      )})`,
                    }}
                  />
                  <EpisodeDetail>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                        marginBottom: "0.3vw",
                      }}
                    >
                      <h2>{episode.name}</h2>
                      <h2>{episode.runtime}분</h2>
                    </div>
                    <h3
                      style={{
                        paddingRight: "2vw",
                      }}
                    >
                      {episode.overview}
                    </h3>
                  </EpisodeDetail>
                </Episode>
              ))}
          </Episodes>
        </>
      )}
    </Container>
  );
}
