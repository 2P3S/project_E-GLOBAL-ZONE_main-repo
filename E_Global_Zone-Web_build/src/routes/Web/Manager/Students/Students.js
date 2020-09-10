import React, { useEffect, useState, useRef } from "react";
import Modal from "../../../../components/common/modal/Modal";
import ConfirmStudent from "../../../../components/common/modal/ConfirmStudent";
import useClick from "../../../../modules/hooks/useClick";
import ConfirmRestriction from "../../../../components/common/modal/ConfirmRestriction";
import ConfirmUnrestriction from "../../../../components/common/modal/ConfirmUnrestriction";
import useModal from "../../../../modules/hooks/useModal";
import {
	getAdminKorean,
	deleteAdminKoreanAccount,
	postAdminKorean,
} from "../../../../api/admin/korean";
import { selectDept } from "../../../../redux/confSlice/confSlice";
import { useDispatch, useSelector } from "react-redux";
import { selectData, setData } from "../../../../redux/managerSlice/managerSlice";
import conf from "../../../../conf/conf";
import { useParams, useHistory } from "react-router-dom";
import { handleEnterKey } from "../../../../modules/handleEnterKey";

class Student {
	dept;
	std_id;
	name;
	status;
	ph;
	count;
	absent;
	e_mail;

	/**
	 * Student Constructor
	 * @param {int} dept std_kor_dept
	 * @param {int} std_id std_kor_id
	 * @param {string} name std_kor_name
	 * @param {boolean} status std_kor_state_of_restriction
	 * @param {string} ph std_kor_phone
	 * @param {string} e_mail std_kor_mail
	 * @param {int} count std_kor_num_of_attendance
	 * @param {int} absent std_kor_num_of_absent
	 * @param {array} deptList state.conf.dept
	 */
	constructor(
		dept,
		std_id,
		name,
		status,
		ph,
		e_mail,
		count,
		absent,
		deptList,
		std_stricted_info = ""
	) {
		this.std_id = std_id;
		this.name = name;
		this.status = status;
		this.ph = ph;
		this.e_mail = e_mail;
		this.count = count;
		this.absent = absent;
		this._dept = deptList[dept - 1];
		this.std_stricted_info = std_stricted_info;
	}

	get dept() {
		return this._dept;
	}
}

class Data {
	get sort() {
		return this._sort;
	}

	set sort(value) {
		this._sort = value;
	}

	_sort = null;
	data = [];

	/**
	 * Data Constructor
	 * @param {[Student]} data
	 */
	constructor(data, sort = null) {
		this._sort = sort;
		this.data = data;
	}
}

/**
 * Manager :: 학생관리
 * @returns {JSX.Element}
 * @constructor
 */
