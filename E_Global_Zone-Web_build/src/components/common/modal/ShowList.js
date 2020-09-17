import React, { useEffect, useState } from "react";
import { deleteAdminScheduleAdd, postAdminScheduleAdd } from "../../../api/admin/schedule";
import {
	getForeignerReservation,
	patchForeignerReservationPermission,
} from "../../../api/foreigner/reservation";
import { getAdminReservation, patchAdminReservationPermission } from "../../../api/admin/foreigner";
import { useSelector } from "react-redux";
import { selectUser } from "../../../redux/userSlice/userSlice";
import { useHistory } from "react-router-dom";
import conf from "../../../conf/conf";
import Modal from "./Modal";
import useModal from "../../../modules/hooks/useModal";
import AddScheduleStudent from "./AddScheduleStudent";
import DeleteModal from "./DeleteModal";

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
	const [selectedResId, setSelectedResId] = useState();
	const [studentList, setStudentList] = useState();
	const [permission, setPermission] = useState([]);
	const [pending, setPending] = useState(false);
	const user = useSelector(selectUser);
	const history = useHistory();
	const { isOpen, handleOpen, handleClose: thisHandleClose } = useModal();
	const {
		isOpen: isOpenForDelete,
		handleOpen: handleOpenForDelete,
		handleClose: handleCloseForDelete,
	} = useModal();

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
			setStudentList(array);
		}
		window.easydropdown.all();
	}, [data]);
	useEffect(() => {
		pending && handleClose();
	}, [pending]);

	const handleDelete = () => {
		deleteAdminScheduleAdd(selectedResId).then((res) => {
			handleCloseForDelete();
			alert(res.data.message);
		});
	};
	const handlePermissionAll = () => {
		if (data && data.data) {
			data.data.forEach((v) => {
				document.getElementById(v.std_kor_id).value = true;
			});
		}
	};

	const reRender = () => {
		getForeignerReservation(
			sch_id,
			user.userClass === conf.userClass.MANAGER ? std_for_id : user.id,
			setData
		);
	};

	return (
		<div className="popup enrol">
			<div className="top_tit">
				<div className="left">
					<p className="tit">신청 학생 명단보기</p>
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
											{user.userClass === conf.userClass.MANAGER && (
												<div
													class="del_btn"
													onClick={() => {
														handleOpenForDelete();
														setSelectedResId(v.res_id);
													}}
												>
													<img
														src="/global/img/enrol_del_btn.gif"
														alt="신청 학생 삭제"
													/>
												</div>
											)}
											<p className="name">{v.std_kor_name}</p>
											<select
												name={"catgo"}
												className={"dropdown"}
												id={v.std_kor_id}
												key={`${v.std_kor_id}`}
											>
												<option value={true} selected={permission}>
													동의
												</option>

												<option
													value={false}
													selected={!permission}
													disabled={
														user.userClass !== conf.userClass.MANAGER
													}
												>
													미동의
												</option>
											</select>
										</div>
									</li>
								);
							})}
							{user.userClass === conf.userClass.MANAGER && (
								<li>
									{user.userClass === conf.userClass.MANAGER && (
										<div onClick={handleOpen} class="add_student">
											학생 추가{" "}
											<img
												src="/global/img/add_student_ico.gif"
												alt="학생 추가 아이콘"
											/>
										</div>
									)}
								</li>
							)}
						</>
					) : (
						<>
							{user.userClass === conf.userClass.MANAGER && (
								<li>
									<div onClick={handleOpen} class="add_student">
										학생 추가{" "}
										<img
											src="/global/img/add_student_ico.gif"
											alt="학생 추가 아이콘"
										/>
									</div>
								</li>
							)}
						</>
					)}
				</ul>
			</div>

			<div className="btn_area">
				<div className="bbtn white left" onClick={handlePermissionAll}>
					일괄동의
				</div>
				<div className="right">
					<div
						className="bbtn mint"
						onClick={() => {
							let permission_std_kor_id_list = [];
							let not_permission_std_kor_id_list = [];
							data.data.map((v) => {
								if (document.getElementById(`${v.std_kor_id}`).value === "true") {
									permission_std_kor_id_list.push(v.std_kor_id);
								} else {
									not_permission_std_kor_id_list.push(v.std_kor_id);
								}
							});
							user.userClass === conf.userClass.MANAGER
								? patchAdminReservationPermission(sch_id, {
										permission_std_kor_id_list,
										not_permission_std_kor_id_list,
								  }).then((res) => {
										setPending(true);
										alert(res.data.message);
								  })
								: patchForeignerReservationPermission(sch_id, {
										permission_std_kor_id_list,
										not_permission_std_kor_id_list,
								  }).then((res) => {
										setPending(true);
										alert(res.data.message);
								  });
						}}
					>
						저장
					</div>
					<div className="bbtn darkGray" onClick={handleClose}>
						닫기
					</div>
				</div>
			</div>
			<Modal isOpen={isOpen} handleClose={thisHandleClose}>
				<AddScheduleStudent
					handleClose={thisHandleClose}
					sch_id={sch_id}
					std_for_id={user.userClass === conf.userClass.MANAGER ? std_for_id : user.id}
					_setData={setData}
				/>
			</Modal>
			<Modal isOpen={isOpenForDelete} handleClose={handleCloseForDelete}>
				<DeleteModal
					onSubmit={handleDelete}
					onCancel={handleCloseForDelete}
					handleReRender={reRender}
				/>
			</Modal>
		</div>
	);
}
