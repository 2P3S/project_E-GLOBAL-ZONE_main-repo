import React from "react";
import Item from "./Item";
/**
 *  Item's props
 * language
 * foreignName
 * startTime
 * endTime
 * status => 출석 인증 완료, 출석 인증 대기, 예약 대기, 예약 완료, 미참석
 */

const mockup = [
	{
		language: "English",
		name: "이재원",
		time: ["시작시간", "종료시간"],
		status: "reserved",
	},
	{
		language: "Japanese",
		name: "이재원",
		time: ["시작시간", "종료시간"],
		status: "done",
	},
	{
		language: "China",
		name: "이재원",
		time: ["시작시간", "종료시간"],
		status: "reserved",
	},
	{
		language: "English",
		name: "이재원",
		time: ["시작시간", "종료시간"],
		status: "done",
	},
];
export default function List() {
	return (
		<div className="reservation_boxs">
			{mockup.map((item) => (
				<Item
					language={item.language}
					name={item.name}
					time={item.time}
					status={item.status}
				/>
			))}
			{/* <Item language="English" name="이름자리" time={["09:00", "13:00"]} status="done" />
			<Item language="English" name="이름자리" time={["09:00", "13:00"]} status="pending" />
			<Item language="English" name="이름자리" time={["09:00", "13:00"]} status="confirm" />
			<Item language="English" name="이름자리" time={["09:00", "13:00"]} status="done" /> */}
		</div>
	);
}
