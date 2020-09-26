import React, { useEffect } from "react";

/**
 * Modal - 출석 결과 미승인
 * @returns {JSX.Element}
 * @constructor
 */
export default function ConfirmResult() {
	useEffect(() => {
		window.easydropdown.all();
	}, []);
	return (
		<div className="popup not_attend">
			<div className="left_wrap">
				<p className="tit">출석결과 미승인</p>
				<table className="pop_table3">
					<colgroup>
						<col width="12%" span="2" />
					</colgroup>
					<thead>
						<tr>
							<th scope="col">
								<div className="table_check">
									<input type="checkbox" id="a0" name="" />
									<label for="a0"></label>
								</div>
							</th>
							<th scope="col">순번</th>
							<th scope="col">일시</th>
							<th scope="col">유학생 이름</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td>
								<div className="table_check">
									<input type="checkbox" id="a1" name="" />
									<label for="a1"></label>
								</div>
							</td>
							<td>1</td>
							<td>2020-07-13 13:00~13:40</td>
							<td>바라트벡 울잔</td>
						</tr>
						<tr>
							<td>
								<div className="table_check">
									<input type="checkbox" id="a2" name="" />
									<label for="a2"></label>
								</div>
							</td>
							<td>2</td>
							<td>2020-07-13 13:00~13:40</td>
							<td>바라트벡 울잔</td>
						</tr>
						<tr>
							<td>
								<div className="table_check">
									<input type="checkbox" id="a3" name="" />
									<label for="a3"></label>
								</div>
							</td>
							<td>3</td>
							<td>2020-07-13 13:00~13:40</td>
							<td>바라트벡 울잔</td>
						</tr>
					</tbody>
				</table>
				<div className="btn_area right">
					<a href="" className="bbtn mint">
						일괄승인
					</a>
				</div>
			</div>

			<div className="right_wrap">
				<p className="tit">학생 목록</p>

				<div className="student_list">
					<ul>
						<li>
							<div className="student">
								<p className="name">이구슬</p>
								<select name="catgo" className="dropdown">
									<option value="attendance">출석</option>
									<option value="absent">결석</option>
								</select>
							</div>
						</li>
						<li>
							<div className="student">
								<p className="name">이구슬</p>
								<select name="catgo" className="dropdown">
									<option value="attendance">출석</option>
									<option value="absent">결석</option>
								</select>
							</div>
						</li>
						<li>
							<div className="student">
								<p className="name">이구슬</p>
								<select name="catgo" className="dropdown">
									<option value="attendance">출석</option>
									<option value="absent">결석</option>
								</select>
							</div>
						</li>
					</ul>
				</div>

				<div className="img_upload">
					<div>사진 1</div>
					<div>사진 2</div>
				</div>

				<p className="attend_rate">
					출석율 : <span>60%</span>
				</p>

				<div className="btn_area right">
					<a href="" className="bbtn gray">
						사진업로드
					</a>
					<a href="" className="bbtn mint">
						저장
					</a>
					{/* <a href="" className="bbtn">
                        닫기
                    </a> */}
				</div>
			</div>
		</div>
	);
}
