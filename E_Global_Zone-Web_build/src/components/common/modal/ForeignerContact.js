import React, { useEffect, useState } from "react";
import { getAdminForeigner } from "../../../api/admin/foreigner";

/**
 * Modal - 유학생 연락처
 * @param {array} list
 * @param handleClose
 * @returns {JSX.Element}
 * @constructor
 */
export default function ForeignerContact({ list, handleClose }) {
	const [data, setData] = useState();
	useEffect(() => {
		getAdminForeigner({ foreigners: list }).then((res) => setData(res.data));
	}, []);

	return (
		<div className="popup contact">
			<p className="tit">교수 연락처 정보</p>
			<div className="scroll_area">
				<table className="pop_table">
					<thead>
						<tr>
							<th scope="col">이름</th>
							<th scope="col">연락처</th>
							<th scope="col">이메일</th>
							<th scope="col">ZoomID</th>
						</tr>
					</thead>
					<tbody>
						{data &&
							data.data &&
							data.data.map((v) => {
								return (
									<tr>
										<td>{v.std_for_name}</td>
										<td>{v.std_for_phone}</td>
										<td>{v.std_for_mail}</td>
										<td>{v.std_for_zoom_id}</td>
									</tr>
								);
							})}
					</tbody>
				</table>
			</div>

			<div className="btn_area right">
				{/* <div className="bbtn darkGray" onClick={handleClose}>
					닫기
				</div> */}
			</div>
		</div>
	);
}
