import React from "react";
import styled from "styled-components";
import { Link, withRouter } from "react-router-dom";
import layout from "../../config/layout";
import color from "../../config/color";
import "./test.css";

const Head = styled.div`
	width: ${layout.mobile.body.width};
	min-width: ${layout.mobile.body.min_width};
	height: ${layout.mobile.header.height};
	background-color: ${color.mobile.background.header};

	box-sizing: border-box;

	padding: 20px 40px;
`;

const MenuBar = styled.div`
	width: 100%;
	height: 100%;

	display: grid;
	grid-template-columns: repeat(3, calc(100% / 3));
	grid-template-rows: 100%;
	align-content: center;
	justify-items: center;

	border: 1px solid black;
	border-radius: 10px;
`;

const Menu = styled(Link)`
	display: flex;
	width: 100%;
	height: 100%;
	border-right: 1px solid black;
	box-sizing: border-box;
	&:first-child {
		border-top-left-radius: 10px;
		border-bottom-left-radius: 10px;
	}
	&:last-child {
		border-top-right-radius: 10px;
		border-bottom-right-radius: 10px;
		border-right: none;
	}
	justify-content: center;
	flex-direction: column;
	text-align: center;
	background-color: ${(props) => (props.selected ? "black" : "white")};
	color: ${(props) => (props.selected ? "white" : "black")};
	transition: background-color 0.5s ease-in-out;
`;

const Header = (props) => {
	return (
		<Head className="test">
			<MenuBar>
				<Menu to="/reservation" selected={props.location.pathname === "/reservation"}>
					예약 조회
				</Menu>
				<Menu to="/schedule" selected={props.location.pathname === "/schedule"}>
					스케줄 조회
				</Menu>
				<Menu to="/result" selected={props.location.pathname === "/result"}>
					결과 관리
				</Menu>
			</MenuBar>
		</Head>
	);
};

export default withRouter(Header);
