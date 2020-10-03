import React, { useEffect, useState } from "react";
import validator from "validator";
import { useSelector } from "react-redux";
import { selectDept } from "../../../redux/confSlice/confSlice";
import {
	postAdminForeignerAccount,
	patchAdminForeignerAccount,
	deleteAdminForeignerAccount,
} from "../../../api/admin/foreigner";
import { useHistory } from "react-router-dom";
import { handleEnterKey } from "../../../modules/handleEnterKey";
import ModifyForeignerStudent from "./ModifyForeignerStudent";
import d3 from "d3-array";
const InsertForeignerStudent = ({ handleClose }) => {
	const [state, setState] = useState(false);
	const [insertMode, setInsertMode] = useState(true);
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
	const [isError, setIsError] = useState(false);
	const [pending, setPending] = useState(false);
	const [insertedList, setInsertedList] = useState([]);
	const [listCount, setListCount] = useState(0);
	const [currentInfo, setCurrentInfo] = useState({});
	const [index, setIndex] = useState(0);
	const [errorMsg, setErrorMsg] = useState([]);

	const handleChange = (e) => {
		e.preventDefault();
	};
	/*
	 *   @todo 유효성 검
	 */
	const handleSave = () => {
		let array = [];
		let _validator = false;
		setPending(true);
		document.getElementsByName("std_info").forEach((v) => {
			if (v.value === "" && _validator === false) {
				// alert("값을 입력해주세요");
				_validator = true;
			} else {
				array.push(validator.unescape(v.value));
			}
		});
		!_validator &&
			postAdminForeignerAccount({
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
					setInsertedList([
						...insertedList,
						{
							std_for_lang: array[0],
							std_for_country: array[1],
							std_for_id: parseInt(array[2]),
							std_for_name: array[3],
							std_for_dept: array[4],
							std_for_phone: array[5],
							std_for_mail: array[6],
							std_for_zoom_id: array[7],
						},
					]);
					setListCount(listCount++);
					document.getElementsByName("std_info").forEach((v) => {
						v.tagName !== "select" && (v.value = "");
					});
					setErrorMsg([]);
					buildTable();
				})
				.catch((error) => {
					error.response && setErrorMsg(Object.values(error.response.data.error));
				});
	};

	const handleDelete = (std_for_id, index) => {
		if (window.confirm("삭제하시겠습니까?"))
			deleteAdminForeignerAccount(std_for_id).then((res) => {
				alert(res.data.message);
				insertedList.splice(index, 1);
				buildTable();
				setInsertMode(true);
			});
	};
	const handleModify = (data, index) => {
		if (window.confirm("수정하시겠습니까??")) {
			setCurrentInfo(data);
			setInsertMode(false);
			setIndex(index);
		}
	};
	const buildTable = () => {
		let tbody = document.getElementById("tbody");
		tbody.innerHTML = "";
		{
			insertedList.map((v, index) => {
				let tr = document.createElement("tr");
				let std_for_lang = document.createElement("td");
				let std_for_country = document.createElement("td");
				let std_for_id = document.createElement("td");
				let std_for_name = document.createElement("td");
				let std_for_dept = document.createElement("td");
				let std_for_phone = document.createElement("td");
				let std_for_mail = document.createElement("td");
				let std_for_zoom_id = document.createElement("td");
				let modifybtn = document.createElement("td");
				let deletebtn = document.createElement("td");
				std_for_lang.innerText = v.std_for_lang;
				std_for_country.innerText = v.std_for_country;
				std_for_id.innerText = v.std_for_id;
				std_for_name.innerText = v.std_for_name;
				std_for_dept.innerText = v.std_for_dept;
				std_for_phone.innerText = v.std_for_phone;
				std_for_mail.innerText = v.std_for_mail;
				std_for_zoom_id.innerText = v.std_for_zoom_id;
				let modifyImg = document.createElement("img");
				let deleteImg = document.createElement("img");
				modifyImg.src = "/global/img/insert_foreigner_modify.png";
				modifyImg.alt = "등록 유학생 정보 수정";
				deleteImg.src = "/global/img/insert_foreigner_del.png";
				deleteImg.alt = "등록 유학생 정보 삭제";

				modifyImg.addEventListener("click", () => handleModify(v, index));
				deleteImg.addEventListener("click", () => handleDelete(v.std_for_id, index));

				modifybtn.appendChild(modifyImg);
				deletebtn.appendChild(deleteImg);

				tr.appendChild(std_for_lang);
				tr.appendChild(std_for_country);
				tr.appendChild(std_for_id);
				tr.appendChild(std_for_name);
				tr.appendChild(std_for_dept);
				tr.appendChild(std_for_phone);
				tr.appendChild(std_for_mail);
				tr.appendChild(std_for_zoom_id);
				tr.appendChild(modifybtn);
				tr.appendChild(deletebtn);
				tbody.appendChild(tr);
			});
		}
	};
	useEffect(() => {
		window.easydropdown.all();
	});
	useEffect(() => {
		insertedList && buildTable();
	}, [insertedList]);
	useEffect(() => {
		let error = document.getElementById("warning");
		if (errorMsg.length > 0) {
			error.innerHTML = "";
			error.className = "warn_txt";

			errorMsg.forEach((v) => {
				let span = document.createElement("span");
				span.innerText = `${v[0]}\n `;
				error.appendChild(span);
			});
		} else {
			error.innerHTML = "";
			error.className = "";
		}
	}, [errorMsg]);

	return (
		<>
			{insertMode ? (
				<div className="popup account">
					<div className="account_insert">
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
												onKeyUp={(e) => handleEnterKey(e, handleSave)}
												onChange={(e) => {
													e.target.value = validator.blacklist(
														e.target.value,
														specialChar
													);
												}}
											/>
										</td>
										<td>
											<p>학번</p>
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
												maxLength={7}
												key="학번"
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
															<option value={v.dept_id}>
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
												placeholder="'-' 을 뺀 전화번호 11자리"
											/>
										</td>
										<td>
											<p>카카오톡 ID</p>
											<input
												onKeyUp={(e) => handleEnterKey(e, handleSave)}
												type="text"
												id="std_for_mail"
												name="std_info"
												placeholder="4~15자의 영문과 숫자조합"
											/>
										</td>
										<td>
											<p>ZoomID</p>
											<input
												onKeyUp={(e) => handleEnterKey(e, handleSave)}
												type="text"
												id="std_for_zoom_id"
												name="std_info"
												onChange={(e) => {
													if (validator.isNumeric(e.target.value)) {
													} else {
														e.target.value = "";
													}
												}}
												maxLength={10}
												placeholder="ex)1234567890"
											/>
										</td>
									</tr>
								</tbody>
							</table>
							{/*  에러메세지 warn_txt */}
							<p id="warning"></p>
						</div>

						<div className="btn_area right">
							<div className="bbtn blue" onClick={handleSave}>
								계정 생성하기
							</div>
							{/* <div className="bbtn darkGray" onClick={handleClose}>
							닫기
						</div> */}
						</div>
					</div>
				</div>
			) : (
				<ModifyForeignerStudent
					currentInfo={currentInfo}
					handleClose={() => {
						setInsertMode(true);
						window.easydropdown.all();
					}}
					reRender={buildTable}
					setInsertedList={(obj) => {
						insertedList.splice(index, 1);
						setInsertedList([...insertedList, obj]);
					}}
					setErrorMsg={setErrorMsg}
				/>
			)}

			{/*  유학생 계정 생성 리스트 */}
			<div className="popup account">
				<div className="account_table">
					<div className="table_area scroll_area">
						<table>
							<colgroup>
								<col width="7%" />
							</colgroup>
							<thead>
								<tr>
									<th scope="col">언어</th>
									<th scope="col">국가</th>
									<th scope="col">학번</th>
									<th scope="col">이름</th>
									<th scope="col">계열학과</th>
									<th scope="col">연락처</th>
									<th scope="col">카카오톡 ID</th>
									<th scope="col">ZoomID</th>
									<th scope="col">수정</th>
									<th scope="col">삭제</th>
								</tr>
							</thead>
							<tbody id="tbody"></tbody>
						</table>
					</div>
				</div>
			</div>
		</>
	);
};

export default InsertForeignerStudent;
