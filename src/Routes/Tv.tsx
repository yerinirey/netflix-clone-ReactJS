import { useQuery } from "@tanstack/react-query";
import { IGetTvResult, ITv, getTopRatedTv } from "../api";
import styled from "styled-components";
import TvBanner from "../Components/TvBanner";
import { categories } from "../utils";
import { useEffect, useState } from "react";
import TvSlider from "../Components/TvSlider";
import { AnimatePresence, motion, useScroll } from "framer-motion";
import { PathMatch, useMatch, useNavigate } from "react-router-dom";
import TvDetail from "../Components/TvDetail";

const Wrapper = styled.div`
  background-color: ${(props) => props.theme.black.veryDark};
  overflow-x: hidden;
  overflow-y: hidden;
  padding-bottom: 100px;
`;
const Loader = styled.div`
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1vw;
`;
const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  opacity: 0;
`;

function Tv() {
  const { data: topData, isLoading: topLoading } = useQuery<IGetTvResult>({
    queryKey: ["tv", "top_rated"],
    queryFn: getTopRatedTv,
  });
  const { scrollY } = useScroll();
  const [category, setCategory] = useState<string>();
  const [allTvs, setAllTvs] = useState<ITv[]>();
  const onClick = (clickedCategory: string) => setCategory(clickedCategory);
  const [width, setWidth] = useState(window.innerWidth * 1.24 * (6 / 8));
  const detailTvMatch: PathMatch<string> | null = useMatch("/tv/:tvId");
  const clickedTv =
    (detailTvMatch?.params.tvId &&
      allTvs?.find((tv) => tv.id + "" === detailTvMatch.params.tvId)) ??
    topData?.results[0];
  const navigate = useNavigate();
  const onOverlayClick = () => {
    navigate("/tv");
  };
  useEffect(() => {
    window.addEventListener("resize", () =>
      setWidth(window.innerWidth * 1.24 * (6 / 8))
    );
    return () =>
      window.removeEventListener("resize", () =>
        setWidth(window.innerWidth * 1.24 * (6 / 8))
      );
  }, [window.innerWidth]);
  const loading = topLoading;
  useEffect(() => {
    if (topData) {
      console.log("succeed fetching all tvs");
      setAllTvs([...topData?.results.filter((_, idx) => idx !== 0)]);
    }
  }, [topData]);

  return (
    <Wrapper>
      {loading ? (
        <Loader />
      ) : (
        <>
          <div onClick={() => onClick(categories.tv.TOP_RATED)}>
            <TvBanner />
          </div>
          <div onClick={() => onClick(categories.tv.TOP_RATED)}>
            <TvSlider
              category={categories.tv.TOP_RATED}
              title="TOP20"
              width={width}
            />
          </div>
          <AnimatePresence>
            {detailTvMatch && (
              <>
                <Overlay
                  onClick={onOverlayClick}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                />
                {clickedTv && (
                  <TvDetail
                    $isBanner={clickedTv.id === topData?.results[0].id}
                    height={scrollY.get()}
                    tv={clickedTv}
                    category={category}
                  />
                )}
              </>
            )}
          </AnimatePresence>
        </>
      )}
    </Wrapper>
  );
}

export default Tv;
