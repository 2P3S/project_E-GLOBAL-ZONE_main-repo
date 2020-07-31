import React from "react";
import styled from "styled-components";
const List = styled.div`
	width: 100%;
	padding: 10px;
	box-sizing: border-box;
`;
const ItemContainer = styled.div`
	width: 100%;
	height: 80px;
	display: grid;
	grid-template-columns: 65% 35%;
	grid-template-rows: repeat(4, calc(100% / 4));
	grid-template-areas: ". status" "info status" "time status" ". status";

	border-radius: 10px;
	margin-bottom: 5px;

	border: 1px solid black;

	background-color: ${(props) => props.bgc};
	color: #fff;
	font-weight: bold;
`;

const Status = styled.div`
	grid-area: status;

	text-align: center;
	align-self: center;
`;
const DeleteBtn = styled.div`
	/* width: 80px; */
	/* height: 60px; */
	display: inline;
	margin-left: 30px;
	color: red;

	/* background-color: rgba(0, 0, 0, 0.1); */
`;
const Infomation = styled.div`
	grid-area: info;
	margin-left: 30px;
	align-self: center;
`;
const TimeStamp = styled.div`
	grid-area: time;
	margin-left: 30px;
	align-self: center;
`;

const Item = ({ element }) => {
	const { status, language, foreign_name, start_time, end_time } = element;
	console.log(status, language, foreign_name, start_time, end_time);
	const convertedLanguage =
		language === "English" ? "영어" : language === "Chinese" ? "중국어" : "일본어";
	const colorCode =
		language === "English" ? "#6061b3" : language === "Chinese" ? "#82abf7" : "#f59c9f";
	return (
		<ItemContainer bgc={colorCode} id={element.id}>
			<Infomation>{`[${convertedLanguage}] ${foreign_name}`}</Infomation>
			<TimeStamp>{`${start_time} ~ ${end_time}`}</TimeStamp>
			<Status>
				{status}
				{status === "출석인증 완료" ? "" : <DeleteBtn>X</DeleteBtn>}
			</Status>
		</ItemContainer>
	);
};

export default function ReservationList({ list }) {
	console.log(list);
	return (
		<List>
			{list.map((element) => {
				return <Item element={element} key={element.id} />;
			})}
		</List>
	);
}
