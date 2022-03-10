import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getAdminForeignerAll, deleteAdminForeignerAccount } from "../../../api/admin/foreigner";
import { selectDept } from "../../../redux/confSlice/confSlice";

const DeleteForeignerStudent = ({ handleClose }) => {
	const dept = useSelector(selectDept);
	const [pending, setPending] = useState(false);
	const [forList, setForList] = useState();
	const [currentInfo, setCurrentInfo] = useState();
	const [defaultList, setDefaultList] = useState();
	const [searchMode, setSearchMode] = useState("std_for_name");

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

	const handleChange = (e) => {
		setCurrentInfo(forList.find(v => v.std_for_id == e.target.value))
	}

	const handleDelete = () => {
		console.log(currentInfo)

		const idConfirmed = window.confirm(`[경고] ${currentInfo.std_for_name} 학생의 계정을 정말로 삭제하시겠습니까?`)

		if (idConfirmed) {
			deleteAdminForeignerAccount(currentInfo.std_for_id).then((res) => {
				alert(`${currentInfo.std_for_name} 학생의 계정이 삭제되었습니다.`)
				setCurrentInfo(null)
				getAllUsers()
			})
				.catch((err) => {
					console.error(err)
				})
		}
	}

	const getAllUsers = () => {
		getAdminForeignerAll().then((res) => {
			setForList(res.data.data);
			setDefaultList(res.data.data);
			console.log(res.data.data);
		});
	}

	const findDeptName = (std_for_dept) => {
		if (!dept) return;
		return dept.find(dept => dept.dept_id === std_for_dept)?.dept_name[0];
	}

	useEffect(() => {
		getAllUsers()
	}, []);

	useEffect(() => {
		window.easydropdown.all();
	});

	return (
		<div className="popup regist">
			<p className="tit">유학생 계정 삭제</p>
			{
				currentInfo && (
					<table className="pop_table">
						<colgroup>
							<col width="5%" span="3" />
						</colgroup>
						<thead>
							<tr>
								<th scope="col">언어</th>
								<th scope="col">국가</th>
								<th scope="col">학번</th>
								<th scope="col">이름</th>
								<th scope="col">계열학과</th>
								<th scope="col">연락처</th>
								<th scope="col">이메일</th>
								<th scope="col">ZoomID</th>
								<th scope='col'>삭제</th>
							</tr>
						</thead>
						<tbody>
							<tr>
								<td>{currentInfo.std_for_lang}</td>
								<td>{currentInfo.std_for_country}</td>
								<td>{currentInfo.std_for_id}</td>
								<td>{currentInfo.std_for_name}</td>
								<td>{findDeptName(currentInfo.std_for_dept)}</td>
								<td>{currentInfo.contact.std_for_phone}</td>
								<td>{currentInfo.contact.std_for_mail}</td>
								<td>{currentInfo.contact.std_for_zoom_id}</td>
								<td>
									<img
										onClick={handleDelete}
										src="/global/img/delete_ico.gif"
										style={{ cursor: "pointer" }}
									/>
								</td>
							</tr>
						</tbody>
					</table>
				)
			}

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
							<th scope="col"></th>
							<th scope="col">언어</th>
							<th scope="col">국가</th>
							<th scope="col">학번</th>
							<th scope="col">이름</th>
							<th scope="col">계열학과</th>
							<th scope="col">연락처</th>
							<th scope="col">이메일</th>
							<th scope="col">ZoomID</th>
						</tr>
					</thead>
					<tbody>
						{
							forList &&
							forList.map((v) => (
								<tr>
									<td>
										<div className="table_check">
											<input
												type="checkbox"
												id={v.std_for_id}
												value={v.std_for_id}
												key={v.std_for_id}
												onChange={handleChange}
												checked={currentInfo?.std_for_id === v.std_for_id}
											/>
											<label htmlFor={v.std_for_id}></label>
										</div>
									</td>
									<td>{v.std_for_lang}</td>
									<td>{v.std_for_country}</td>
									<td>{v.std_for_id}</td>
									<td>{v.std_for_name}</td>
									<td>{findDeptName(v.std_for_dept)}</td>
									<td>{v.contact.std_for_phone}</td>
									<td>{v.contact.std_for_mail}</td>
									<td>{v.contact.std_for_zoom_id}</td>
								</tr>
							))}
					</tbody>
				</table>
			</div>
		</div>
	);
}

export default DeleteForeignerStudent