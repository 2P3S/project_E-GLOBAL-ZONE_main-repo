import React, { useEffect, useState, useMemo } from "react";
import moment from "moment";
import { useSelector } from "react-redux";
import { selectSelectDate, selectToday } from "../../../../redux/confSlice/confSlice";
import deepmerge from "deepmerge";

import useModal from "../../../../modules/hooks/useModal";
import Modal from "../../../../components/common/modal/Modal";

// import { getAdminSchedule, deleteAdminScheduleSome } from "../../../../modules/hooks/useAxios";

import { getAdminSchedule } from "../../../../api/admin/schedule";

import ModalCalendar from "../../../../components/common/modal/ModalCalendar";
import conf from "../../../../conf/conf";
import ShowList from "../../../../components/common/modal/ShowList";
import { useHistory, useParams, useLocation } from "react-router-dom";
import InsertResult from "../../../../components/common/modal/InsertResult";
import DeleteSchedule from "../../../../components/common/modal/DeleteSchedule";
import PermissionScheduleResult from "../../../../components/common/modal/PermissionScheduleResult";
import CreateSchedule from "../../../../components/common/modal/CreateSchedule";

/**
 * Manager :: 스케줄 조회
 * @returns {JSX.Element}
 * @constructor
 */
export default function Schedules() {
	const params = useParams();

	const history = useHistory();
	const today = useSelector(selectToday);
	const _selectDate = useSelector(selectSelectDate);
	const [selectDate, setSelectDate] = useState(params.date);
	const [calIsOpen, setCalIsOpen] = useState(false);
	const [firstRendering, setFirstRendering] = useState(true);
	const {
		isOpen: scheduleIsOpen,
		handleClose: scheduleClose,
		handleOpen: scheduleOpen,
	} = useModal();
	const [selectedSchedule, setSelectedSchedule] = useState({});
	const [pending, setPending] = useState(false);
	const [schedules, setSchedules] = useState();
	const [countOfEng, setCountOfEng] = useState();
	const [countOfJp, setCountOfJp] = useState();
	const [countOfCh, setCountOfCh] = useState();
	const [countOfstate, setCountOfState] = useState({
		state1: 0,
		state2: 0,
		state3: 0,
		state4: 0,
		state5: 0,
		state6: 0,
		state7: 0,
	});

	const handleOpenForCalendar = () => {
		setCalIsOpen(!calIsOpen);
	};

	const handleCheck = (className, isAdd) => {
		if (className === "checkAll") {
			document.getElementsByName("checkBox").forEach((v) => {
				v.checked = isAdd;
			});
			handleCheck("state1", isAdd);
			handleCheck("state2", isAdd);
			handleCheck("state3", isAdd);
			handleCheck("state4", isAdd);
			handleCheck("state5", isAdd);
			handleCheck("state6", isAdd);
			handleCheck("state7", isAdd);
		} else {
			for (const key in document.getElementsByClassName(`state_box ${className}`)) {
				if (document.getElementsByClassName(`state_box ${className}`).hasOwnProperty(key)) {
					const element = document.getElementsByClassName(`state_box ${className}`)[key];
					isAdd ? element.classList.remove("off") : element.classList.add("off");
				}
			}
		}
	};

	const handleClick = (e) => {
		if (e.target.value === "state1") {
			handleCheck(e.target.value, e.target.checked);
			handleCheck("state2", e.target.checked);
		} else {
			handleCheck(e.target.value, e.target.checked);
		}
	};
	useMemo(() => {
		if (moment(params.date).format("YYYY-MM-DD") !== _selectDate) {
			setSelectDate(moment(params.date).format("YYYY-MM-DD"));
		}
		if (params.date.length > 10 || params.date.length < 9) {
			history.push("/");
		}
	}, [params]);

	useEffect(() => {
		document.getElementById("allCheck").checked = true;
		document.getElementsByName("checkBox").forEach((v) => {
			v.addEventListener("click", handleClick);
		});
	}, []);
	useMemo(() => {
		// console.log(params);
		if (!firstRendering) {
			history.push(`/schedules/${_selectDate}`);
			setSelectDate(_selectDate);
		}
	}, [_selectDate]);
	useEffect(() => {
		// console.log(selectDate);
		setPending(true);
	}, [selectDate]);

	useEffect(() => {
		if (pending) {
			document.getElementById("date").innerText = "로딩중";
			setCountOfState({
				state1: 0,
				state2: 0,
				state3: 0,
				state4: 0,
				state5: 0,
				state6: 0,
				state7: 0,
			});
		}
		pending &&
			getAdminSchedule({ search_date: params.date }).then((res) => {
				setSchedules(res.data);
				setFirstRendering(false);
			});
	}, [pending]);

	// useEffect(() => {
	// 	reRender();
	// }, [params]);
	useEffect(() => {
		if (schedules && schedules.message === "스케줄 목록 조회에 성공하였습니다.") {
			setPending(false);
		}
		if (schedules && schedules.data) {
			setCountOfEng(schedules.data.English.length);
			setCountOfJp(schedules.data.Japanese.length);
			setCountOfCh(schedules.data.Chinese.length);
		}
	}, [schedules]);

	useEffect(() => {
		// if (typeof selectedSchedule === "object") scheduleOpen();
	}, [selectedSchedule]);
	const reRender = () => {
		// getAdminSchedule({ search_date: selectDate }).then((res) => {
		// 	setSchedules(res.data);
		// });
		setPending(true);
	};

	/*  ********[마우스 오버 삭제 버튼 예시]********		
								<div class="hover_btn sch">
									<div class="area">
										<div class="lightGray">삭제</div>
									</div>
								</div> */
	useEffect(() => {
		if (schedules && schedules.data) {
			if (!pending) {
				let tag = true;
				for (const key in schedules.data) {
					if (schedules.data.hasOwnProperty(key)) {
						const element = schedules.data[key];
						element.forEach((v) => {
							v.schedules.forEach((schedule) => {
								if (tag) {
									document.getElementById("date").innerText = moment(
										selectDate
									).format("YYYY년 MM월 DD일");
									tag = false;
								}
								let td = document.getElementById(
									`${v.std_for_id}_${moment(schedule.sch_start_date).format("h")}`
								);
								let div = document.createElement("div");
								if (
									schedule.un_permission_count === 0 &&
									schedule.reservated_count === 0
								) {
									if (moment(schedule.sch_end_date) > moment(Date.now())) {
										div.className = "state_box state7";
										setCountOfState({
											...countOfstate,
											state7: ++countOfstate.state7,
										});
									} else {
										div.className = "state_box state7";
										setCountOfState({
											...countOfstate,
											state7: ++countOfstate.state7,
										});
										div.innerText = "종료";
									}
								} else {
									if (new Date(schedule.sch_end_date) > new Date(today)) {
										// 스케줄 시작 전
										if (
											schedule.reservated_count > 0 &&
											schedule.un_permission_count === 0
										) {
											div.className = "state_box state2";
											setCountOfState({
												...countOfstate,
												state2: ++countOfstate.state2,
											});
											let p = document.createElement("p");
											p.innerText = `${schedule.reservated_count}`;
											div.appendChild(p);
										} else if (schedule.reservated_count > 0) {
											div.className = "state_box state1";
											setCountOfState({
												...countOfstate,
												state1: ++countOfstate.state1,
											});
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
											setCountOfState({
												...countOfstate,
												state6: ++countOfstate.state6,
											});
										} else if (schedule.sch_state_of_result_input) {
											div.className = "state_box state5";
											setCountOfState({
												...countOfstate,
												state5: ++countOfstate.state5,
											});
											let p = document.createElement("p");
											p.innerText = `${schedule.reservated_count}`;
											div.appendChild(p);
										} else {
											div.className = "state_box state3";
											setCountOfState({
												...countOfstate,
												state3: ++countOfstate.state3,
											});
											let p = document.createElement("p");
											p.innerText = `${schedule.reservated_count}`;
											div.appendChild(p);
										}
									}
								}
								function clickListner() {
									if (
										div.className === "state_box state2" ||
										div.className === "state_box state1"
									) {
										setSelectedSchedule({
											sch_id: schedule.sch_id,
											component: "ShowList",
											std_for_id: v.std_for_id,
											std_for_name: v.std_for_name,
											sch_end_date: schedule.sch_end_date,
											sch_start_date: schedule.sch_start_date,
										});
										scheduleOpen();
									} else if (div.className === "state_box state3") {
										setSelectedSchedule({
											sch_id: schedule.sch_id,
											component: "",
											std_for_id: v.std_for_id,
											std_for_name: v.std_for_name,
											sch_end_date: schedule.sch_end_date,
											sch_start_date: schedule.sch_start_date,
										});
										scheduleOpen();
									} else if (div.className === "state_box state5") {
										setSelectedSchedule({
											sch_id: schedule.sch_id,
											component: "PermissionScheduleResult",
											std_for_id: v.std_for_id,
											std_for_name: v.std_for_name,
											sch_end_date: schedule.sch_end_date,
											sch_start_date: schedule.sch_start_date,
										});
										scheduleOpen();
									} else if (div.className !== "state_box state6") {
										if (div.innerText !== "종료") {
											setSelectedSchedule({
												sch_id: schedule.sch_id,
												component: "ShowList",
												std_for_id: v.std_for_id,
												std_for_name: v.std_for_name,
												sch_end_date: schedule.sch_end_date,
												sch_start_date: schedule.sch_start_date,
											});
											scheduleOpen();
										}
									}
								}
								function addListner(div) {
									div.addEventListener("click", clickListner);
								}
								addListner(div);
								// 삭제버튼
								let deleteBtn = document.createElement("div");
								let area = document.createElement("div");
								let btn = document.createElement("div");
								deleteBtn.className = "hover_btn sch hover_off";
								area.className = "area";
								btn.className = "lightGray";
								btn.innerText = "삭제";
								area.appendChild(btn);
								deleteBtn.appendChild(area);

								if (div.innerText !== "종료") {
									div.addEventListener("mouseover", () => {
										deleteBtn.classList.remove("hover_off");
									});
									div.addEventListener("mouseout", () => {
										deleteBtn.classList.add("hover_off");
									});
									btn.addEventListener("mouseover", (e) => {
										div.removeEventListener("click", clickListner);
									});
									btn.addEventListener("mouseout", () => {
										addListner(div);
									});
									btn.addEventListener("click", (e) => {
										if (e.target.innerText === "삭제") {
											setSelectedSchedule({
												sch_id: schedule.sch_id,
												component: "Delete",
												std_for_id: v.std_for_id,
												std_for_name: v.std_for_name,
												sch_end_date: schedule.sch_end_date,
												sch_start_date: schedule.sch_start_date,
											});
										}
										setTimeout(scheduleOpen, 500);
										// scheduleOpen();
									});
									div.appendChild(deleteBtn);
								}

								td.appendChild(div);
							});
						});
					}
				}
			}
		}
	}, [schedules, pending]);
	return (
		<div className="content">
			<div className="sub_title">
				<p className="tit" id="date"></p>
				<div className="select_date" onClick={handleOpenForCalendar}>
					<img src="/global/img/select_date_ico.gif" alt="날짜 선택" />
				</div>
				<div
					style={{ position: "absolute", zIndex: "9999" }}
					onMouseLeave={() => setCalIsOpen(false)}
				>
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
							<input type="checkbox" id="allCheck" name="checkBox" value="checkAll" />
							<label for="allCheck"></label>
						</div>
					</div>
					<div className="check_box">
						<div className="check_box_input">
							<input
								type="checkbox"
								id="no_app_reservation"
								name="checkBox"
								value="state1"
							/>
							<label for="no_app_reservation">
								<span>
									예약 미승인{" "}
									<span className="blue">
										{countOfstate.state1 + countOfstate.state2}
									</span>
									건
								</span>
							</label>
						</div>
					</div>

					<div className="check_box">
						<div className="check_box_input">
							<input type="checkbox" id="not_result" name="checkBox" value="state3" />
							<label for="not_result">
								<span>
									결과 미입력 <span className="mint">{countOfstate.state3}</span>
									건
								</span>
							</label>
						</div>
					</div>

					<div className="check_box">
						<div className="check_box_input">
							<input
								type="checkbox"
								id="no_app_result"
								name="checkBox"
								value="state5"
							/>
							<label for="no_app_result">
								<span>
									결과 미승인{" "}
									<span className="yellow">{countOfstate.state5}</span>건
								</span>
							</label>
						</div>
					</div>

					<div className="check_box">
						<div className="check_box_input">
							<input type="checkbox" id="ok_result" name="checkBox" value="state6" />
							<label for="ok_result">
								<span>
									결과 입력완료{" "}
									<span className="puple">{countOfstate.state6}</span>건
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
				<div className="scroll_area pt40">
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

								{schedules && schedules.data && schedules.data.English.length > 0 && (
									<th scope="row" rowSpan={countOfEng + 1}>
										{/* rowSpan = 해당 언어 학생 수 */}
										영어
									</th>
								)}
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
								{schedules && schedules.data && schedules.data.Japanese.length > 0 && (
									<th scope="row" rowSpan={countOfJp + 1}>
										{/* rowSpan = 해당 언어 학생 수 */}
										일본어
									</th>
								)}

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
								{schedules && schedules.data && schedules.data.Chinese.length > 0 && (
									<th scope="row" rowSpan={countOfCh + 1}>
										{/* rowSpan = 해당 언어 학생 수 */}
										중국어
									</th>
								)}
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
							</tbody>
						</table>
					) : (
						<>???</>
					)}
				</div>

				<div className="table_btn">{/* <div>CSV 입력</div> */}</div>
			</div>
			<Modal isOpen={scheduleIsOpen} handleClose={scheduleClose}>
				{selectedSchedule && selectedSchedule.component === "ShowList" ? (
					<ShowList
						sch_id={selectedSchedule && selectedSchedule.sch_id}
						handleClose={scheduleClose}
						std_for_id={selectedSchedule && selectedSchedule.std_for_id}
						std_for_name={selectedSchedule && selectedSchedule.std_for_name}
						sch_start_date={selectedSchedule && selectedSchedule.sch_start_date}
						sch_end_date={selectedSchedule && selectedSchedule.sch_end_date}
						reRender={reRender}
					/>
				) : selectedSchedule.component === "InsertResult" ? (
					<InsertResult
						sch_id={selectedSchedule && selectedSchedule.sch_id}
						std_for_name={selectedSchedule && selectedSchedule.std_for_name}
						std_for_id={selectedSchedule && selectedSchedule.std_for_id}
						sch_start_date={selectedSchedule && selectedSchedule.sch_start_date}
						sch_end_date={selectedSchedule && selectedSchedule.sch_end_date}
						handleClose={scheduleClose}
						reRender={reRender}
					/>
				) : selectedSchedule.component === "PermissionScheduleResult" ? (
					<PermissionScheduleResult
						handleClose={scheduleClose}
						date={params.date}
						reRender={reRender}
					/>
				) : (
					<DeleteSchedule
						sch_id={selectedSchedule && selectedSchedule.sch_id}
						std_for_name={selectedSchedule && selectedSchedule.std_for_name}
						sch_start_date={selectedSchedule && selectedSchedule.sch_start_date}
						handleClose={scheduleClose}
						reRender={reRender}
					/>
				)}
			</Modal>
		</div>
	);
}
