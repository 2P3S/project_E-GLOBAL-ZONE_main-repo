import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import styled from "styled-components";
import layout from "../../config/layout";
import "react-calendar/dist/Calendar.css";

const CalendarContainer = styled.div`
	width: ${layout.mobile.body.width};
	box-sizing: border-box;
	padding: 10px;
`;

export default function CalendarSmall() {
	const [selectDate, setSelectDate] = useState(new Date());
	useEffect(() => {}, [selectDate]);
	return (
		<CalendarContainer>
			<Calendar value={selectDate} onChange={setSelectDate} />
		</CalendarContainer>
	);
}
