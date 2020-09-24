import React, { useEffect, useState } from "react";
import {
	getAdminScheduleUnapproved,
	patchAdminScheduleApproval,
} from "../../../api/admin/schedule";
import Modal from "./Modal";
import useModal from "../../../modules/hooks/useModal";
import Loader from "../Loader";

export default function PermissionScheduleResult({
	date,
	handleClose,
	sch_id = null,
	reRender = () => {},
}) {
	const [data, setData] = useState();
	const [pending, setPending] = useState(false);
	const [loading, setLoading] = useState(true);
	const [selectIndex, setSelectIndex] = useState(0);
	const [selectedImgSrc, setSelectedImgSrc] = useState();
	const [selectedSch, setSelectedSch] = useState(sch_id);
	const { isOpen, handleClose: handleCloseForImg, handleOpen } = useModal();
	useEffect(() => {
		getAdminScheduleUnapproved(date, 0).then((res) => {
			setData(res.data);
			setLoading(false);
		});
		return reRender;
	}, []);
	useEffect(() => {
		window.easydropdown.all();
	});
	useEffect(() => {
		if (pending) {
			if (data.data.length === 1) {
				handleClose();
			}
			data.data.splice(selectIndex, 1);
			// setData({ ...data, data: data.data.splice(selectIndex, 1) });
			setPending(false);
			setSelectIndex(0);
		}
	}, [pending]);

	return loading ? (
		<Loader />
	) : (
		<div className="popup not_attend">
			<div className="left_wrap">
				<p className="tit">미승인 출석결과 목록</p>
				<table className="pop_table3">
					<colgroup>
						<col width="15%" />
					</colgroup>
					<thead>
						<tr>
							<th scope="col">순번</th>
							<th scope="col">일시</th>
							<th scope="col">유학생 이름</th>
						</tr>
					</thead>
					<tbody>
						{data &&
							data.data &&
							data.data.map((v, index) => {
								if (v.sch_state_of_permission === true) {
									return;
								} else
									return (
										<tr
											key={v.sch_id}
											onClick={() => {
												setSelectIndex(index);
												setSelectedSch(v.sch_id);
											}}
											style={{
												cursor: "pointer",
												backgroundColor:
													v.sch_id === selectedSch ? "#faf3dd" : "",
											}}
										>
											<td>{index + 1}</td>
											<td>
												{v.sch_start_date.substr(0, 16)} ~{" "}
												{v.sch_end_date.substr(11, 5)}
											</td>
											<td>{v.std_for_name}</td>
										</tr>
									);
							})}
					</tbody>
				</table>
			</div>

			<div className="right_wrap">
				<p className="tit">학생 목록</p>

				<div className="student_list">
					<ul>
						{data &&
							data.data &&
							data.data[selectIndex].student_korean.map((v) => {
								return (
									<li>
										<div className="student">
											<p className="name">
												{v.std_kor_name || "삭제 된 학생"}
											</p>
											<select
												name="catgo"
												className="dropdown"
												id={`${v.std_kor_id}`}
											>
												<option
													value="attendance"
													selected={v.res_state_of_attendance}
												>
													출석
												</option>
												<option
													value="absent"
													selected={!v.res_state_of_attendance}
												>
													결석
												</option>
											</select>
										</div>
									</li>
								);
							})}
					</ul>
				</div>

				<ul className="img_file">
					<li>
						<p className="file_no">파일 첨부 1</p>
						<p
							className="file_name"
							onClick={() => {
								setSelectedImgSrc(data.data[selectIndex].start_img_url);
								handleOpen();
							}}
						>
							{data && data.data && data.data[selectIndex].sch_start_date} 사진
						</p>
						{/* <div className="del">
							<img src="/global/img/img_list_del.gif" alt="첨부 이미지 파일 삭제" />
						</div> */}
					</li>
					<li>
						<p className="file_no">파일 첨부 2</p>
						<p
							className="file_name"
							onClick={() => {
								setSelectedImgSrc(data.data[selectIndex].end_img_url);
								handleOpen();
							}}
						>
							{data && data.data && data.data[selectIndex].sch_end_date} 사진
						</p>
						{/* <div className="del">
							<img src="/global/img/img_list_del.gif" alt="첨부 이미지 파일 삭제" />
						</div> */}
					</li>
				</ul>

				<p className="attend_rate">
					출석율 :{" "}
					<span>
						{data &&
							data.data &&
							(() => {
								let percent = 0;
								let countOfAll = data.data[selectIndex].student_korean.length;
								let countOfAttendance = 0;
								for (
									let i = 0;
									i < data.data[selectIndex].student_korean.length;
									i++
								) {
									if (
										data.data[selectIndex].student_korean[i]
											.res_state_of_attendance === 1
									) {
										countOfAttendance++;
									}
								}
								percent = (countOfAttendance / countOfAll) * 100;
								return percent;
							})()}
					</span>
					%
				</p>

				<div className="btn_area right">
					<div
						className="bbtn mint"
						onClick={() => {
							let absent = [];
							let attendance = [];
							data.data[selectIndex].student_korean.map((v) => {
								if (document.getElementById(v.std_kor_id).value === "attendance") {
									attendance.push(v.std_kor_id);
								} else {
									absent.push(v.std_kor_id);
								}
							});
							patchAdminScheduleApproval(data.data[selectIndex].sch_id, {
								absent,
								attendance,
							}).then((res) => {
								// setPending(true);
								handleClose();
								alert(res.data.message);
							});
						}}
					>
						승인
					</div>
					{/* <div className="bbtn darkGray" onClick={handleClose}>
						닫기
					</div> */}
				</div>
			</div>
			<Modal isOpen={isOpen} handleClose={handleCloseForImg}>
				<img src={selectedImgSrc} onClick={handleCloseForImg} />
			</Modal>
		</div>
	);
}
