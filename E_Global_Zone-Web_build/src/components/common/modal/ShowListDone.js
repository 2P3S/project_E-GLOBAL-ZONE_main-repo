import React, { useEffect, useState } from "react";
import { getForeignerReservation } from "../../../api/foreigner/reservation";
import { getAdminReservation } from "../../../api/admin/foreigner";
import { useSelector } from "react-redux";
import { selectUser } from "../../../redux/userSlice/userSlice";

import conf from "../../../conf/conf";

/**
 * Modal - 신청 학생 명단보기
 * @param handleClose
 * @returns {JSX.Element}
 * @constructor
 */
export default function ShowList({
	handleClose,
	sch_id,
	std_for_id,
	std_for_name,
	sch_start_date,
	sch_end_date,
	reRender: thisReRender = () => {},
}) {
	const [data, setData] = useState();
	const [pending, setPending] = useState(false);
	const user = useSelector(selectUser);

	useEffect(() => {
		window.easydropdown.all();
		user.userClass === conf.userClass.MANAGER
			? getAdminReservation(sch_id).then((res) => setData(res.data))
			: getForeignerReservation(sch_id).then((res) => setData(res.data));
		return thisReRender;
	}, []);
	useEffect(() => {
		if (data && data.data) {
			let array = [];
			data.data.forEach((v) => {
				array.push(v.std_kor_id);
			});
			// setStudentList(array);
		}
		window.easydropdown.all();
	}, [data]);
	useEffect(() => {
		pending && handleClose();
	}, [pending]);

	return (
		<div className="popup enrol">
			<div className="top_tit">
				<div className="left">
					<p className="tit">참가 학생 명단보기</p>
					<p className="txt">
						<span>시작시간</span> {sch_start_date}
					</p>
					<p className="txt">
						<span>종료시간</span> {sch_end_date}
					</p>
				</div>
				<p className="name">
					{user.userClass === conf.userClass.MANAGER ? std_for_name : user.name}
				</p>
			</div>

			<div className="area">
				<ul>
					{data && data.data ? (
						<>
							{data.data.map((v, index) => {
								if (v === null || v === "null" || typeof v !== "object") {
									return (
										<li key={index + "null"}>
											<div className="student">
												<p className="name">삭제된 학생</p>
												<select
													name={"catgo"}
													className={"dropdown"}
													disabled
												>
													<option>---</option>
												</select>
											</div>
										</li>
									);
								}
								let permission = v.res_state_of_permission;
								return (
									<li key={v.std_kor_id + "index"}>
										<div className="student">
											<p className="name">{v.std_kor_name}</p>
											<select
												name={"catgo"}
												className={"dropdown"}
												id={v.std_kor_id}
												key={`${v.std_kor_id}`}
												disabled={true}
											>
												<option value={true}>
													{v.res_state_of_attendance ? "참석" : "미참석"}
												</option>
											</select>
										</div>
									</li>
								);
							})}
						</>
					) : (
						<></>
					)}
				</ul>
			</div>

			<div className="btn_area">
				<div className="right">
					<div className="bbtn darkGray" onClick={handleClose}>
						닫기
					</div>
				</div>
			</div>
		</div>
	);
}
