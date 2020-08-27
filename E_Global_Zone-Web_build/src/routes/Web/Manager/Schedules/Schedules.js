import React, { useEffect, useState } from "react";
import moment from "moment";
import { useSelector } from "react-redux";
import { selectSelectDate, selectToday } from "../../../../redux/confSlice/confSlice";
import deepmearge from "deepmerge";
import * as _ from "lodash";

import useModal from "../../../../modules/hooks/useModal";
import Modal from "components/common/modal/Modal";

import { getAdminSchedule } from "../../../../modules/hooks/useAxios";

import ModalCalendar from "../../../../components/common/modal/ModalCalendar";
import conf from "../../../../conf/conf";

/**
 * Manager :: 스케줄 조회
 * @returns {JSX.Element}
 * @constructor
 */
export default function Schedules() {
	const today = useSelector(selectToday);
	const selectDate = useSelector(selectSelectDate);
	const [calIsOpen, setCalIsOpen] = useState(false);
	const [pending, setPending] = useState(false);
	const [schedules, setSchedulse] = useState();
	const [countOfEng, setCountOfEng] = useState();
	const [countOfJp, setCountOfJp] = useState();
	const [countOfCh, setCountOfCh] = useState();

	const handleOpenForCalendar = () => {
		setCalIsOpen(!calIsOpen);
	};

	useEffect(() => {
		getAdminSchedule({ search_date: selectDate }, setSchedulse);
		setPending(true);
	}, []);
	useEffect(() => {
		getAdminSchedule({ search_date: selectDate }, setSchedulse);
		setPending(true);
	}, [selectDate]);
	useEffect(() => {
		console.log(schedules);

		if (schedules && schedules.message === "스케줄 목록 조회에 성공하였습니다.") {
			setPending(false);
		}
		if (schedules && schedules.data) {
			setCountOfEng(schedules.data.English.length);
			setCountOfJp(schedules.data.Japanese.length);
			setCountOfCh(schedules.data.Chinese.length);
		}
		console.log(countOfEng, countOfJp, countOfCh);
	}, [schedules]);

	// if(un_permission_count === 0 && reservated_count === 0){
	//     this.state = STATE_NOTHING;
	// }else{
	//     if (new Date(sch_end_date) > new Date(today)) {
	//         // 스케줄 시작 전
	//         if (reservated_count > 0 && un_permission_count === 0) {
	//             this.state = STATE_RESERVED;
	//         } else if (reservated_count > 0) {
	//             this.state = STATE_PENDING;
	//         }
	//     } else {
	//         // 스케줄 완료 후
	//         if (sch_state_of_result_input) {
	//             this.state = STATE_CONFIRM;
	//         } else {
	//             this.state = STATE_DONE;
	//         }
	//     }
	// }
	// state1 :: [예약현황] 미승인 / 총 신청 학생
	// state2 :: [예약 승인 완료]
	// state3 :: [결과 미입력] 출석 학생
	// state4 :: [결과 입력 완료]
	// state5 :: [관리자 미승인] 출석 학생
	// state6 :: [관리자 승인 완료]
	// state7 :: 예약없음

	useEffect(() => {
		if (!pending && schedules && schedules.data) {
			for (const key in schedules.data) {
				if (schedules.data.hasOwnProperty(key)) {
					const element = schedules.data[key];
					element.forEach((v) => {
						v.schedules.forEach((schedule) => {
							console.log(schedule);
							let td = document.getElementById(
								`${v.std_for_id}_${moment(schedule.sch_start_date).format("h")}`
							);
							let div = document.createElement("div");
							if (
								schedule.un_permission_count === 0 &&
								schedule.reservated_count === 0
							) {
								div.className = "state_box state7";
							} else {
								if (new Date(schedule.sch_end_date) > new Date(today)) {
									// 스케줄 시작 전
									if (
										schedule.reservated_count > 0 &&
										schedule.un_permission_count === 0
									) {
										div.className = "state_box state2";
										let p = document.createElement("p");
										p.innerText = `${schedule.reservated_count}`;
										div.appendChild(p);
									} else if (schedule.reservated_count > 0) {
										div.className = "state_box state1";
										let p = document.createElement("p");
										p.innerText = `${schedule.un_permission_count} / `;
										let span = document.createElement("span");
										span.innerText = `${schedule.reservated_count}`;
										p.appendChild(span);
										div.appendChild(p);
									}
								} else {
									// 스케줄 완료 후
									if (schedule.sch_state_of_permission) {
										div.className = "state_box state6";
									} else if (schedule.sch_state_of_result_input) {
										div.className = "state_box state5";
										let p = document.createElement("p");
										p.innerText = `${schedule.reservated_count}`;
										div.appendChild(p);
									} else {
										div.className = "state_box state3";
										let p = document.createElement("p");
										p.innerText = `${schedule.reservated_count}`;
										div.appendChild(p);
									}
								}
							}
							div.addEventListener("click", () => {
								console.log(
									schedule.sch_id,
									schedule.un_permission_count,
									schedule.reservated_count,
									schedule.sch_state_of_result_input,
									schedule.sch_state_of_permission
								);
							});
							td.appendChild(div);
							console.log(moment(schedule.sch_start_date).format("h"));
						});
					});
				}
			}
		}
	}, [pending]);
	return (
		<div className="content">
			<div className="sub_title">
				<p className="tit">{moment(selectDate).format("YYYY년 MM월 DD일")}</p>
				<div className="select_date" onClick={handleOpenForCalendar}>
					<img src="/global/img/select_date_ico.gif" alt="날짜 선택" />
				</div>
				<div style={{ position: "absolute" }}>
					{calIsOpen && (
						<ModalCalendar
							id="calendar"
							handleClose={() => {
								handleOpenForCalendar();
							}}
							setState={() => {}}
							selectDate={selectDate}
						/>
					)}
				</div>

				<div className="check_box_area">
					<div className="check_box">
						<div className="check_box_input all">
							<input type="checkbox" id="allCheck" name="" />
							<label for="allCheck"></label>
						</div>
					</div>

					<div className="check_box">
						<div className="check_box_input">
							<input type="checkbox" id="no_app_reservation" name="" />
							<label for="no_app_reservation">
								<span>
									예약 미승인 <span className="blue">10</span>건
								</span>
							</label>
						</div>
					</div>

					<div className="check_box">
						<div className="check_box_input">
							<input type="checkbox" id="not_result" name="" />
							<label for="not_result">
								<span>
									결과 미입력 <span className="mint">2</span>건
								</span>
							</label>
						</div>
					</div>

					<div className="check_box">
						<div className="check_box_input">
							<input type="checkbox" id="no_app_result" name="" />
							<label for="no_app_result">
								<span>
									결과 미승인 <span className="yellow">3</span>건
								</span>
							</label>
						</div>
					</div>

					<div className="check_box">
						<div className="check_box_input">
							<input type="checkbox" id="ok_result" name="" />
							<label for="ok_result">
								<span>
									결과 입력완료 <span className="puple">2</span>건
								</span>
							</label>
						</div>
					</div>
				</div>
			</div>

			<div className="sch_info">
				<ul>
					<li className="ico01">[예약현황] 미승인 / 총 신청 학생</li>
					<li className="ico02">[예약 승인 완료]</li>
				</ul>
				<ul>
					<li className="ico03">[결과 미입력] 출석 학생</li>
					<li className="ico04">[결과 입력 완료]</li>
				</ul>
				<ul>
					<li className="ico05">[관리자 미승인] 출석 학생</li>
					<li className="ico06">[관리자 승인 완료]</li>
				</ul>
			</div>

			<div className="wrap">
				<ul className="sch_time">
					<li>9AM</li>
					<li>10AM</li>
					<li>11AM</li>
					<li>12PM</li>
					<li>1PM</li>
					<li>2PM</li>
					<li>3PM</li>
					<li>4PM</li>
					<li>5PM</li>
					<li>6PM</li>
				</ul>
				<div className="scroll_area">
					{!pending ? (
						<table className="sch_table">
							<colgroup>
								<col width="4%" />
								<col width="12%" />
								<col width="9%" span="9" />
							</colgroup>
							<tbody>
								{/* <!--  
                                state1 :: [예약현황] 미승인 / 총 신청 학생
                                state2 :: [예약 승인 완료] 
                                state3 :: [결과 미입력] 출석 학생
                                state4 :: [결과 입력 완료]
                                state5 :: [관리자 미승인] 출석 학생
                                state6 :: [관리자 승인 완료]
                                state7 :: 예약없음 
                            --> */}

								<th scope="row" rowSpan={countOfEng + 1}>
									{/* rowSpan = 해당 언어 학생 수 */}
									영어
								</th>
								{schedules &&
									schedules.data &&
									schedules.data.English.map((v) => {
										return (
											<tr>
												<td>{v.std_for_name}</td>
												<td id={`${v.std_for_id}_9`}></td>
												<td id={`${v.std_for_id}_10`}></td>
												<td id={`${v.std_for_id}_11`}></td>
												<td id={`${v.std_for_id}_12`}></td>
												<td id={`${v.std_for_id}_1`}></td>
												<td id={`${v.std_for_id}_2`}></td>
												<td id={`${v.std_for_id}_3`}></td>
												<td id={`${v.std_for_id}_4`}></td>
												<td id={`${v.std_for_id}_5`}></td>
											</tr>
										);
									})}
								<th scope="row" rowSpan={countOfJp + 1}>
									{/* rowSpan = 해당 언어 학생 수 */}
									일본어
								</th>
								{schedules &&
									schedules.data &&
									schedules.data.Japanese.map((v) => {
										return (
											<tr>
												<td>{v.std_for_name}</td>
												<td id={`${v.std_for_id}_9`}></td>
												<td id={`${v.std_for_id}_10`}></td>
												<td id={`${v.std_for_id}_11`}></td>
												<td id={`${v.std_for_id}_12`}></td>
												<td id={`${v.std_for_id}_1`}></td>
												<td id={`${v.std_for_id}_2`}></td>
												<td id={`${v.std_for_id}_3`}></td>
												<td id={`${v.std_for_id}_4`}></td>
												<td id={`${v.std_for_id}_5`}></td>
											</tr>
										);
									})}
								<th scope="row" rowSpan={countOfCh + 1}>
									{/* rowSpan = 해당 언어 학생 수 */}
									중국어
								</th>
								{schedules &&
									schedules.data &&
									schedules.data.Chinese.map((v) => {
										return (
											<tr>
												<td>{v.std_for_name}</td>
												<td id={`${v.std_for_id}_9`}></td>
												<td id={`${v.std_for_id}_10`}></td>
												<td id={`${v.std_for_id}_11`}></td>
												<td id={`${v.std_for_id}_12`}></td>
												<td id={`${v.std_for_id}_1`}></td>
												<td id={`${v.std_for_id}_2`}></td>
												<td id={`${v.std_for_id}_3`}></td>
												<td id={`${v.std_for_id}_4`}></td>
												<td id={`${v.std_for_id}_5`}></td>
											</tr>
										);
									})}
								{/* <tr>
									<td>쉬라이 알리오트 시나</td>
									<td>
										<div className="state_box state1">
											<p>
												8 / <span>3</span>
											</p>
										</div>
										<div className="state_box state1">
											<p>
												7 / <span>2</span>
											</p>
										</div>
									</td>
									<td></td>
									<td>
										<div className="state_box state2">
											<p>2</p>
										</div>
										<div className="state_box state7"></div>
									</td>
									<td></td>
									<td>
										<div className="state_box state3">
											<p>2</p>
										</div>
										<div className="state_box state5">
											<p>2</p>
										</div>
									</td>
									<td></td>
									<td>
										<div className="state_box state4"></div>
									</td>
									<td>
										<div className="state_box state6"></div>
									</td>
									<td></td>
								</tr> */}
							</tbody>
						</table>
					) : (
						<>???</>
					)}
				</div>

				<div className="table_btn">
					<div>개별 입력</div>
					<div>CSV 입력</div>
				</div>
			</div>
		</div>
	);
}
