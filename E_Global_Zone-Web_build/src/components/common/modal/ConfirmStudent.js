import React, { useEffect, useState } from "react";
import useClick from "../../../modules/hooks/useClick";
import {
	getAdminKoreanAccount,
	patchAdminKoreanAccount,
	deleteAdminKoreanAccount,
} from "../../../api/admin/korean";
import { useSelector } from "react-redux";
import { selectDept } from "../../../redux/confSlice/confSlice";

/**
 * Moadl - 학생 등록 승인
 * @param handleClose
 * @returns {JSX.Element}
 * @constructor
 */
export default function ConfirmStudent({ handleClose, reRender }) {
	const [korList, setKorList] = useState();
	const [pending, setPending] = useState(false);
	const dept = useSelector(selectDept);
	useEffect(() => {
		getAdminKoreanAccount().then((res) => setKorList(res.data));
		return reRender;
	}, []);
	useEffect(() => {
		pending && handleClose();
	}, [pending]);

	const handleConfirm = () => {
		let array = [];
		for (const key in document.getElementsByName("checkBox")) {
			if (document.getElementsByName("checkBox").hasOwnProperty(key)) {
				const element = document.getElementsByName("checkBox")[key];
				element.checked && array.push(element.value);
			}
		}
		patchAdminKoreanAccount({ approval: array }).then((res) => {
			setPending(true);
			alert(res.data.message);
		});
	};

	const handleClick = (e) => {
		if (e.target.value === "all") {
			for (const key in document.getElementsByName("checkBox")) {
				if (document.getElementsByName("checkBox").hasOwnProperty(key)) {
					const element = document.getElementsByName("checkBox")[key];
					element.checked = e.target.checked;
				}
			}
		}
	};

	return (
		<div className="popup approval">
			<div className="tit_area">
				<p className="tit">한국인 학생 등록 승인</p>
				<p className="person">
					신청인원 : <span>{korList && korList.data && korList.data.length}</span>명
				</p>
			</div>
			<div className="scroll_area">
				<table className="pop_table">
					<colgroup>
						<col width="10%" />
					</colgroup>
					<thead>
						<tr>
							<th scope="col">
								<div className="table_check">
									<input
										type="checkbox"
										id="a1"
										name=""
										onClick={handleClick}
										value="all"
									/>
									<label htmlFor="a1"></label>
								</div>
							</th>
							<th scope="col">계열학과</th>
							<th scope="col">교번</th>
							<th scope="col">이름</th>
							<th scope="col">연락처</th>
							<th scope="col">G Suite 계정</th>
							<th scope="col">삭제</th>
						</tr>
					</thead>
					<tbody>
						{korList &&
							korList.data &&
							korList.data.length > 0 &&
							korList.data.map((v) => (
								<tr>
									<td>
										<div className="table_check">
											<input
												type="checkbox"
												id={v.std_kor_id}
												name="checkBox"
												value={v.std_kor_id}
											/>
											<label htmlFor={v.std_kor_id}></label>
										</div>
									</td>
									<td>{dept[parseInt(v.std_kor_dept) - 1].dept_name[1]}</td>
									<td>{v.std_kor_id}</td>
									<td>{v.std_kor_name}</td>
									<td>{v.std_kor_phone}</td>
									<td>{v.std_kor_mail}</td>
									<td>
										<img
											style={{ cursor: "pointer" }}
											src="/global/img/row_del_btnOn.gif"
											art="삭제이미지"
											onClick={() => {
												if (
													window.confirm(
														`[경고]정말 삭제 하시겠습니까?\n교번 : ${v.std_kor_id}\n이름 : ${v.std_kor_name}`
													) === true
												) {
													deleteAdminKoreanAccount(v.std_kor_id).then(
														(res) => {
															alert(res.data.message);
															setPending(true);
														}
													);
												}
											}}
										/>
									</td>
								</tr>
							))}
					</tbody>
				</table>
			</div>

			<div className="btn_area">
				<div href="" className="bbtn blue" onClick={handleConfirm}>
					등록하기
				</div>
				{/* <div className="bbtn white" onClick={handleClose}>
					닫기
				</div> */}
			</div>
		</div>
	);
}
