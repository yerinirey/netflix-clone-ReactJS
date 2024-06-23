import styled from "styled-components";
import {
  motion,
  useAnimation,
  useMotionValueEvent,
  useScroll,
} from "framer-motion";
import { Link, useMatch, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useForm } from "react-hook-form";

const Nav = styled(motion.nav)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: fixed;
  width: 100%;
  height: 68px;
  top: 0;
  font-size: 14px;
  font-weight: 500;
  color: white;
  padding: 0 60px;
  z-index: 1;
`;
const Col = styled.div`
  display: flex;
  align-items: center;
`;
const LogoBox = styled(motion.div)`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin-right: 60px;
  gap: 6px;
  cursor: pointer;
  span {
    display: inline-block;
    font-size: 28px;
    font-weight: bolder;
    font-style: oblique;
  }
`;
const Logo = styled.svg`
  width: 30px;
  height: 30px;
  fill: ${(props) => props.theme.red};
`;
const Items = styled.ul`
  display: flex;
  align-items: center;
`;
const Item = styled.li`
  margin-right: 20px;
  color: ${(props) => props.theme.white.lighter};
  position: relative;
  &:hover {
    /* cursor: pointer; */
    color: ${(props) => props.theme.white.darker};
  }
  display: flex;
  justify-content: center;
  flex-direction: column;
`;
const Circle = styled(motion.span)`
  position: absolute;
  width: 5px;
  height: 5px;
  border-radius: 2.5px;
  bottom: -12px;
  left: 0;
  right: 0;
  margin: 0 auto;
  background-color: ${(props) => props.theme.red};
`;

const Search = styled.form`
  color: white;
  display: flex;
  align-items: center;
  position: relative;
  svg {
    height: 25px;
  }
`;
const Input = styled(motion.input)`
  z-index: -1;
  transform-origin: right center;
  position: absolute;
  left: -250px;
  background-color: rgba(0, 0, 0, 0.9);
  padding-left: 40px;
  width: 275px;
  height: 36px;
  border: 1px solid white;
  color: white;
`;
const logoVars = {
  normal: {
    rotateZ: 0,
    scale: 1,
  },
  active: {
    scale: [1, 1.2, 1],
    rotateZ: [3, -3, 3],
    transition: {
      repeat: Infinity,
    },
  },
};

const navVars = {
  top: {
    backgroundColor: "rgba(0,0,0,0)",
  },
  scroll: { backgroundColor: "#141414" },
};

interface IForm {
  keyword: string;
}
function Header() {
  const [searchOpen, setSearchOpen] = useState(false);
  const homeMatch = useMatch("/");
  const tvMatch = useMatch("/tv");
  const inputAnimation = useAnimation();
  const navAnimation = useAnimation();
  const { scrollY } = useScroll();
  const toggleSearch = () => {
    // console.log("clicked");
    if (searchOpen) {
      // trigger the close animation
      inputAnimation.start({
        scaleX: 0,
      });
    } else {
      // trigger the open animation
      inputAnimation.start({
        scaleX: 1,
      });
    }
    setSearchOpen((p) => !p);
  };
  useMotionValueEvent(scrollY, "change", (v) => {
    if (v > 80) {
      navAnimation.start("scroll");
    } else {
      navAnimation.start("top");
    }
  });
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm<IForm>();
  const onValid = (data: IForm) => {
    console.log(data.keyword);
    navigate(`/search?keyword=${data.keyword}`);
  };
  return (
    <Nav variants={navVars} animate={navAnimation} initial={"top"}>
      <Col>
        <LogoBox
          onClick={() => navigate("/")}
          variants={logoVars}
          initial="normal"
          whileHover="active"
        >
          <Logo
            xmlns="http://www.w3.org/2000/svg"
            width="1024"
            height="276.742"
            viewBox="0 0 576 512"
          >
            <path d="M320 192h17.1c22.1 38.3 63.5 64 110.9 64c11 0 21.8-1.4 32-4v4 32V480c0 17.7-14.3 32-32 32s-32-14.3-32-32V339.2L280 448h56c17.7 0 32 14.3 32 32s-14.3 32-32 32H192c-53 0-96-43-96-96V192.5c0-16.1-12-29.8-28-31.8l-7.9-1c-17.5-2.2-30-18.2-27.8-35.7s18.2-30 35.7-27.8l7.9 1c48 6 84.1 46.8 84.1 95.3v85.3c34.4-51.7 93.2-85.8 160-85.8zm160 26.5v0c-10 3.5-20.8 5.5-32 5.5c-28.4 0-54-12.4-71.6-32h0c-3.7-4.1-7-8.5-9.9-13.2C357.3 164 352 146.6 352 128v0V32 12 10.7C352 4.8 356.7 .1 362.6 0h.2c3.3 0 6.4 1.6 8.4 4.2l0 .1L384 21.3l27.2 36.3L416 64h64l4.8-6.4L512 21.3 524.8 4.3l0-.1c2-2.6 5.1-4.2 8.4-4.2h.2C539.3 .1 544 4.8 544 10.7V12 32v96c0 17.3-4.6 33.6-12.6 47.6c-11.3 19.8-29.6 35.2-51.4 42.9zM432 128a16 16 0 1 0 -32 0 16 16 0 1 0 32 0zm48 16a16 16 0 1 0 0-32 16 16 0 1 0 0 32z" />
          </Logo>
          <span>MEOWVIES</span>
        </LogoBox>
        <Items>
          <Item>
            <Link to="/">홈{homeMatch && <Circle layoutId="circle" />}</Link>
          </Item>
          <Item>
            <Link to="/tv">
              TV
              {tvMatch && <Circle layoutId="circle" />}{" "}
            </Link>
          </Item>
        </Items>
      </Col>
      <Col>
        <Search onSubmit={handleSubmit(onValid)}>
          <motion.svg
            onClick={toggleSearch}
            animate={{ x: searchOpen ? -244 : 0 }}
            whileTap={{ scale: 1.3 }}
            transition={{ type: "linear" }}
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
              clipRule="evenodd"
            ></path>
          </motion.svg>
          <Input
            {...register("keyword", { required: true, minLength: 2 })}
            animate={inputAnimation}
            initial={{ scaleX: 0 }}
            // animate={{ scaleX: searchOpen ? 1 : 0 }}
            transition={{ type: "linear" }}
            placeholder="Search for movie or TV..."
          />
        </Search>
      </Col>
    </Nav>
  );
}

export default Header;
