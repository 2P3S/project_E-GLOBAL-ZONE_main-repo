import React, { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import {
	getAdminForeignerWork,
	getAdminSection,
	postAdminSchedule,
	deleteAdminSchedule,
	getAdminForeignerInfo,
} from "../../../../modules/hooks/useAxios";

import deepmerge from "deepmerge";
import useModal from "../../../../modules/hooks/useModal";
import Modal from "../../../../components/common/modal/Modal";

let i = 0;
export default function Section(props) {
	const params = useParams();
	const history = useHistory();
	const [keysOfParams, setKeysOfParams] = useState(Object.keys(params));
	const [valuesOfParams, setValuesOfParams] = useState(Object.values(params));
	const [forList, setForList] = useState();
	const [sectName, setSectName] = useState();
	const [isDone, setIsDone] = useState(false);
	const [forName, setForName] = useState();
	const [schedule, setSchedule] = useState();
	const { isOpen, handleOpen, handleClose } = useModal();

	const timeArray = [9, 10, 11, 12, 13, 14, 15, 16, 17, 18];
	const dayArray = ["월", "화", "수", "목", "금"];

	const closure = (function () {
		let scheduleObject = { 월: [], 화: [], 수: [], 목: [], 금: [] };
		return new (function () {
			this.handleCreate = function (e) {
				let schedule = document.createElement("div");
				schedule.className = "time_area";
				schedule.style.zIndex = -9999;

				let day = new Object();
				Object.defineProperty(day, e.target.id.slice(0, 1), {
					value: [parseInt(e.target.id.slice(2, 5))],
					enumerable: true,
				});
				i++;
				console.log(day);
				scheduleObject = deepmerge(scheduleObject, day);
				setSchedule(scheduleObject);
				//<div className="time_area">
				e.target.appendChild(schedule);
				console.log(e.target);
				e.target.removeEventListener("click", closure.handleCreate);
				e.target.addEventListener("click", closure.handleRemove);
			};
			this.handleRemove = function (e) {
				console.log(e.target.id);
				let findTarget = parseInt(e.target.id.slice(2, 5));
				let arrayTarget = scheduleObject[`${e.target.id.slice(0, 1)}`];
				let index = arrayTarget.findIndex((e) => {
					return e === findTarget;
				});
				if (index > -1) {
					arrayTarget.splice(index, 1);
				}
				console.log(arrayTarget);

				e.target.innerHTML = "";
				e.target.removeEventListener("click", closure.handleRemove);
				e.target.addEventListener("click", closure.handleCreate);
			};
			this.getScheduleObject = () => {
				console.log(JSON.parse(JSON.stringify(scheduleObject))); // 빈객체
			};

			this.checkScheduleObject = () => {
				console.log(scheduleObject); // 빈객체
			};
		})();
	})();

	const buildTable = () => {
		let tbody = document.getElementById("tbody");
		tbody.innerHTML = "";
		dayArray.forEach((day) => {
			let tr = document.createElement("tr");
			let td = document.createElement("td");
			td.innerText = day;
			tr.appendChild(td);
			timeArray.forEach((time) => {
				let td = document.createElement("td");
				td.addEventListener("click", closure.handleCreate);
				td.id = `${day}-${time}`;
				tr.appendChild(td);
			});
			tbody.appendChild(tr);
		});
	};

	function handleOnClick() {
		let data = {
			sect_id: params["sect_id"],
			std_for_id: params["std_for_id"],
			schedule: schedule,
			ecept_date: [],
		};
		postAdminSchedule(data, setIsDone);

		handleOpen();
	}

	useEffect(() => {
		console.log(params["sect_id"]);
		getAdminForeignerWork(setForList, params["sect_id"]);
		getAdminSection({ sect_id: params["sect_id"] }, setSectName);
		getAdminForeignerInfo({ foreigners: [params["std_for_id"]] }, setForName);
		buildTable();
	}, []);
	useEffect(() => {
		if (forList && forList.data) {
			console.log(forList);
			setForList(forList.data);
		} else {
			console.log(forList);
		}
	}, [forList]);

	useEffect(() => {
		getAdminForeignerInfo({ foreigners: [params["std_for_id"]] }, setForName);
	}, [params]);

	useEffect(() => {
		if (isDone) {
			handleClose();
			forList.forEach((v) => {
				if (v.std_for_name !== forName && !v.is_schedules_inputed) {
					history.push(`/section/${params["sect_id"]}/${v.std_for_id}`);
				}
			});
			history.push("/reload");
		}
	});
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
					<div className="scroll_area">
						<table>
							<thead>
								<tr>
									<th colSpan="3">미입력 리스트</th>
								</tr>
								<tr>
									<th scope="col">학번</th>
									<th scope="col">이름</th>
									<th scope="col">근무시간</th>
								</tr>
							</thead>
							<tbody>
								{forList &&
									forList.length > 0 &&
									forList.map((v) => {
										if (!v.is_schedules_inputed) {
											return (
												<tr
													onClick={() => {
														history.push(
															`/section/${params["sect_id"]}/${v.std_for_id}`
														);
													}}
												>
													<td>{v.std_for_id}</td>
													<td>{v.std_for_name}</td>
													<td></td>
												</tr>
											);
										}
									})}
							</tbody>
						</table>
						<table>
							<thead>
								<tr>
									<th colSpan="3">입력 완료 리스트</th>
								</tr>
								<tr>
									<th scope="col">학번</th>
									<th scope="col">이름</th>
									<th scope="col">근무시간</th>
								</tr>
							</thead>
							<tbody>
								{forList &&
									forList.length > 0 &&
									forList.map((v, index) => {
										if (v.is_schedules_inputed) {
											return (
												<tr>
													<td>{v.std_for_id}</td>
													<td>{v.std_for_name}</td>
													<td>
														<button
															onClick={() => {
																deleteAdminSchedule(
																	{
																		sect_id: params["sect_id"],
																		std_for_id: v.std_for_id,
																	},
																	setIsDone
																);
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

				<div className="right_wrap">
					<p className="tit">
						[{forName && forName.data && forName.data[0].std_for_name}] 스케줄 등록
					</p>
					<div className="save_btn" onClick={handleOnClick}>
						저장
					</div>
					<table>
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
								<th scope="col">6</th>
							</tr>
						</thead>
						<tbody id="tbody"></tbody>
						{/* <tbody>
							<tr>
								<td>월</td>
								<td></td>

								<td>
									<div className="time_area">
										<p>10:00 ~ 12:00</p>
									</div>
								</td>
								<td>
									<div className="time_area"></div>
								</td>
								<td>
									<div className="time_area">
										<div className="time_del">
											<img
												src="/global/img/time_del_btn.gif"
												alt="선택 시간 삭제"
											/>
										</div>
									</div>
								</td>

								<td></td>
								<td></td>
								<td></td>
								<td></td>
								<td></td>
								<td></td>
							</tr>
							<tr>
								<td>화</td>
								<td></td>
								<td>
									<div className="time_area">
										<p>10:00 ~ 12:00</p>
									</div>
								</td>
								<td>
									<div className="time_area"></div>
								</td>
								<td>
									<div className="time_area">
										<div className="time_del">
											<img
												src="/global/img/time_del_btn.gif"
												alt="선택 시간 삭제"
											/>
										</div>
									</div>
								</td>
								<td></td>
								<td></td>
								<td></td>
								<td></td>
								<td></td>
								<td></td>
							</tr>
							<tr>
								<td>수</td>
								<td></td>
								<td>
									<div className="time_area">
										<p>10:00 ~ 12:00</p>
									</div>
								</td>
								<td>
									<div className="time_area"></div>
								</td>
								<td>
									<div className="time_area">
										<div className="time_del">
											<img
												src="/global/img/time_del_btn.gif"
												alt="선택 시간 삭제"
											/>
										</div>
									</div>
								</td>
								<td></td>
								<td></td>
								<td></td>
								<td></td>
								<td></td>
								<td></td>
							</tr>
							<tr>
								<td>목</td>
								<td></td>
								<td>
									<div className="time_area">
										<p>10:00 ~ 12:00</p>
									</div>
								</td>
								<td>
									<div className="time_area"></div>
								</td>
								<td>
									<div className="time_area">
										<div className="time_del">
											<img
												src="/global/img/time_del_btn.gif"
												alt="선택 시간 삭제"
											/>
										</div>
									</div>
								</td>
								<td></td>
								<td></td>
								<td></td>
								<td></td>
								<td></td>
								<td></td>
							</tr>
							<tr>
								<td>금</td>
								<td></td>
								<td>
									<div className="time_area">
										<p>10:00 ~ 12:00</p>
									</div>
								</td>
								<td>
									<div className="time_area"></div>
								</td>
								<td>
									<div className="time_area">
										<div className="time_del">
											<img
												src="/global/img/time_del_btn.gif"
												alt="선택 시간 삭제"
											/>
										</div>
									</div>
								</td>
								<td></td>
								<td></td>
								<td></td>
								<td></td>
								<td></td>
								<td></td>
							</tr>
						</tbody> */}
					</table>
				</div>
			</div>
			<Modal isOpen={isOpen}>
				<div>로딩중~~~~</div>
			</Modal>
			{/* <div className="table_btn mb40">
				<div>업로드</div>
			</div> */}
		</div>
	);
}
