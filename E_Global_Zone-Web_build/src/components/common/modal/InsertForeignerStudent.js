import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectDept } from "../../../redux/confSlice/confSlice";
import { postAdminForeignerAccount } from "../../../api/admin/foreigner";
import { useHistory } from "react-router-dom";

const InsertForeignerStudent = ({ handleClose }) => {
	const [state, setState] = useState(false);
	const history = useHistory();

	const departmentList = useSelector(selectDept);

	const handleChange = (e) => {
		e.preventDefault();
	};
	/*
	 *   @todo 유효성 검
	 */
	const handleSave = () => {
		let array = [];
		document.getElementsByName("std_info").forEach((v) => {
			array.push(v.value);
		});
		postAdminForeignerAccount({
			std_for_lang: array[0],
			std_for_country: array[1],
			std_for_id: array[2],
			std_for_name: array[3],
			std_for_dept: array[4],
			std_for_phone: array[5],
			std_for_mail: array[6],
			std_for_zoom_id: array[7],
		}).then((res) => {
			setState(res.data);
		});
	};

	useEffect(() => {
		if (state) {
			handleClose();
		}
	}, [state]);
	useEffect(() => {
		window.easydropdown.all();
	}, []);

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

								<select id="std_for_lang" name="std_info">
									<option value="영어">영어</option>
									<option value="일본어">일본어</option>
									<option value="중국어">중국어</option>
								</select>
							</td>
							<td>
								<p>국가</p>
								<input
									type="text"
									id="std_for_country"
									name="std_info"
									onKeyPress={(e) => {
										console.log(e.keyCode);
										e.target.value = e.target.value;
									}}
									onChange={(e) => {
										console.log(e.target.value);
									}}
								/>
							</td>
							<td>
								<p>학번</p>
								<input type="text" id="std_for_id" name="std_info" />
							</td>
							<td>
								<p>이름</p>
								<input type="text" id="std_for_name" name="std_info" />
							</td>
						</tr>
						<tr>
							<td>
								<p>학과</p>
								<select
									onChange={(e) => {
										handleChange(e);
									}}
									id="std_for_dept"
									name="std_info"
								>
									{departmentList &&
										departmentList.map((v) => {
											return (
												<option value={v.dept_id}>{v.dept_name[1]}</option>
											);
										})}
								</select>
							</td>
							<td>
								<p>연락처</p>
								<input type="text" id="std_for_phone" name="std_info" />
							</td>
							<td>
								<p>이메일</p>
								<input type="text" id="std_for_mail" name="std_info" />
							</td>
							<td>
								<p>ZoomID</p>
								<input type="text" id="std_for_zoom_id" name="std_info" />
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
