import React, { useEffect, useState } from "react";
import Calendar from "../../../../components/mobile/Calendar";
import List from "../../../../components/mobile/List";

import { useDispatch, useSelector } from "react-redux";
import { selectSelectDate } from "../../../../redux/confSlice/confSlice";

import conf from "../../../../conf/conf";
import { selectUser } from "../../../../redux/userSlice/userSlice";
import { getKoreanReservation } from "../../../../api/korean/reservation";

/**
 * Korean :: 예약 조회
 * @returns {JSX.Element}
 * @constructor
 */
export default function Reservation() {
	const dispatch = useDispatch();
	const selectDate = useSelector(selectSelectDate);
	const user = useSelector(selectUser);

	const [data, setData] = useState();

	useEffect(() => {
		getKoreanReservation(selectDate).then((res) => {
			setData(res.data);
		});
	}, [selectDate]);

	return (
		<>
			<Calendar />
			{typeof data === "object" && data.hasOwnProperty("data") ? (
				<List data={data} />
			) : (
				<p className="reserv_info">신청 된 예약이 없습니다.</p>
			)}
		</>
	);
}
// {
// 	language: "Japanese",
// 		name: "이재원",
// 	time: ["시작시간", "종료시간"],
// 	status: "done",
// },
