import React, { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import moment from "moment";
import { getAdminForeigner, getAdminForeignerWork } from "../../../../api/admin/foreigner";
import {
	postAdminSchedule,
	deleteAdminSchedule,
	getAdminHoliday,
} from "../../../../api/admin/schedule";
import { getAdminSection, getAdminSectionLastday } from "../../../../api/admin/section";

import deepmerge from "deepmerge";
import useModal from "../../../../modules/hooks/useModal";
import Modal from "../../../../components/common/modal/Modal";
import Loader from "../../../../components/common/Loader";

export default function Section(props) {
	const params = useParams();
	const history = useHistory();
	const [eceptDate, setEceptDate] = useState([]);
	const [forList, setForList] = useState();
	const [sectName, setSectName] = useState();
	const [isDone, setIsDone] = useState(false);
	const [forName, setForName] = useState();
	const [time, setTime] = useState();

	const { isOpen, handleOpen, handleClose } = useModal();
	const {
		isOpen: isOpenForLoader,
		handleOpen: handleOpenForLoader,
		handleClose: handleCloseForLoader,
	} = useModal();

	const timeArray = [9, 10, 11, 12, 13, 14, 15, 16, 17];
	const dayArray = ["월", "화", "수", "목", "금"];

	const closure = (function () {
		let toggle = false;
		let startDay = 0;
		let endDay = 0;
		let startTime = 0;
		let endTime = 0;
		return new (function () {
			this.toggle = function () {
				toggle = !toggle;
				return toggle;
			};
			this.dragStart = function (e) {
				startDay = parseInt(e.target.id.split("-")[0]);
				startTime = parseInt(e.target.id.split("-")[1]);
			};
			this.dragEnd = function (e) {
				endDay = parseInt(e.target.id.split("-")[0]);
				endTime = parseInt(e.target.id.split("-")[1]);
				for (let i = startDay; i <= endDay; i++) {
					let lastTime = i === endDay ? endTime : 17;
					for (let j = i === startDay ? startTime : 9; j <= lastTime; j++) {
						let schedule = document.createElement("div");
						schedule.className = "time_area";
						schedule.style.zIndex = -9999;
						let parent = document.getElementById(`${i}-${j}`);
						parent.childNodes.length !== 0
							? parent.removeChild(parent.childNodes[0])
							: parent.appendChild(schedule);
					}
				}
			};
		})();
	})();

	const buildTable = () => {
		let tbody = document.getElementById("tbody");
		tbody.innerHTML = "";
		dayArray.forEach((day, index) => {
			let tr = document.createElement("tr");
			let td = document.createElement("td");
			td.innerText = day;
			tr.appendChild(td);
			timeArray.forEach((time) => {
				let td = document.createElement("td");
				td.addEventListener("mousedown", closure.dragStart);
				td.addEventListener("mouseup", closure.dragEnd);
				td.id = `${index}-${time}`;
				tr.appendChild(td);
			});
			tbody.appendChild(tr);
		});
	};

	function handleOnClick() {
		if (!window.confirm("저장하시겠습니까?")) return;
		let schedule = { 월: [], 화: [], 수: [], 목: [], 금: [] };
		Object.keys(schedule).forEach((v, i) => {
			for (let j = 9; j <= 17; j++) {
				let day = document.getElementById(`${i}-${j}`);
				if (day.hasChildNodes()) {
					schedule[v].push(j);
				}
			}
		});

		let data = {
			sect_id: params["sect_id"],
			std_for_id: params["std_for_id"],
			schedule: schedule,
			ecept_date: eceptDate,
			sch_start_date: time.sch_start_date,
			sch_end_date: time.sch_end_date,
			exception_mode: 0,
		};
		postAdminSchedule(data).then((res) => {
			getAdminForeignerWork(params["sect_id"]).then((res) => {
				setForList(res.data);
				redirectToFirst(res.data.data);
			});
		});

		handleOpen();
	}
	const redirectToFirst = (data) => {
		let first = true;
		data.forEach((v) => {
			if (!v.is_schedules_inputed && first) {
				first = false;
				history.push(`/section/${params["sect_id"]}/${v.std_for_id}`);
			}
		});
		first && history.push(`/section/${params["sect_id"]}/${data[0].std_for_id}`);
		window.location.reload();
	};

	const rendering = (std_for_id = params["std_for_id"]) => {
		handleOpenForLoader();
		if (std_for_id !== params["std_for_id"]) {
			history.push(`/section/${params["sect_id"]}/${std_for_id}`);
		}
		!forList &&
			getAdminForeignerWork(params["sect_id"]).then((res) => {
				setForList(res.data);
				setTime(res.data.time);
				if (params["std_for_id"] === "0") {
					redirectToFirst(res.data.data);
				}
			});
		!sectName &&
			getAdminSection({ sect_id: params["sect_id"] }).then((res) => {
				const { sect_start_date, sect_end_date } = res.data.data;
				getAdminHoliday({ year: moment(sect_start_date).format("YYYY") }).then((res) => {
					console.log(res.data.data);
					for (const key in res.data.data) {
						if (res.data.data.hasOwnProperty(key)) {
							const element = res.data.data[key];
							eceptDate.push(element);
						}
					}
				});
				getAdminHoliday({ year: moment(sect_end_date).format("YYYY") }).then((res) => {});
				setSectName(res.data);
			});
		if (std_for_id !== "0") {
			getAdminForeigner({
				foreigners: [std_for_id],
			}).then((res) => {
				setForName(res.data.data[0].std_for_name);
				handleCloseForLoader();
			});
			buildTable();
		} else {
			// window.location.reload();
		}
	};
	useEffect(() => {
		rendering();
	}, []);
	useEffect(() => {
		document
			.getElementsByName("stdList")
			.forEach((v) => v.classList.contains("selected") && v.classList.remove("selected"));

		forName &&
			document.getElementById(forName) &&
			document.getElementById(forName).classList.add("selected");
	}, [forName]);
	useEffect(() => {
		if (forList && forList.data) {
			setForList(forList.data);
		}
	}, [forList]);

	return (
		<div className="content">
			<div className="sub_title">
				<p className="tit">
					{sectName && sectName.data && sectName.data.sect_name} 근무 시간표 편성
				</p>
			</div>

			<div className="search_student">
				<div className="left_wrap">
					<div className="tsearch">
						<input type="text" />
						<input type="submit" value="검색" />
					</div>
					<div className="not_enter">
						<p className="tit">
							<span>미입력 리스트</span>
						</p>
						<div className="scroll_area">
							<table>
								<thead>
									<tr>
										<th scope="col">학번</th>
										<th scope="col">이름</th>
										{/* <th scope="col">근무시간</th> */}
									</tr>
								</thead>
								<tbody>
									{forList &&
										forList.length > 0 &&
										forList.map((v) => {
											if (!v.is_schedules_inputed) {
												return (
													<tr
														name="stdList"
														onClick={() => {
															rendering(v.std_for_id);
														}}
														id={v.std_for_name}
													>
														<td>{v.std_for_id}</td>
														<td className="name">{v.std_for_name}</td>
														{/* <td></td> */}
													</tr>
												);
											}
										})}
								</tbody>
							</table>
						</div>
					</div>

					<div className="enter">
						<p className="tit">
							<span>입력 완료 리스트</span>
						</p>
						<div className="scroll_area">
							<table>
								<thead>
									<tr>
										<th scope="col">학번</th>
										<th scope="col">이름</th>
										<th scope="col">삭제</th>
									</tr>
								</thead>
								<tbody>
									{forList &&
										forList.length > 0 &&
										forList.map((v, index) => {
											if (v.is_schedules_inputed) {
												return (
													<tr id={v.std_for_name}>
														<td>{v.std_for_id}</td>
														<td>{v.std_for_name}</td>
														<td>
															<button
																onClick={() => {
																	handleOpen();
																	deleteAdminSchedule({
																		sect_id: params["sect_id"],
																		std_for_id: v.std_for_id,
																	}).then((res) => {
																		getAdminForeignerWork(
																			params["sect_id"]
																		).then((res) => {
																			setForList(res.data);
																			redirectToFirst(
																				res.data.data
																			);
																		});
																	});
																}}
															>
																삭제
															</button>
														</td>
													</tr>
												);
											}
										})}
								</tbody>
							</table>
						</div>
					</div>
				</div>

				<div className="right_wrap">
					<p className="tit">[{forName}] 스케줄 등록</p>
					<div className="section_btn">
						<div className="reset btn" onClick={buildTable}>
							초기화
						</div>
						<div className="save btn" onClick={handleOnClick}>
							저장
						</div>
					</div>
					<table className="work_time">
						<colgroup>
							<col width="9%" span="10" />
						</colgroup>
						<thead>
							<tr>
								<th rowspan="2" scope="col"></th>
								<th colspan="3" scope="col">
									AM
								</th>
								<th colspan="7" scope="col">
									PM
								</th>
							</tr>
							<tr>
								<th scope="col">9</th>
								<th scope="col">10</th>
								<th scope="col">11</th>
								<th scope="col">12</th>
								<th scope="col">1</th>
								<th scope="col">2</th>
								<th scope="col">3</th>
								<th scope="col">4</th>
								<th scope="col">5</th>
							</tr>
						</thead>
						<tbody id="tbody"></tbody>
					</table>
				</div>
			</div>
			<Modal isOpen={isOpenForLoader}>
				<Loader />
			</Modal>
			<Modal isOpen={isOpen}>
				<Loader />
			</Modal>
		</div>
	);
}
