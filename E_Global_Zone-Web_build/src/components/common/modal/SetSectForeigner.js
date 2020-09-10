import React, { useEffect, useState } from "react";
import { getAdminForeignerNoWork, postAdminForeignerWork } from "../../../api/admin/foreigner";
import { useSelector } from "react-redux";
import { selectDept } from "../../../redux/confSlice/confSlice";

export default function SetSectForeigner({ sect_id, handleClose, reRender }) {
	const dept = useSelector(selectDept);
	const [forList, setForList] = useState();
	const [defaultList, setDefaultList] = useState();
	const [isDone, setIsDone] = useState(false);
	const [pending, setPending] = useState(false);
	useEffect(() => {
		getAdminForeignerNoWork(sect_id).then((res) => {
			setForList(res.data.data);
			setDefaultList(res.data.data);
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
				if (v.std_for_name.match(term)) {
					array.push(v);
				}
			});
			setForList(array);
		}
	};

	return (
		<div className="popup regist">
			<p className="tit">유학생 등록</p>

			<div className="search_box">
				<input type="text" id="term" onChange={handleSearch} />

				<button>검색</button>
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
									<td>{dept[parseInt(v.std_for_dept) - 1].dept_name[0]}</td>
									<td>{v.std_for_phone}</td>
									<td>{v.std_for_mail}</td>
									<td>{v.std_for_zoom_id}</td>
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
		</div>
	);
}
