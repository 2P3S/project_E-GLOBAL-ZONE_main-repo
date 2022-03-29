import React, { useEffect, useState } from "react";
import { getAdminForeignerNoWork, postAdminForeignerWork } from "../../../api/admin/foreigner";
import ModifyForeignerStudent from "./ModifyForeignerStudent";
import Modal from "./Modal";
import useModal from "../../../modules/hooks/useModal";
import { useSelector } from "react-redux";
import { selectDept } from "../../../redux/confSlice/confSlice";

export default function SetSectForeigner({ sect_id, handleClose, reRender, sect_name = "" }) {
	const dept = useSelector(selectDept);
	const [forList, setForList] = useState();
	const [defaultList, setDefaultList] = useState();
	const [isDone, setIsDone] = useState(false);
	const [currentInfo, setCurrentInfo] = useState();
	const [pending, setPending] = useState(false);
	const [searchMode, setSearchMode] = useState("std_for_name");
	const { isOpen, handleOpen, handleClose: handleCloseForModify } = useModal();
	useEffect(() => {
		getAdminForeignerNoWork(sect_id).then((res) => {
			setForList(res.data.data);
			setDefaultList(res.data.data);
			console.log(res.data.data);
			setPending(true);
		});
		return reRender;
	}, []);

	const handleCheckAll = () => {
		const allBox = document.getElementById("all");

		forList.forEach((v) => {
			let checkBox = document.getElementById(v.std_for_id);
			checkBox.checked = allBox.checked;
		});
	};

	useEffect(() => {
		if (pending) {
			setPending(true);
		}
	}, [pending]);
	useEffect(() => {
		window.easydropdown.all();
	});

	const handleSave = () => {
		let array = [];
		forList.forEach((v) => {
			let checkBox = document.getElementById(v.std_for_id);
			if (checkBox.checked) {
				array.push(v.std_for_id);
			}
		});
		if (array.length === 0) {
			alert("아무도 체크하지 않았습니다.");
		} else {
			// postAdminForeignerWork({ sect_id, foreigners: array }).then((res) => {
			// 	setIsDone(true);
			// });
			postAdminForeignerWork(sect_id, { foreigners: array }).then((res) => {
				setIsDone(true);
			});
		}
	};
	useEffect(() => {
		if (isDone) {
			handleClose();
		}
	}, [isDone]);
	const handleSearch = (e) => {
		const term = e.target.value;
		let array = [];
		if (term === "") {
			setForList(defaultList);
		} else {
			defaultList.forEach((v) => {
				if (v[searchMode].match(term)) {
					array.push(v);
				}
			});
			setForList(array);
		}
	};

	const findDeptName = (std_for_dept) => {
		if (!dept) return;
		return dept.find(dept => dept.dept_id === std_for_dept)?.dept_name[0];
	}

	return (
		<div className="popup regist">
			<p className="tit">{sect_name} 근로 유학생 등록</p>

			<div className="top_search">
				<div className="search_box">
					<select
						name="catgo"
						className="dropdown"
						onChange={(e) => {
							console.log(e.target.value);
							setSearchMode(e.target.value);
						}}
					>
						<option value="std_for_name">이름</option>
						<option value="std_for_lang">언어</option>
					</select>
					<input type="text" id="term" onChange={handleSearch} />
					<button>검색</button>
				</div>
			</div>

			<div className="scroll_area mt20">
				<table className="pop_table">
					<colgroup>
						<col width="5%" span="3" />
					</colgroup>
					<thead>
						<tr>
							<th scope="col">
								<div className="table_check" onClick={handleCheckAll}>
									<input type="checkbox" id="all" name="" />
									<label for="all"></label>
								</div>
							</th>
							<th scope="col">언어</th>
							<th scope="col">국가</th>
							<th scope="col">학번</th>
							<th scope="col">이름</th>
							<th scope="col">계열학과</th>
							<th scope="col">연락처</th>
							<th scope="col">이메일</th>
							<th scope="col">ZoomID</th>
							<th scope="col">수정</th>
						</tr>
					</thead>
					<tbody>
						{pending &&
							forList &&
							forList.map((v, index) => (
								<tr>
									<td>
										<div className="table_check">
											<input
												type="checkbox"
												id={v.std_for_id}
												key={v.std_for_id}
											/>
											<label htmlFor={v.std_for_id}></label>
										</div>
									</td>
									<td>{v.std_for_lang}</td>
									<td>{v.std_for_country}</td>
									<td>{v.std_for_id}</td>
									<td>{v.std_for_name}</td>
									<td>{findDeptName(v.std_for_dept)}</td>
									<td>{v.std_for_phone}</td>
									<td>{v.std_for_mail}</td>
									<td>{v.std_for_zoom_id}</td>
									<td>
										<img
											onClick={() => {
												setCurrentInfo(v);
												handleOpen();
											}}
											src="/global/img/modify_ico.gif"
											style={{ cursor: "pointer" }}
										/>
									</td>
								</tr>
							))}
					</tbody>
				</table>
			</div>
			<div className="btn_area right">
				<div className="bbtn darkGray" onClick={handleSave}>
					저장
				</div>
			</div>
			<Modal isOpen={isOpen} handleClose={handleCloseForModify}>
				<ModifyForeignerStudent
					handleClose={handleCloseForModify}
					currentInfo={currentInfo}
					reRender={handleClose}
				/>
			</Modal>
		</div>
	);
}
