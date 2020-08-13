import React, { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";

export default function Students() {
	const params = useParams();
	const valueOfParams = Object.entries(params);
	const [category, setCategory] = useState(valueOfParams[1][1]);
	const history = useHistory();
	useEffect(() => {
		if (category !== "korean" && category !== "foreigner") {
			history.push("/");
		}
		return () => {
			setCategory();
		};
	}, [category]);
	if (category && category === "foreigner") {
		return (
			<div>
				<div className="content">
					<div className="sub_title">
						<div className="top_semester">
							<p className="tit">유학생 관리</p>
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
								<colgroup>
									<col width="5%" />
									<col width="7%" span="3" />
									<col width="7%" />
									<col width="13%" />
									<col width="7%" />
									<col width="7%" span="6" />
								</colgroup>
								<thead>
									<tr>
										<th rowSpan="2">
											<div className="table_check">
												<input type="checkbox" id="a1" name="" />
												<label htmlFor="a1"></label>
											</div>
										</th>
										<th rowSpan="2" className="align">
											언어{" "}
											<img
												src="/global/img/table_align_arrow.gif"
												alt="언어 기준 정렬"
											/>
										</th>
										<th rowSpan="2" className="align">
											국가명{" "}
											<img
												src="/global/img/table_align_arrow.gif"
												alt="국가명 기준 정렬"
											/>
										</th>
										<th rowSpan="2" className="align">
											즐겨찾기{" "}
											<img
												src="/global/img/table_align_arrow.gif"
												alt="즐겨찾기 기준 정렬"
											/>
										</th>
										<th colSpan="3">유학생 정보</th>
										<th colSpan="4">활동시간</th>
										<th rowSpan="2" className="align">
											예약 미승인
											<br />
											횟수
											<img
												src="/global/img/table_align_arrow.gif"
												alt="예약 미승인 횟수 기준 정렬"
											/>
										</th>
										<th rowSpan="2" className="align">
											결과 지연
											<br />
											입력 횟수
											<img
												src="/global/img/table_align_arrow.gif"
												alt="결과 지연 입력 횟수 기준 정렬"
											/>
										</th>
									</tr>
									<tr>
										<th>학번</th>
										<th>이름</th>
										<th rowSpan="2" className="align">
											계열학과
											<img
												src="/global/img/table_align_arrow.gif"
												alt="계열학과 기준 정렬"
											/>
										</th>
										<th rowSpan="2" className="align">
											합계
											<img
												src="/global/img/table_align_arrow.gif"
												alt="합계 기준 정렬"
											/>
										</th>
										<th rowSpan="2" className="align">
											6월
											<img
												src="/global/img/table_align_arrow.gif"
												alt="6월 기준 정렬"
											/>
										</th>
										<th rowSpan="2" className="align">
											7월
											<img
												src="/global/img/table_align_arrow.gif"
												alt="7월 기준 정렬"
											/>
										</th>
										<th rowSpan="2" className="align">
											8월
											<img
												src="/global/img/table_align_arrow.gif"
												alt="8월 기준 정렬"
											/>
										</th>
									</tr>
								</thead>
								<tbody>
									<tr className="eng">
										<td>
											<div className="table_check">
												<input type="checkbox" id="a2" name="" />
												<label htmlFor="a2"></label>
											</div>
										</td>
										<td>영어</td>
										<td>미국</td>
										<td>
											<div className="favor">
												<img
													src="/global/img/favor_on.png"
													alt="즐겨찾기 on"
												/>
											</div>
										</td>

										<td>1901192</td>
										<td>알무카메토바 아니사</td>
										<td>건축</td>
										<td>3시간 30분</td>
										<td>2시간</td>
										<td>1시간</td>
										<td>1시간</td>
										<td>1회</td>
										<td>-</td>
									</tr>
									<tr className="jp">
										<td>
											<div className="table_check">
												<input type="checkbox" id="a3" name="" />
												<label htmlFor="a3"></label>
											</div>
										</td>
										<td>영어</td>
										<td>미국</td>
										<td>
											<div className="favor">
												<img
													src="/global/img/favor_off.png"
													alt="즐겨찾기 off"
												/>
											</div>
										</td>
										<td>1901192</td>
										<td>알무카메토바 아니사</td>
										<td>건축</td>
										<td>3시간 30분</td>
										<td>2시간</td>
										<td>1시간</td>
										<td>1시간</td>
										<td>1회</td>
										<td>-</td>
									</tr>
									<tr className="ch">
										<td>
											<div className="table_check">
												<input type="checkbox" id="row_check" name="" />
												<label htmlFor="row_check"></label>
											</div>
										</td>
										<td>영어</td>
										<td>미국</td>
										<td>
											<div className="favor">
												<img
													src="/global/img/favor_off.png"
													alt="즐겨찾기 off"
												/>
											</div>
										</td>
										<td>1901192</td>
										<td>알무카메토바 아니사</td>
										<td>건축</td>
										<td>3시간 30분</td>
										<td>2시간</td>
										<td>1시간</td>
										<td>1시간</td>
										<td>1회</td>
										<td>-</td>
									</tr>
								</tbody>
							</table>
						</div>

						<div className="table_btn">
							<a href="#">연락처 정보</a>
							<a href="#">등록</a>
							<a href="#">CSV 다운</a>
						</div>
					</div>
				</div>
			</div>
		);
	}
	if (category && category === "korean") {
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
										이용제한{" "}
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
									<td>1901192</td>
									<td>이일영</td>
									<td>
										<div className="restriction">
											<img
												src="/global/img/restriction_off.png"
												alt="이용제한 해제"
											/>
										</div>
									</td>
									<td>010-0000-0000</td>
									<td>zxc1234@g.yju.ac.kr</td>
									<td>1회</td>
									<td>-</td>
								</tr>
								<tr>
									<td>컴정</td>
									<td>1901192</td>
									<td>이일영</td>
									<td>
										<div className="restriction">
											<img
												src="/global/img/restriction_off.png"
												alt="이용제한 해제"
											/>
										</div>
									</td>
									<td>010-0000-0000</td>
									<td>zxc1234@g.yju.ac.kr</td>
									<td>1회</td>
									<td>-</td>
								</tr>
								<tr className="restriction_on">
									<td>컴정</td>
									<td>1901192</td>
									<td>이일영</td>
									<td>
										<div className="restriction">
											<img
												src="/global/img/restriction_on.png"
												alt="이용제한 진행중"
											/>
										</div>
									</td>
									<td>010-0000-0000</td>
									<td>zxc1234@g.yju.ac.kr</td>
									<td>1회</td>
									<td>-</td>
								</tr>
								<tr className="restriction_on">
									<td>컴정</td>
									<td>1901192</td>
									<td>이일영</td>
									<td>
										<div className="restriction">
											<img
												src="/global/img/restriction_on.png"
												alt="이용제한 진행중"
											/>
										</div>
									</td>
									<td>010-0000-0000</td>
									<td>zxc1234@g.yju.ac.kr</td>
									<td>1회</td>
									<td>-</td>
								</tr>
								<tr>
									<td>컴정</td>
									<td>1901192</td>
									<td>이일영</td>
									<td>
										<div className="restriction">
											<img
												src="/global/img/restriction_off.png"
												alt="이용제한 해제"
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
	} else {
		return <></>;
	}
}