export default function Students() {
	const params = useParams();
	const history = useHistory();
	const [resData, setResData] = useState();
	const [orderBy, setOrderBy] = useState([
		"std_kor_dept",
		"std_kor_state_of_restriction",
		"std_kor_num_of_attendance",
		"std_kor_num_of_absent",
	]);
	const [orderIndex, setOrderIndex] = useState(1);
	// department information
	const dept = useSelector(selectDept);
	const data = useSelector(selectData);
	const dispatch = useDispatch();

	const [isOpen, setIsOpen] = useState(false);
	const [selectedKor, setSelectedKor] = useState({ std_kor_id: "", std_kor_name: "" });
	const [pending, setPending] = useState(false);
	const [column, setColumn] = useState("std_kor_name");
	const {
		isOpen: isRestrict,
		handleOpen: hadleOpenForRestrict,
		handleClose: handleCloseForRestrict,
	} = useModal();
	const {
		isOpen: isUnrestrict,
		handleOpen: handleOpenForUnrestrict,
		handleClose: handleCloseForUnrestrict,
	} = useModal();

	/**
	 * api response done
	 */

	const reRender = () => {
		setPending(true);
	};

	useEffect(() => {
		window.easydropdown.all();
		setPending(true);
	}, []);

	useEffect(() => {
		if (Array.isArray(dept))
			if (resData && resData.data) {
				let dataArray = [];

				if (resData.data.data)
					resData.data.data.forEach((v) => {
						dataArray.push(
							new Student(
								v.std_kor_dept,
								v.std_kor_id,
								v.std_kor_name,
								v.std_kor_state_of_restriction,
								v.std_kor_phone,
								v.std_kor_mail,
								v.std_kor_num_of_attendance,
								v.std_kor_num_of_absent,
								dept,
								v.std_stricted_info
							)
						);
					});
				dispatch(setData(new Data(dataArray)));
				if (resData.data.last_page) {
					const pagenation = document.getElementById("pagenation");
					pagenation.innerHTML = "";
					let first = document.createElement("button");
					first.innerText = "<<";
					first.addEventListener("click", () => {
						history.push(`/students/1/korean`);
						history.push("/reload");
					});
					pagenation.appendChild(first);
					for (let i = 0; i < resData.data.last_page; i++) {
						let btn = document.createElement("button");
						btn.innerText = i + 1;
						btn.addEventListener("click", () => {
							history.push(`/students/${i + 1}/korean`);
							setPending(true);
						});
						pagenation.appendChild(btn);
					}
					let last = document.createElement("button");
					last.innerText = ">>";
					pagenation.appendChild(last);
					last.addEventListener("click", () => {
						history.push(`/students/${resData.data.last_page}/korean`);
					});
				}
			}
		// setDataSet(new Data(dataArray));
	}, [resData, dept]);

	useEffect(() => {
		if (pending) {
			getAdminKorean({ page: params.page, orderby: orderBy[orderIndex] }).then((res) => {
				setResData(res.data);
				setPending(false);
			});
		}
	}, [pending]);

	useEffect(() => {
		history.push(`/students/1/korean`);
		setPending(true);
	}, [orderIndex]);

	const handleSearch = () => {
		const column_data = document.getElementById("term").value;
		postAdminKorean({ column, column_data }).then((res) => setResData({ data: res.data }));
	};

	return (
		<div className="content">
			<div className="sub_title">
				<div className="top_semester">
					<p className="tit">한국인 학생 관리</p>
				</div>

				<div className="top_search">
					<select
						name="catgo"
						className="dropdown"
						onChange={(e) => {
							setColumn(e.target.value);
						}}
					>
						<option value="std_kor_name">이름</option>
						<option value="std_kor_id">학번</option>
						<option value="std_kor_phone">연락처</option>
					</select>
					<input onKeyUp={(e) => handleEnterKey(e, handleSearch)} type="text" id="term" />
					<input type="submit" value="검색" onClick={handleSearch} />
				</div>
			</div>

			<div className="wrap">
				<div className="scroll_area">
					<table className="student_manage_table">
						<colgroup>
							<col width="10%" />
							<col width="12%" />
							<col width="15%" />
						</colgroup>
						<thead>
							<tr>
								<th
									scope="col"
									className="bg align"
									ref={useClick(() => {
										setOrderIndex(0);
									})}
								>
									계열학과
									<img
										src="/global/img/table_align_arrow.gif"
										alt="언어 기준 정렬"
									/>
								</th>
								<th scope="col" className="bg">
									학번
								</th>
								<th scope="col" className="bg">
									이름
								</th>
								<th
									scope="col"
									className="bg align"
									ref={useClick(() => setOrderIndex(1))}
								>
									이용제한
									<img
										src="/global/img/table_align_arrow.gif"
										alt="언어 기준 정렬"
									/>
								</th>
								<th scope="col" className="bg">
									연락처
								</th>
								<th scope="col" className="bg">
									G Suite 계정
								</th>
								<th
									scope="col"
									className="bg align"
									ref={useClick(() => {
										setOrderIndex(2);
									})}
								>
									활동 횟수
									<img
										src="/global/img/table_align_arrow.gif"
										alt="언어 기준 정렬"
									/>
								</th>
								<th
									scope="col"
									className="bg align"
									ref={useClick(() => {
										setOrderIndex(3);
									})}
								>
									미참석 횟수
									<img
										src="/global/img/table_align_arrow.gif"
										alt="언어 기준 정렬"
									/>
								</th>
							</tr>
						</thead>
						<tbody>
							{data &&
								data.data.map((v, index) => (
									<tr key={v.std_id} className={v.status ? "restriction_on" : ""}>
										<td>
											{typeof v.dept === "object" ? v.dept.dept_name[0] : ""}
										</td>
										<td>{v.std_id}</td>
										<td
											className="name"
											onClick={() => {
												if (
													window.confirm(
														`[경고]정말 삭제 하시겠습니까?\n학번 : ${v.std_id}\n이름 : ${v.name}`
													) === true
												) {
													deleteAdminKoreanAccount(v.std_id).then(
														(res) => {
															setPending(true);
														}
													);
												}
											}}
										>
											{v.name}
											{/* <div className="hover_off" id={`hover_btn_${index}`}>
												<div className="area">
													{v.status ? (
														<>
															<div
																className="mint"
																onClick={() => {
																	setSelectedKor({
																		std_kor_id: v.std_id,
																		std_kor_name: v.name,
																		std_stricted_info:
																			v.std_stricted_info,
																	});
																	handleOpenForUnrestrict();
																}}
															>
																이용제한 해제
															</div>
														</>
													) : (
														<>
															<div
																className="mint"
																onClick={() => {
																	setSelectedKor({
																		std_kor_id: v.std_id,
																		std_kor_name: v.name,
																	});
																	hadleOpenForRestrict();
																}}
															>
																이용제한
															</div>
														</>
													)}
													<div className="lightGray">삭제</div>
												</div>
											</div> */}
										</td>
										<td>
											{v.status ? (
												<div
													className="restriction"
													onClick={() => {
														setSelectedKor({
															std_kor_id: v.std_id,
															std_kor_name: v.name,
															std_stricted_info: v.std_stricted_info,
														});
														handleOpenForUnrestrict();
													}}
												>
													<img
														src="/global/img/restriction_on.png"
														alt="이용제한"
													/>
												</div>
											) : (
												<div
													className="restriction"
													onClick={() => {
														setSelectedKor({
															std_kor_id: v.std_id,
															std_kor_name: v.name,
														});
														hadleOpenForRestrict();
													}}
												>
													<img
														src="/global/img/restriction_off.png"
														alt="이용제한 해제"
													/>
												</div>
											)}
										</td>
										<td>{v.ph}</td>
										<td>{v.e_mail}</td>
										<td>{v.count}회</td>
										<td>{v.absent}회</td>
									</tr>
								))}
						</tbody>
					</table>
				</div>
				<span id="pagenation"></span>

				<div className="table_btn">
					<div
						ref={useClick(() => {
							setIsOpen(true);
						})}
					>
						신청 승인
					</div>
					{/*<div*/}
					{/*	ref={useClick(function () {*/}
					{/*		alert("엑셀 다운");*/}
					{/*	})}*/}
					{/*>*/}
					{/*	CSV 다운*/}
					{/*</div>*/}
				</div>
			</div>
			<Modal
				isOpen={isOpen}
				hadleClose={() => {
					setIsOpen(false);
				}}
			>
				<ConfirmStudent
					reRender={reRender}
					handleClose={() => {
						setIsOpen(false);
					}}
				/>
			</Modal>
			<Modal isOpen={isUnrestrict} onRequestClose={handleCloseForUnrestrict}>
				<ConfirmUnrestriction
					std_kor_name={selectedKor.std_kor_name}
					std_kor_id={selectedKor.std_kor_id}
					std_stricted_info={selectedKor.std_stricted_info}
					handleClose={handleCloseForUnrestrict}
					reRender={reRender}
				/>
			</Modal>
			<Modal isOpen={isRestrict} onRequestClose={handleCloseForRestrict}>
				<ConfirmRestriction
					handleClose={handleCloseForRestrict}
					std_kor_id={selectedKor.std_kor_id}
					std_kor_name={selectedKor.std_kor_name}
					reRender={reRender}
				/>
			</Modal>
		</div>
	);
}
