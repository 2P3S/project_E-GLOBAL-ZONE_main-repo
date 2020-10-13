import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
	deleteAdminDeptList,
	patchAdminDeptList,
	postAdminDeptList,
} from "../../../api/admin/department";
import { getDepartment } from "../../../api/axios";
import { selectDept, setDept } from "../../../redux/confSlice/confSlice";

const PostDepartment = ({ handleClick, handleClose }) => (
	<div>
		<p className="tit">학과등록</p>
		<div className="gray_bg">
			<label htmlFor="">
				학과명 <input id="deptName" type="text" placeholder="학과명 입력" />
			</label>
			<label htmlFor="">
				줄임말 <input id="deptShort" type="text" placeholder="학과명 줄임말 입력" />
			</label>
			<div class="btn_area">
				<div
					class="bbtn mint"
					onClick={() => {
						handleClick({
							dept_name: `${document.getElementById("deptShort").value}_${
								document.getElementById("deptName").value
							}`,
						});
					}}
				>
					저장
				</div>
				<div class="bbtn red" onClick={handleClose}>
					취소
				</div>
			</div>
		</div>
	</div>
);
const PatchDepartment = ({ handleClick, dept, deptShort, dept_id, cancel }) => {
	return (
		<div>
			<p className="tit">학과수정</p>
			<div className="gray_bg">
				<label htmlFor="">
					학과명{" "}
					<input
						id="deptName"
						type="text"
						placeholder="학과명 입력"
						defaultValue={dept}
					/>
				</label>
				<label htmlFor="">
					줄임말{" "}
					<input
						id="deptShort"
						type="text"
						placeholder="학과명 줄임말 입력"
						defaultValue={deptShort}
					/>
				</label>
				<div class="btn_area">
					<div
						class="bbtn mint"
						onClick={() => {
							handleClick(dept_id, {
								dept_name: `${document.getElementById("deptShort").value}_${
									document.getElementById("deptName").value
								}`,
							});
						}}
					>
						수정
					</div>
					<div class="bbtn red" onClick={cancel}>
						취소
					</div>
				</div>
			</div>
		</div>
	);
};

export default function CreateDept({ handleClose }) {
	const department = useSelector(selectDept);
	const [departmentList, setDepartmentList] = useState(department);
	const [patchMode, setPatchMode] = useState(false);
	const [selectedDept, setSelectedDept] = useState();

	const dispatch = useDispatch();

	const rendering = () => {
		setDepartmentList([]);
		getDepartment().then((res) => {
			dispatch(setDept(res.data));
		});
	};

	const handleSelect = (dept, deptShort, dept_id) => {
		setSelectedDept({ dept, deptShort, dept_id });
		setPatchMode(true);
	};

	const handleDelete = (dept_id) => {
		window.confirm("정말 삭제하시겠습니까?") &&
			deleteAdminDeptList(dept_id).then((res) => {
				rendering();
			});
	};

	const patchDept = (dept_id, data) => {
		patchAdminDeptList(dept_id, data).then((res) => {
			setPatchMode(false);
			rendering();
		});
	};
	const postDept = (data) => {
		postAdminDeptList(data).then((res) => {
			rendering();
		});
	};

	useEffect(() => {
		rendering();
	}, []);

	useEffect(() => {
		setDepartmentList(department);
	}, [department]);

	return (
		<div className="popup depart_regist">
			{patchMode ? (
				<PatchDepartment
					{...selectedDept}
					cancel={() => {
						setPatchMode(false);
					}}
					handleClick={patchDept}
					rendering
				/>
			) : (
				<PostDepartment handleClick={postDept} handleClose />
			)}
			<div class="depart_list_box">
				<div class="scroll_area">
					<table>
						<thead>
							<tr>
								<th scope="col">학과명</th>
								<th scope="col">줄임말</th>
								<th scope="col">수정</th>
								<th scope="col">삭제</th>
							</tr>
						</thead>
						<tbody>
							{departmentList &&
								departmentList.map((v) => {
									return (
										<tr>
											<td>{v.dept_name[1]}</td>
											<td>{v.dept_name[0]}</td>
											<td>
												<div
													class="btn"
													onClick={() => {
														handleSelect(
															v.dept_name[1],
															v.dept_name[0],
															v.dept_id
														);
													}}
												>
													<img
														src="/global/img/modify_ico.gif"
														alt="수정"
													/>
												</div>
											</td>
											<td>
												<div
													class="btn"
													onClick={() => handleDelete(v.dept_id)}
												>
													<img
														src="/global/img/delete_ico.gif"
														alt="삭제"
													/>
												</div>
											</td>
										</tr>
									);
								})}
						</tbody>
					</table>
				</div>
			</div>
		</div>
		// </div>
	);
}
