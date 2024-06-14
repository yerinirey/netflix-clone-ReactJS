import { useQuery } from "@tanstack/react-query";
import { IGetTvResult, getTopRatedTv } from "../api";
import styled from "styled-components";

const Wrapper = styled.div`
  background-color: ${(props) => props.theme.black.veryDark};
  overflow-x: hidden;
  padding-bottom: 100px;
`;
const Loader = styled.div`
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1vw;
`;

function Tv() {
  const { data: topData, isLoading: topLoading } = useQuery<IGetTvResult>({
    queryKey: ["tv", "topRated"],
    queryFn: getTopRatedTv,
  });
  console.log(topData);
  const loading = topLoading;
  return <Wrapper>{loading ? <Loader /> : null}</Wrapper>;
}

export default Tv;
