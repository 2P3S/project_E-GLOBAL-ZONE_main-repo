import React, { useEffect, useState, useRef } from "react";

export default function Notice() {
	useEffect(() => {});
	return (
		<div className="content">
			<div className="sub_title">
				<div className="top_semester">
					<p className="tit">공지사항 관리</p>
				</div>
			</div>

			<div className="wrap">
				<div className="scroll_area">
					<table className="student_manage_table">
						<colgroup>
							<col width="10%" />
							<col width="12%" />
							<col width="15%" />
						</colgroup>
						<thead>
							<tr>
								<th scope="col" className="bg align">
									번호
									<img
										src="/global/img/table_align_arrow.gif"
										alt="언어 기준 정렬"
									/>
								</th>
								<th scope="col" className="bg">
									작성일
								</th>
								<th scope="col" className="bg">
									제목
								</th>
								<th scope="col" className="bg">
									수정
								</th>
								<th scope="col" className="bg">
									삭제
								</th>
							</tr>
						</thead>
						<tbody>
							<tr>
								<td></td>
								<td>{}</td>
								<td>{}</td>
								<td>{}</td>
								<td>{}</td>
							</tr>
						</tbody>
					</table>
				</div>
				<span id="pagenation"></span>

				<div className="table_btn">
					<div>글쓰기</div>
					{/* <div>한국인 학생 목록 저장</div> */}
				</div>
			</div>
		</div>
	);
}
