import React, { useEffect, useState } from "react";
import validator from "validator";
import { useSelector } from "react-redux";
import { selectDept } from "../../../redux/confSlice/confSlice";
import { updateAdminForeignerAccount } from "../../../api/admin/foreigner";
import { useHistory } from "react-router-dom";
import { handleEnterKey } from "../../../modules/handleEnterKey";
import { current } from "@reduxjs/toolkit";

const InsertForeignerStudent = ({
	currentInfo,
	handleClose,
	reRender,
	setInsertedList = () => {},
	setErrorMsg = () => {},
}) => {
	const [state, setState] = useState(false);
	const history = useHistory();
	const specialChar = [
		"@",
		"#",
		"$",
		"%",
		"^",
		"&",
		"*",
		"(",
		")",
		"_",
		"?",
		">",
		"<",
		"/",
		",",
		".",
		"~",
		"!",
		'"',
		"₩",
		"`",
		";",
		":",
		"\\[",
		"\\]",
		"\\{",
		"\\}",
		"\\",
		"|",
		"=",
		"-",
	];
	const departmentList = useSelector(selectDept);

	const handleChange = (e) => {
		e.preventDefault();
	};
	/*
	 *   @todo 유효성 검
	 */
	const handleSave = () => {
		let array = [];
		let _validator = false;

		document.getElementsByName("std_info").forEach((v) => {
			if (v.value === "" && _validator === false && v.id !== "std_for_phone") {
				alert("값을 입력해주세요");
				_validator = true;
			} else {
				array.push(validator.unescape(v.value));
			}
		});
		!_validator &&
			updateAdminForeignerAccount(currentInfo.std_for_id, {
				std_for_lang: array[0],
				std_for_country: array[1],
				std_for_id: parseInt(array[2]),
				std_for_name: array[3],
				std_for_dept: array[4],
				std_for_phone: array[5],
				std_for_mail: array[6],
				std_for_zoom_id: array[7],
			})
				.then((res) => {
					setState(res.data);
					alert(res.data.message);
					setInsertedList({
						std_for_lang: array[0],
						std_for_country: array[1],
						std_for_id: parseInt(array[2]),
						std_for_name: array[3],
						std_for_dept: array[4],
						std_for_phone: array[5],
						std_for_mail: array[6],
						std_for_zoom_id: array[7],
					});
				})
				.catch((error) => {
					error.response && setErrorMsg(Object.values(error.response.data.error));
				});
	};

	useEffect(() => {
		if (state) {
			handleClose();
		}
	}, [state]);
	useEffect(() => {
		window.easydropdown.all();
		console.log(currentInfo);
		return reRender;
	}, []);

	return (
		<div className="popup account">
			<div className="account_insert">
				<p className="tit">교수 계정 수정</p>
				<div className="input_area">
					{currentInfo && (
						<table>
							<colgroup>
								<col width="25%" span="4" />
							</colgroup>
							<tbody>
								<tr>
									<td>
										<p>언어</p>

										<select id="std_for_lang" name="std_info">
											<option
												value="영어"
												selected={currentInfo.std_for_lang === "영어"}
											>
												영어
											</option>
											<option
												value="일본어"
												selected={currentInfo.std_for_lang === "일본어"}
											>
												일본어
											</option>
											<option
												value="중국어"
												selected={currentInfo.std_for_lang === "중국어"}
											>
												중국어
											</option>
										</select>
									</td>
									<td>
										<p>국가</p>
										<input
											type="text"
											id="std_for_country"
											name="std_info"
											onKeyUp={(e) => handleEnterKey(e, handleSave)}
											onChange={(e) => {
												e.target.value = validator.blacklist(
													e.target.value,
													specialChar
												);
											}}
											defaultValue={currentInfo.std_for_country}
										/>
									</td>
									<td>
										<p>교번</p>
										<input
											onKeyUp={(e) => handleEnterKey(e, handleSave)}
											type="text"
											id="std_for_id"
											name="std_info"
											onChange={(e) => {
												if (validator.isNumeric(e.target.value)) {
												} else {
													e.target.value = "";
												}
											}}
											defaultValue={currentInfo.std_for_id}
											maxLength={7}
										/>
									</td>
									<td>
										<p>이름</p>
										<input
											onKeyUp={(e) => handleEnterKey(e, handleSave)}
											type="text"
											id="std_for_name"
											name="std_info"
											onChange={(e) => {
												e.target.value = validator.blacklist(
													e.target.value,
													specialChar
												);
											}}
											defaultValue={currentInfo.std_for_name}
										/>
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
														<option
															value={v.dept_id}
															selected={
																v.dept_id ===
																currentInfo.std_for_dept
															}
														>
															{v.dept_name[1]}
														</option>
													);
												})}
										</select>
									</td>
									<td>
										<p>연락처</p>
										<input
											onKeyUp={(e) => handleEnterKey(e, handleSave)}
											type="text"
											id="std_for_phone"
											name="std_info"
											onChange={(e) => {
												if (
													validator.isMobilePhone(
														e.target.value,
														"ko-KR"
													) &&
													validator.isNumeric(e.target.value) &&
													validator.isLength(e.target.value, 11)
												) {
													let first = e.target.value.substr(0, 3);
													let second = e.target.value.substr(3, 4);
													let third = e.target.value.substr(7, 4);
													e.target.value = `${first}-${second}-${third}`;
												}
											}}
											maxLength={11}
											defaultValue={currentInfo.std_for_phone}
										/>
									</td>
									<td>
										<p>카카오톡 ID</p>
										<input
											onKeyUp={(e) => handleEnterKey(e, handleSave)}
											type="text"
											id="std_for_mail"
											name="std_info"
											defaultValue={currentInfo.std_for_mail}
										/>
									</td>
									<td>
										<p>ZoomID</p>
										<input
											onKeyUp={(e) => handleEnterKey(e, handleSave)}
											type="text"
											id="std_for_zoom_id"
											name="std_info"
											maxLength={10}
											defaultValue={currentInfo.std_for_zoom_id}
										/>
									</td>
								</tr>
							</tbody>
						</table>
					)}
				</div>

				<div className="btn_area right">
					<div className="bbtn blue" onClick={handleSave}>
						계정 수정하기
					</div>

					{setErrorMsg === (() => {}) ? (
						<div className="bbtn darkGray" onClick={handleClose}>
							닫기
						</div>
					) : (
						<div className="bbtn darkGray" onClick={handleClose}>
							취소
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default InsertForeignerStudent;
