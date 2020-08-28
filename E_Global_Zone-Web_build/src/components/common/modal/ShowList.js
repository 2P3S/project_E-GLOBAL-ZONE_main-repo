import React, { useEffect, useRef, useState } from "react";
import {
	getForeignerReservation,
	patchForeignerReservationPermission,
} from "../../../modules/hooks/useAxios";
import { useSelector } from "react-redux";
import { selectUser } from "../../../redux/userSlice/userSlice";
import { useHistory } from "react-router-dom";

/**
 * Modal - 신청 학생 명단보기
 * @param handleClose
 * @returns {JSX.Element}
 * @constructor
 */
export default function ShowList({ handleClose, sch_id, std_for_id, std_for_name }) {
	const [data, setData] = useState();
	const [studentList, setStudentList] = useState();
	const [permission, setPermission] = useState([]);
	const user = useSelector(selectUser);
	const history = useHistory();

	useEffect(() => {
		window.easydropdown.all();
		getForeignerReservation(sch_id, std_for_id && user.id, setData);
		console.log(sch_id);
		console.log(window.);
	}, []);
	useEffect(() => {
		if (data && data.data) {
			console.log(data.data);
			let array = [];
			data.data.forEach((v) => {
				array.push(v.std_kor_id);
			});
			setStudentList(array);
		}
		window.easydropdown.all();
	}, [data]);
	useEffect(() => {
		console.log(std_for_id, std_for_name);
	});
	return (
		<div className="popup list">
			<div className="top_tit">
				<div className="left">
					<p className="tit">신청 학생 명단보기</p>
					<p className="txt">
						{data && data.data ? data.data[0].sch_end_date : "nodata"}
					</p>
				</div>
				<p className="name">{std_for_name ? std_for_name : user.name}</p>
			</div>

			<div className="student_list">
				<ul>
					{data && data.data ? (
						data.data.map((v, index) => {
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
										>
											<option value={true} selected={permission}>
												승인
											</option>
											<option value={false} selected={!permission}>
												미승인
											</option>
										</select>
									</div>
								</li>
							);
						})
					) : (
						<>Loading</>
					)}
				</ul>
			</div>

			<div className="btn_area">
				<div className="bbtn white left">일괄승인</div>
				<div className="right">
					<div
						className="bbtn mint"
						onClick={() => {
							let permission_std_kor_id_list = [];
							let not_permission_std_kor_id_list = [];
							data.data.map((v) => {
								console.log(
									typeof document.getElementById(`${v.std_kor_id}`).value
								);
								if (document.getElementById(`${v.std_kor_id}`).value === "true") {
									permission_std_kor_id_list.push(v.std_kor_id);
								} else {
									not_permission_std_kor_id_list.push(v.std_kor_id);
								}
							});
							patchForeignerReservationPermission(
								sch_id,
								permission_std_kor_id_list,
								not_permission_std_kor_id_list
							);
							history.push("/");
						}}
					>
						저장
					</div>
					<div className="bbtn darkGray" onClick={handleClose}>
						닫기
					</div>
				</div>
			</div>
		</div>
	);
}
