import React, { useEffect } from "react";

const Test = () => <>Test</>;

export default function Students() {
	useEffect(() => {
		window.easydropdown.all();
	}, []);
	return (
		<div className="content">
			<div className="sub_title">
				<div className="top_semester">
					<p className="tit">한국인 학생 관리</p>
					<select name="catgo" className="dropdown">
						<option>2020학년도 1학기</option>
						<option>2020학년도 여름학기</option>
						<option>2020학년도 2학기</option>
						<option>2020학년도 겨울학기</option>
					</select>
				</div>

				<div className="top_search">
					<select name="catgo" className="dropdown">
						<option>이름</option>
						<option>학번</option>
						<option>연락처</option>
					</select>
					<input type="text" />
					<input type="submit" value="검색" />
				</div>
			</div>

			<div className="wrap">
				<div className="scroll_area">
					<table className="student_manage_table">
						<thead>
							<tr>
								<th scope="col" className="bg align">
									계열학과{" "}
									<img
										src="/global/img/table_align_arrow.gif"
										alt="언어 기준 정렬"
									/>
								</th>
								<th scope="col" className="bg">
									학번
								</th>
								<th scope="col" className="bg">
									이름
								</th>
								<th scope="col" className="bg align">
									이용제한
									<img
										src="/global/img/table_align_arrow.gif"
										alt="언어 기준 정렬"
									/>
								</th>
								<th scope="col" className="bg">
									연락처
								</th>
								<th scope="col" className="bg">
									G Suite 계정
								</th>
								<th scope="col" className="bg align">
									활동 횟수{" "}
									<img
										src="/global/img/table_align_arrow.gif"
										alt="언어 기준 정렬"
									/>
								</th>
								<th scope="col" className="bg align">
									미참석 횟수{" "}
									<img
										src="/global/img/table_align_arrow.gif"
										alt="언어 기준 정렬"
									/>
								</th>
							</tr>
						</thead>
						<tbody>
							<tr>
								<td>컴정</td>
								<td>1901191</td>
								<td>이일영</td>
								<td>
									<div className="restriction">
										<img
											src="/global/img/restriction_off.png"
											alt="이용제한 해제"
											onClick={() => <Test />}
										/>
									</div>
								</td>
								<td>010-0000-0000</td>
								<td>zxc1234@g.yju.ac.kr</td>
								<td>1회</td>
								<td>-</td>
							</tr>
						</tbody>
					</table>
				</div>

				<div className="table_btn">
					<a href="#">신청 승인</a>
					<a href="#">CSV 다운</a>
				</div>
			</div>
		</div>
	);
}
