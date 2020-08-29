import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectDept } from "../../../redux/confSlice/confSlice";
import { postAdminForeignerAccount } from "../../../modules/hooks/useAxios";
import { useHistory } from "react-router-dom";

const InsertForeignerStudent = ({ handleClose }) => {
	const [id, setId] = useState();
	const [dept, setDept] = useState();
	const [name, setName] = useState();
	const [language, setLanguage] = useState();
	const [country, setCountry] = useState();
	const [phone, setPhone] = useState();
	const [mail, setMail] = useState();
	const [zoomId, setZoomId] = useState();

	const [state, setState] = useState(false);
	const history = useHistory();

	const departmentList = useSelector(selectDept);

	const handleChange = (e, setValue) => {
		e.preventDefault();
		setValue(e.target.value);
	};
	/*
	 *   @todo 유효성 검
	 */
	const handleSave = () => {
		console.log(departmentList);
		departmentList.forEach((v) => {
			if (v.dept_name[0] === dept || v.dept_name[1] === dept) {
				setDept(v.dept_id);
			}
		});
		handleClose();
	};

	useEffect(() => {
		if (typeof dept === "number") {
			postAdminForeignerAccount(
				id,
				dept,
				name,
				language,
				country,
				phone,
				mail,
				zoomId,
				setState
			);
		}
	}, [dept]);

	useEffect(() => {
		if (state) {
			history.push("/students/now/foreigner");
		}
		return () => {
			history.push("/students/now/foreigner");
		};
	}, [state]);
	useEffect(() => {
		window.easydropdown.all();
	}, []);
	{
		/* <input
        type="text"
        placeholder="언어 입력"
        onChange={(e) => {
            handleChange(e, setLanguage);
        }}
    /> */
	}
	return (
		<div className="popup account">
			<p className="tit">유학생 계정 생성</p>
			<div className="input_area">
				<table>
					<colgroup>
						<col width="25%" span="4" />
					</colgroup>
					<tbody>
						<tr>
							<td>
								<p>언어</p>

								<select
									onChange={(e) => {
										handleChange(e, setLanguage);
									}}
								>
									<option value="영어">영어</option>
									<option value="일본어">일본어</option>
									<option value="중국어">중국어</option>
								</select>
							</td>
							<td>
								<p>국가</p>
								<input
									type="text"
									onChange={(e) => {
										handleChange(e, setCountry);
									}}
								/>
							</td>
							<td>
								<p>학번</p>
								<input
									type="text"
									onChange={(e) => {
										handleChange(e, setId);
									}}
								/>
							</td>
							<td>
								<p>이름</p>
								<input
									type="text"
									onChange={(e) => {
										handleChange(e, setName);
									}}
								/>
							</td>
						</tr>
						<tr>
							<td>
								<p>학과</p>
								<select
									onChange={(e) => {
										handleChange(e, setDept);
									}}
								>
									{departmentList &&
										departmentList.map((v) => {
											return (
												<option value={v.dept_name[1]}>
													{v.dept_name[1]}
												</option>
											);
										})}
								</select>
							</td>
							<td>
								<p>연락처</p>
								<input
									type="text"
									onChange={(e) => {
										handleChange(e, setPhone);
									}}
								/>
							</td>
							<td>
								<p>이메일</p>
								<input
									type="text"
									onChange={(e) => {
										handleChange(e, setMail);
									}}
								/>
							</td>
							<td>
								<p>ZoomID</p>
								<input
									type="text"
									onChange={(e) => {
										handleChange(e, setZoomId);
									}}
								/>
							</td>
						</tr>
					</tbody>
				</table>
			</div>

			<div className="btn_area right">
				<div className="bbtn blue" onClick={handleSave}>
					계정 생성하기
				</div>
				<div className="bbtn darkGray" onClick={handleClose}>
					닫기
				</div>
			</div>
		</div>
	);
};

export default InsertForeignerStudent;
