import React, { useEffect, useState } from "react";
import useClick from "../../../modules/hooks/useClick";
import { getAdminKoreanAccount, patchAdminKoreanAccount } from "../../../api/admin/korean";
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
		console.log(korList);
	}, [korList]);
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
		patchAdminKoreanAccount({ approval: array }).then((res) => setPending(true));
	};

	const handleClick = (e) => {
		if (e.target.value === "all") {
			console.log(document.getElementsByName("checkBox"));
			for (const key in document.getElementsByName("checkBox")) {
				if (document.getElementsByName("checkBox").hasOwnProperty(key)) {
					const element = document.getElementsByName("checkBox")[key];
					element.checked = e.target.checked;
					console.log(element.value);
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
							<th scope="col">학번</th>
							<th scope="col">이름</th>
							<th scope="col">연락처</th>
							<th scope="col">G Suite 계정</th>
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
								</tr>
							))}
					</tbody>
				</table>
			</div>

			<div className="btn_area">
				<div href="" className="bbtn mint" onClick={handleConfirm}>
					등록
				</div>
				<div
					className="bbtn white"
					ref={useClick(() => {
						handleClose();
					})}
				>
					닫기
				</div>
			</div>
		</div>
	);
}
