import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getAdminAllKorean, deleteAdminKoreanAccount } from "../../../api/admin/korean";
import { selectDept } from "../../../redux/confSlice/confSlice";

const DeleteKoreanStudent = () => {
	const dept = useSelector(selectDept);
	const [korList, setKorList] = useState();
	const [currentInfo, setCurrentInfo] = useState();
	const [defaultList, setDefaultList] = useState();
	const [searchMode, setSearchMode] = useState("std_kor_name");

	const handleSearch = (e) => {
		const term = e.target.value;
		let array = [];
		if (term === "") {
			setKorList(defaultList);
		} else {
			defaultList.forEach((v) => {
				let searchTerm = v[searchMode];

				if (typeof v[searchMode] === 'number') {
					searchTerm = v[searchMode].toString();
				}

				if (searchTerm.match(term)) {
					array.push(v);
				}
			});
			setKorList(array);
		}
	};

	const handleChange = (e) => {
		setCurrentInfo(korList.find(v => v.std_kor_id == e.target.value))
	}

	const handleDelete = () => {
		console.log(currentInfo)

		const idConfirmed = window.confirm(`[경고] ${currentInfo.std_kor_name} 학생의 계정을 정말로 삭제하시겠습니까?`)

		if (idConfirmed) {
			deleteAdminKoreanAccount(currentInfo.std_kor_id).then((res) => {
				alert(`${currentInfo.std_kor_name} 학생의 계정이 삭제되었습니다.`)
				setCurrentInfo(null)
				getAllUsers()
			})
				.catch((err) => {
					console.error(err)
				})
		}
	}

	const getAllUsers = () => {
		getAdminAllKorean().then((res) => {
			setKorList(res.data.data);
			setDefaultList(res.data.data);
			console.log(res.data.data);
		});
	}

	const findDeptName = (std_kor_dept) => {
		if (!dept) return;
		return dept.find(dept => dept.dept_id === std_kor_dept)?.dept_name[1];
	}

	useEffect(() => {
		getAllUsers()
	}, []);

	useEffect(() => {
		window.easydropdown.all();
	});

	return (
		<div className="popup regist">
			<p className="tit">한국인 학생 계정 삭제</p>
			{
				currentInfo && (
					<table className="pop_table">
						<colgroup>
							<col width="20%" span="1" />
							<col width="10%" span="1" />
							<col width="8%" span="1" />
							<col width="17%" span="1" />
							<col width="20%" span="1" />
						</colgroup>
						<thead>
							<tr>
								<th scope="col">계열학과</th>
								<th scope="col">학번</th>
								<th scope="col">이름</th>
								<th scope="col">연락처</th>
								<th scope="col">G Suite 계정</th>
								<th scope="col">이용제한</th>
								<th scope="col">승인여부</th>
								<th scope="col">삭제</th>
							</tr>
						</thead>
						<tbody>
							<tr>
								<td>{findDeptName(currentInfo.std_kor_dept)}</td>
								<td>{currentInfo.std_kor_id}</td>
								<td>{currentInfo.std_kor_name}</td>
								<td>{currentInfo.std_kor_phone}</td>
								<td>{currentInfo.std_kor_mail}</td>
								<td>{
									currentInfo.std_kor_state_of_restriction
										?
										<img
											src="/global/img/restriction_on.png"
											alt="이용제한"
										/>
										:
										<img
											src="/global/img/restriction_off.png"
											alt="이용제한"
										/>
								}</td>
								<td>{
									currentInfo.std_kor_state_of_permission
										?
										<img
											src="/global/img/sch_state_ico02.gif"
											alt="승인여부"
										/>
										: null
								}</td>
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
						<option value="std_kor_name">이름</option>
						<option value="std_kor_id">학번</option>
					</select>
					<input type="text" id="term" onChange={handleSearch} />
					<button>검색</button>
				</div>
			</div>

			<div className="scroll_area mt20">
				<table className="pop_table">
					<colgroup>
						<col width="5%" span="1" />
						<col width="20%" span="1" />
						<col width="10%" span="1" />
						<col width="8%" span="1" />
						<col width="17%" span="1" />
						<col width="20%" span="1" />
					</colgroup>
					<thead>
						<tr>
							<th scope="col"></th>
							<th scope="col">계열학과</th>
							<th scope="col">학번</th>
							<th scope="col">이름</th>
							<th scope="col">연락처</th>
							<th scope="col">G Suite 계정</th>
							<th scope="col">이용제한</th>
							<th scope="col">승인여부</th>
						</tr>
					</thead>
					<tbody>
						{
							korList &&
							korList.map((v) => (
								<tr>
									<td>
										<div className="table_check">
											<input
												type="checkbox"
												id={v.std_kor_id + "_delete"}
												value={v.std_kor_id}
												key={v.std_kor_id}
												onChange={handleChange}
												checked={currentInfo?.std_kor_id === v.std_kor_id}
											/>
											<label htmlFor={v.std_kor_id + "_delete"}></label>
										</div>
									</td>
									<td>{findDeptName(v.std_kor_dept)}</td>
									<td>{v.std_kor_id}</td>
									<td>{v.std_kor_name}</td>
									<td>{v.std_kor_phone}</td>
									<td>{v.std_kor_mail}</td>
									<td>{
										v.std_kor_state_of_restriction
											?
											<img
												src="/global/img/restriction_on.png"
												alt="이용제한"
											/>
											:
											<img
												src="/global/img/restriction_off.png"
												alt="이용제한"
											/>
									}</td>
									<td>{
										v.std_kor_state_of_permission
											?
											<img
												src="/global/img/sch_state_ico02.gif"
												alt="승인여부"
											/>
											: null
									}</td>
								</tr>
							))}
					</tbody>
				</table>
			</div>
		</div>
	);
}

export default DeleteKoreanStudent