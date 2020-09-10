import React, { useEffect, useState } from "react";
import moment from "moment";

import Loader from "../../../../components/common/Loader";

import { useDispatch, useSelector } from "react-redux";
import { selectSelectDate, selectToday } from "../../../../redux/confSlice/confSlice";

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
	const today = useSelector(selectToday);

	const [data, setData] = useState();
	const [pending, setPending] = useState(false);
	const [dataSet, setDataSet] = useState({
		arrayOfWatingForPermission: [],
		arrayOfPermission: [],
		arrayOfWatingForResult: [],
	});

	useEffect(() => {
		setPending(true);
	}, []);
	useEffect(() => {
		pending &&
			getKoreanReservation().then((res) => {
				setData(res.data);
				setPending(false);
			});
	}, [pending]);
	useEffect(() => {
		let arrayOfWatingForResult = [];
		let arrayOfWatingForPermission = [];
		let arrayOfPermission = [];
		if (data && data.data) {
			data.data.forEach((v) => {
				if (moment(today).isAfter(moment(v.sch_end_date))) {
					// 오늘 날짜 이전의 스케줄
					arrayOfWatingForResult.push(v);
				} else {
					// 오늘 날짜 이후의 스케줄
					if (v.res_state_of_permission) {
						arrayOfPermission.push(v);
					} else {
						arrayOfWatingForPermission.push(v);
					}
				}
			});
			setDataSet({ arrayOfWatingForPermission, arrayOfPermission, arrayOfWatingForResult });
		}
	}, [data]);

	return (
		<>
			{pending ? (
				<Loader />
			) : (
				<div className="wrap bg">
					<div className="reserv_status">
						<p className="tit">실시간 예약 현황</p>
						<ul>
							<li className="yellow">
								<span>{dataSet && dataSet.arrayOfWatingForPermission.length}</span>
								예약 대기
							</li>
							<li>
								<span>{dataSet && dataSet.arrayOfPermission.length}</span>
								예약 완료
							</li>
							<li>
								<span>{dataSet && dataSet.arrayOfWatingForResult.length}</span>
								결과 대기
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
									{dataSet &&
										dataSet.arrayOfWatingForPermission.map((v) => (
											<div>
												<p className="left">
													[{v.std_for_lang}] {v.std_for_name}
													<span>
														{moment(v.sch_start_date).format("hh:mm")} ~
														{moment(v.sch_end_date).format("hh:mm")}
													</span>
												</p>
												<p className="right">예약 대기</p>
											</div>
										))}
								</div>
							</li>
							<li className="item status02" id="reservation_complete">
								<a href="#reservation_complete" className="btn">
									<span>예약 완료</span>
								</a>
								<div className="subMenu">
									{dataSet &&
										dataSet.arrayOfPermission.map((v) => (
											<div>
												<p className="left">
													[{v.std_for_lang}] {v.std_for_name}
													<span>
														{moment(v.sch_start_date).format("hh:mm")} ~
														{moment(v.sch_end_date).format("hh:mm")}
													</span>
												</p>
												<p
													className="right zoom_info"
													onClick={() => {
														alert(
															`Zoom ID : ${v.std_for_zoom_id}\nZoom PW : ${v.sch_for_zoom_pw}`
														);
													}}
												>
													접속 정보
												</p>
											</div>
										))}
								</div>
							</li>
							<li className="item status03" id="progress_complete">
								<a href="#progress_complete" className="btn">
									<span>결과 대기</span>
								</a>
								<div className="subMenu">
									{dataSet &&
										dataSet.arrayOfWatingForResult.map((v) => (
											<div>
												<p className="left">
													[{v.std_for_lang}] {v.std_for_name}
													<span>
														{moment(v.sch_start_date).format("hh:mm")} ~
														{moment(v.sch_end_date).format("hh:mm")}
													</span>
												</p>
												<p className="right">결과 대기</p>
											</div>
										))}
								</div>
							</li>
						</ui>
					</div>
				</div>
			)}
		</>
	);
}
