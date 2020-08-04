import React from "react";

// English -> .box puple
// Japanese -> .box blue
// China -> .box pink

/**
 * status
 * 출석인증 완료 : confirm
 * 출석인증 대기 : done
 * 예약 대기 : pending
 * 예약 완료 : reserved
 * 미참석 : nonattendance
 */
const CONFIRM = "출석인증 완료";
const DONE = "출석인증 대기";
const PENDING = "예약 대기";
const RESERVED = "예약 완료";
const NON_ATTENDANCE = "미참석";

export default function Item({ language, name, time, status }) {
	const setStatus = (status) => {
		switch (status) {
			case "confirm":
				return CONFIRM;
			case "done":
				return DONE;
			case "pending":
				return PENDING;
			case "reserved":
				return RESERVED;
			case "nonattendance":
				return NON_ATTENDANCE;
			default:
				break;
		}
	};
	const scheduleInfo = {
		class:
			language === "English"
				? "box puple"
				: language === "Japanese"
				? "box blue"
				: "box pink",
		language:
			language === "English" ? "[영어]" : language === "Japanese" ? "[일본어]" : "[중국어]",
		name,
		time,
		status: setStatus(status),
	};
	console.log(scheduleInfo.status);
	return (
		<>
			<div className={scheduleInfo.class}>
				<ul>
					<li>{`${scheduleInfo.language} ${scheduleInfo.name}`}</li>
					<li className="eng">{scheduleInfo.time.map((e) => e)} </li>
				</ul>
				{/* {((status) => {
					if (status !== "done" && status !== "confirm") {
						return (
							<a href="#">
								<img src="/img/cancel_btn.png" alt="삭제 버튼" />
							</a>
						);
					}
				})(status)}
				<span>{`${scheduleInfo.status}`}</span> */}
			</div>
			{/* <div className="box puple">
				<ul>
					<li>[영어] 쉬라이 알리오트시나</li>
					<li className="eng">AM 09:00 ~ PM 01:00 </li>
				</ul>
				<span>출석인증 대기</span>
			</div>
			<div className="box blue">
				<ul>
					<li>[영어] 쉬라이 알리오트시나</li>
					<li className="eng">AM 09:00 ~ PM 01:00 </li>
				</ul>
				<a href="#">
					<img src="/img/cancel_btn.png" alt="삭제 버튼" />
				</a>
				<span>예약 대기</span>
			</div>
			<div className="box pink">
				<ul>
					<li>[영어] 쉬라이 알리오트시나</li>
					<li className="eng">AM 09:00 ~ PM 01:00 </li>
				</ul>
				<a href="#">
					<img src="/img/cancel_btn.png" alt="삭제 버튼" />
				</a>
				<span>예약 완료</span>
			</div>
			<div className="box pink">
				<ul>
					<li>[영어] 쉬라이 알리오트시나</li>
					<li className="eng">AM 09:00 ~ PM 01:00 </li>
				</ul>
				<a href="#">
					<img src="/img/cancel_btn.png" alt="삭제 버튼" />
				</a>
				<span>미참석</span>
			</div> */}
		</>
	);
}
