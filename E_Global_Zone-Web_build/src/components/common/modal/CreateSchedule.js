import React, { useEffect, useState } from "react";
import moment from "moment";
import { getAdminSection } from "../../../api/admin/section";
import ModalCalendar from "./ModalCalendar";
import useModal from "../../../modules/hooks/useModal";
import { useSelector } from "react-redux";
import { selectSelectDate } from "../../../redux/confSlice/confSlice";
import { postAdminScheduleSome } from "../../../api/admin/schedule";

export default function CreateSchedule({ sect_id, std_for_list, handleClose, reRender }) {
	const selectDate = useSelector(selectSelectDate);
	useEffect(() => {
		getAdminSection({});
		alert(std_for_list);
		return reRender;
	}, []);
	useEffect(() => window.easydropdown.all());
	const {
		isOpen: calIsOpen,
		handleOpen: handleOpenForCalendar,
		handleClose: handleCloseForCalendar,
	} = useModal();
	const _startTime = [9, 10, 11, 12, 13, 14, 15, 16, 17];
	const _endTiem = [10, 11, 12, 13, 14, 15, 16, 17, 18];
	const [startTime, setStartTime] = useState(_startTime[0]);
	const [endTime, setEndTime] = useState(_endTiem[0]);
	const [std_for_id, set_std_for_id] = useState(std_for_list[0].std_for_id);
	const [std_for_name, set_std_for_name] = useState(std_for_list[0].std_for_name);
	const [data, setData] = useState({ sect_id, schedule: [] });

	const handleAdd = () => {
		let times = [];
		for (let i = parseInt(startTime); i < endTime; i++) {
			times.push(i);
		}
		console.log(std_for_id, times, selectDate, std_for_name, startTime, endTime);
		setData({
			...data,
			schedule: [
				...data.schedule,
				{
					std_for_id,
					times,
					date: selectDate,
					std_for_name,
					startTime,
					endTime,
				},
			],
		});
		buildTable(data.schedule);
	};
	// <tr>
	// 	<td>{index + 1}</td>
	// 	<td>{v.date}</td>
	// 	<td>
	// 		{moment(`1996-02-27 ${v.startTime}:00`).format("h:mm")}~
	// 		{moment(`1996-02-27 ${v.endTime}:00`).format("h:mm")}
	// 	</td>
	// 	<td>{v.std_for_name}</td>
	// 	<td>
	// 		<img src="/global/img/row_del_btn.gif" alt="유힉생 스케줄 삭제" />
	// 	</td>
	// </tr>;
	const buildTable = (_data) => {
		const tbody = document.getElementById("tbody");
		tbody.innerHTML = "";
		for (let i = 0; i < _data.length; i++) {
			let tr = document.createElement("tr");
			let index = document.createElement("td");
			index.innerText = i + 1;
			let date = document.createElement("td");
			date.innerText = _data[i].date;
			let time = document.createElement("td");
			time.innerText = `${moment(`1996-02-27 ${_data[i].startTime}:00`).format("h:mm")}~
			 		${moment(`1996-02-27 ${_data[i].endTime}:00`).format("h:mm")}`;
			let name = document.createElement("td");
			name.innerText = _data[i].std_for_name;
			let button = document.createElement("td");
			let img = document.createElement("img");
			img.src = "/global/img/row_del_btn.gif";
			img.alt = "유학생 스케줄 삭제";

			button.appendChild(img);
			button.addEventListener("click", () => {
				data.schedule.splice(i, 1);
				buildTable(data.schedule);
			});

			tr.appendChild(index);
			tr.appendChild(date);
			tr.appendChild(time);
			tr.appendChild(name);
			tr.appendChild(button);

			tbody.appendChild(tr);
		}
	};
	useEffect(() => {
		buildTable(data.schedule);
	}, [data]);

	return (
		<div className="popup sch">
			<p className="tit">스케줄 입력</p>
			<div className="select_area">
				<div className="area">
					<p>날짜 선택</p>
					<div className="date" onClick={handleOpenForCalendar}>
						{selectDate}
					</div>
					<div style={{ position: "absolute", zIndex: "9999" }}>
						{calIsOpen && (
							<ModalCalendar
								id="calendar"
								handleClose={handleCloseForCalendar}
								setState={() => {}}
								selectDate={selectDate}
							/>
						)}
					</div>
				</div>
				<div className="area">
					<p>시간 선택</p>
					<select
						name="catgo1"
						className="dropdown"
						onChange={(e) => {
							setStartTime(e.target.value);
						}}
					>
						{_startTime.map((v) => {
							return (
								<option value={v}>
									{v >= 12
										? `오후 ${moment(`2020-09-1 ${v}:00`).format("h:mm")}`
										: `오전 ${moment(`2020-09-1 ${v}:00`).format("h:mm")}`}
								</option>
							);
						})}
					</select>
					<span>-</span>
					<select
						name="catgo1"
						className="dropdown"
						onChange={(e) => {
							setEndTime(e.target.value);
						}}
					>
						{_endTiem.map((v) => {
							return (
								<option value={v}>
									{v >= 12
										? `오후 ${moment(`2020-09-1 ${v}:00`).format("h:mm")}`
										: `오전 ${moment(`2020-09-1 ${v}:00`).format("h:mm")}`}
								</option>
							);
						})}
					</select>
				</div>
				<div className="area student">
					<p>유학생 선택</p>
					<select
						name="catgo3"
						className="dropdown"
						onChange={(e) => {
							set_std_for_name(e.target.innerText);
							set_std_for_id(e.target.value);
						}}
					>
						{std_for_list.map((v) => {
							return <option value={v.std_for_id}>{v.std_for_name}</option>;
						})}
						{/* <option>바라트벡 울잔</option>
						<option>카와이 히나코</option>
						<option>드로즈드 캣시아</option>
						<option>알무카메토바 아니사</option> */}
					</select>
				</div>
				<div className="regist_btn" onClick={handleAdd}>
					추가
				</div>
			</div>
			<div className="scroll_area">
				<table className="pop_table2">
					<colgroup>
						<col width="15%" />
						<col width="20%" />
						<col width="20%" />
					</colgroup>
					<tbody id="tbody"></tbody>
				</table>
			</div>

			<div className="btn_area right">
				<div
					className="bbtn blue"
					onClick={() => {
						postAdminScheduleSome(data).then(() => {
							handleClose();
						});
					}}
				>
					등록
				</div>
				<div className="bbtn darkGray" onClick={handleClose}>
					닫기
				</div>
			</div>
		</div>
	);
}
