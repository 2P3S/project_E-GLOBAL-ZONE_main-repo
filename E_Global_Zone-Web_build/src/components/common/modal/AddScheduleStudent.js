import React, { useState, useEffect } from "react";
import {
	postAdminKorean,
	postAdminScheduleAdd,
	getForeignerReservation,
} from "../../../modules/hooks/useAxios";

export default function AddScheduleStudent({ handleClose, sch_id, _setData, std_for_id }) {
	const [data, setData] = useState();
	const [result, setResult] = useState();

	const handleSearch = () => {
		const column_data = document.getElementById("term").value;
		let column = "std_kor_id";
		if (isNaN(parseInt(column_data))) {
			column = "std_kor_name";
		}
		postAdminKorean({ column, column_data }, setData);
	};

	const handleAdd = (e) => {
		const std_kor_id = e.target.children[0].value;
		postAdminScheduleAdd(sch_id, { std_kor_id }, setResult);
	};
	useEffect(() => {
		return () => {
			getForeignerReservation(sch_id, std_for_id, _setData);
		};
	}, []);

	useEffect(() => {
		// alert(data.data);
		console.log(data);
	}, [data]);
	useEffect(() => {
		if (result === "success") {
			handleClose();
		}
	}, [result]);
	return (
		<>
			<input type="text" placeholder="학생 이름 으로 검색 하기" id="term" />
			<button onClick={handleSearch}>검색</button>
			<div>
				{data &&
					data.data.map((v) => {
						return (
							<div>
								<span>{v.std_kor_id} ||</span>
								<span>{v.std_kor_name} ||</span>
								<span>
									<button onClick={handleAdd}>
										추가하기
										<input type="hidden" value={v.std_kor_id} />
									</button>
								</span>
							</div>
						);
					})}
			</div>
			<button onClick={handleClose}>취소</button>
		</>
	);
}
