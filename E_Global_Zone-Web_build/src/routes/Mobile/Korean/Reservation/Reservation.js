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
			<div className="mtab">
				<ul className="no3">
					<li>
						<a href="student_reservation_type2.php" className="on">
							예약 조회
						</a>
					</li>
					<li>
						<a href="student_schedule.php">스케줄 조회</a>
					</li>
					<li>
						<a href="student_result.php">결과 관리</a>
					</li>
				</ul>
			</div>

			<div className="wrap bg">
				<div className="reserv_status">
					<p className="tit">실시간 예약 현황</p>
					<ul>
						<li className="yellow">
							<span>3</span>예약 대기
						</li>
						<li>
							<span>7</span>예약 완료
						</li>
						<li>
							<span>4</span>결과 대기
						</li>
					</ul>
				</div>
				<div className="reserv_list">
					<p className="tit">예약 관리</p>
					<ui className="mainMenu">
						<li className="item status01" id="wait_reservation">
							<a href="#wait_reservation" className="btn">
								<span>예약 대기</span>
							</a>
							<div className="subMenu">
								<div>
									<p className="left">
										[영어]T구글구글리<span>12:30:00 ~ 12:50:00</span>
									</p>
									<p className="right">예약대기</p>
								</div>
								<div>
									<p className="left">
										[영어]T구글구글리<span>12:30:00 ~ 12:50:00</span>
									</p>
									<p className="right">예약대기</p>
								</div>
							</div>
						</li>
						<li className="item status02" id="reservation_complete">
							<a href="#reservation_complete" className="btn">
								<span>예약 완료</span>
							</a>
							<div className="subMenu">
								<div>
									<p className="left">
										[영어]T구글구글리<span>12:30:00 ~ 12:50:00</span>
									</p>
									<p className="right zoom_info">접속정보</p>
								</div>
								<div>
									<p className="left">
										[영어]T구글구글리<span>12:30:00 ~ 12:50:00</span>
									</p>
									<p className="right zoom_info">접속정보</p>
								</div>
							</div>
						</li>
						<li className="item status03" id="progress_complete">
							<a href="#progress_complete" className="btn">
								<span>결과 대기</span>
							</a>
							<div className="subMenu">
								<div>
									<p className="left">
										[영어]T구글구글리<span>12:30:00 ~ 12:50:00</span>
									</p>
									<p className="right">예약대기</p>
								</div>
								<div>
									<p className="left">
										[영어]T구글구글리<span>12:30:00 ~ 12:50:00</span>
									</p>
									<p className="right">예약대기</p>
								</div>
							</div>
						</li>
					</ui>
				</div>
			</div>
		</>
	);
}
// {
// 	language: "Japanese",
// 		name: "이재원",
// 	time: ["시작시간", "종료시간"],
// 	status: "done",
// },
