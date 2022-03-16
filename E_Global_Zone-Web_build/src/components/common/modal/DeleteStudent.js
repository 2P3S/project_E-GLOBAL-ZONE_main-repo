
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { deleteAdminForeignerAccount, postAdminForeignerSearch } from "../../../api/admin/foreigner";
import { deleteAdminKoreanAccount, postAdminKorean } from "../../../api/admin/korean";
import { handleEnterKey } from "../../../modules/handleEnterKey";
import { selectDept } from "../../../redux/confSlice/confSlice";

const DeleteStudent = ({ reRender, handleClose }) => {
	const dept = useSelector(selectDept);
	const termRef = useRef(null);
	const [isLoading, setIsLoading] = useState(false);
	const [korList, setKorList] = useState([]);
	const [forList, setForList] = useState([]);
	const [currentInfo, setCurrentInfo] = useState({});
	const [isKor, setIsKor] = useState('for');

	const handleSearch = () => {
		const column_data = termRef.current.value;
		setCurrentInfo({})
		if (column_data.trim() === '') {
			setIsLoading(false);
			setKorList([]);
			return;
		}
		setIsLoading(true);
		if (isKor === 'kor') { // 한국 학생 찾기
			postAdminKorean({ column: 'std_kor_id', column_data }).then((res) => {
				console.log(res.data)
				setKorList(res.data.data)
				setIsLoading(false);
			});
		} else { // if (isKor == 'for') 유학생 찾기
			postAdminForeignerSearch({ column: 'std_for_id', column_data }).then((res) => {
				console.log(res.data)
				setForList(res.data.data);
				setIsLoading(false);
			});
		}
	};

	const handleChange = (e) => {
		const value = JSON.parse(e.target.value)
		console.log(value)
		if (currentInfo[`std_${isKor}_id`] == value[`std_${isKor}_id`]) {
			setCurrentInfo({})
		} else {
			setCurrentInfo(value)
		}
	}

	const handleDelete = () => {
		if (!currentInfo[`std_${isKor}_id`]) return alert('학생을 선택해 주세요.')
		const idConfirmed = window.confirm(`[경고] ${currentInfo[`std_${isKor}_name`]} 학생의 계정을 정말로 삭제하시겠습니까? 관련된 모든 정보가 삭제됩니다.`)

		if (idConfirmed) {
			if (isKor === 'kor') { // 한국인 학생 계정 삭제
				deleteAdminKoreanAccount(currentInfo[`std_${isKor}_id`]).then(() => {
					alert(`${currentInfo[`std_${isKor}_name`]} 학생의 계정이 삭제되었습니다.`)
					handleClose()
				})
					.catch((err) => {
						console.error(err)
					})
			} else { // 유학생 계정 삭제
				deleteAdminForeignerAccount(currentInfo[`std_${isKor}_id`]).then(() => {
					alert(`${currentInfo[`std_${isKor}_name`]} 학생의 계정이 삭제되었습니다.`);
					handleClose();
				})
					.catch((err) => {
						console.error(err);
					});
			}

		}
	}

	const findDeptName = (std_dept) => {
		if (!dept) return;
		return dept.find(dept => dept.dept_id === std_dept)?.dept_name[1];
	}

	useEffect(() => {
		window.easydropdown.all();
		return reRender
	}, []);

	return (
		<div className="popup regist">
			<p className="tit">{isKor == 'kor' ? '한국 ' : '유'}학생 계정 삭제</p>
			<div className="top_search">
				<div className="search_box">
					<select
						name="student"
						className="dropdown"
						onChange={(e) => {
							console.log(e.target.value);
							setIsKor(e.target.value);
						}}
					>
						<option value='for'>유학생</option>
						<option value='kor'>한국인</option>
					</select>
					<input onKeyUp={(e) => handleEnterKey(e, handleSearch)} placeholder='학번을 입력해주세요.' type="text" ref={termRef} />
					<button onClick={handleSearch}>검색</button>
				</div>
			</div>

			<div style={{ marginBottom: '50px' }}>
				{isKor === 'kor'
					? (
						<KoreanTable
							isLoading={isLoading}
							isKor={isKor}
							korList={korList}
							handleChange={handleChange}
							findDeptName={findDeptName}
							currentInfo={currentInfo} />
					)
					: (
						<ForigenerTable
							isLoading={isLoading}
							isKor={isKor}
							forList={forList}
							handleChange={handleChange}
							findDeptName={findDeptName}
							currentInfo={currentInfo} />
					)}
			</div>
			<div className='setting_btn_wrap' style={{ marginBottom: '0px' }}>
				<div className='delete' onClick={handleDelete}>
					삭제
				</div>
			</div>
		</div>
	);
}

const ForigenerTable = ({ isKor, forList, handleChange, findDeptName, currentInfo }) => {
	return (
		<table className="pop_table">
			<colgroup>
				<col width="6%" span="2" />
				<col width="8%" span="1" />
				<col width="10%" span="1" />
				<col width="20%" span="1" />
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
					<th scope="col"></th>
				</tr>
			</thead>
			<tbody>
				{
					forList &&
					forList.map((v) => (
						<tr key={v.std_for_id}>
							<td>{v.std_for_lang}</td>
							<td>{v.std_for_country}</td>
							<td>{v.std_for_id}</td>
							<td>{v.std_for_name}</td>
							<td>{findDeptName(v.std_for_dept)}</td>
							<td>{v.contact.std_for_phone}</td>
							<td>{v.contact.std_for_mail}</td>
							<td>{v.contact.std_for_zoom_id}</td>
							<td>
								<div className="table_check">
									<input
										type="checkbox"
										id={v.std_for_id + "_delete"}
										value={JSON.stringify(v)}
										key={v.std_for_id}
										onChange={handleChange}
										checked={currentInfo[`std_${isKor}_id`] == v.std_for_id}
									/>
									<label htmlFor={v.std_for_id + "_delete"}></label>
								</div>
							</td>
						</tr>
					))}
			</tbody>
		</table>
	)
}

const KoreanTable = ({ isKor, korList, handleChange, findDeptName, currentInfo }) => {
	return (
		<table className="pop_table">
			<colgroup>
				<col width="25%" span="1" />
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
					<th scope="col"></th>
				</tr>
			</thead>
			<tbody>
				{
					korList &&
					korList.map((v) => (
						<tr key={v.std_kor_id}>
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
							<td>
								<div className="table_check">
									<input
										type="checkbox"
										id={v.std_kor_id + "_delete"}
										value={JSON.stringify(v)}
										key={v.std_kor_id}
										onChange={handleChange}
										checked={currentInfo[`std_${isKor}_id`] == v.std_kor_id}
									/>
									<label htmlFor={v.std_kor_id + "_delete"}></label>
								</div>
							</td>
						</tr>
					))}
			</tbody>
		</table>
	)
}

export default DeleteStudent