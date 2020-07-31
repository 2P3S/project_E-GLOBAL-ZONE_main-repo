import React from "react";
import MobileTemplate from "../../components/mobile/MobileTemplate";
import CalendarSmall from "../../components/common/CalendarSmall";
import ReservationList from "../../components/common/ReservationList";

let array = [
	{
		id: 0,
		status: "출석인증 완료",
		language: "English",
		foreign_name: "쉬라이 알리오르시나",
		start_time: "오전 09:00",
		end_time: "오후 01:00",
	},
	{
		id: 1,
		status: "출석인증 완료",
		language: "English",
		foreign_name: "차이코프스키",
		start_time: "오전 09:00",
		end_time: "오후 01:00",
	},
	{
		id: 2,
		status: "예약 대기",
		language: "Chinese",
		foreign_name: "따자하오",
		start_time: "오전 09:00",
		end_time: "오후 01:00",
	},
	{
		id: 3,
		status: "예약 대기",
		language: "Chinese",
		foreign_name: "칭따오",
		start_time: "오전 09:00",
		end_time: "오후 01:00",
	},
	{
		id: 4,
		status: "미참석",
		language: "Japanese",
		foreign_name: "하나비 키라키라",
		start_time: "오전 09:00",
		end_time: "오후 01:00",
	},
	{
		id: 5,
		status: "미참석",
		language: "Japanese",
		foreign_name: "나까가 빼꼬뺴꼬",
		start_time: "오전 09:00",
		end_time: "오후 01:00",
	},
];

export default function Reservation() {
	return (
		<MobileTemplate
			content={
				<>
					<CalendarSmall />
					<ReservationList list={array} />
				</>
			}
		/>
	);
}
