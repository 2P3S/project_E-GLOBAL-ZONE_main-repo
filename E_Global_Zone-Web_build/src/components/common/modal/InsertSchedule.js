import React, { useEffect } from "react";
import { Link } from "react-router-dom";

/**
 * Modal - 스케줄 입력
 * @param closeSch
 * @returns {JSX.Element}
 * @constructor
 */
export default function InsertSchedule({ closeSch }) {
	useEffect(() => {
		window.easydropdown.all();
	}, []);
	return (
		<div className="popup sch">
			<p className="tit">스케줄 입력</p>
			<div className="select_area">
				<div className="area">
					<p>날짜 선택</p>
					<div className="date">2020-07-13</div>
				</div>
				<div className="area">
					<p>시간 선택</p>
					<select name="catgo1" className="dropdown">
						<option>09시 00분</option>
						<option>09시 30분</option>
						<option>10시 00분</option>
						<option>10시 30분</option>
					</select>
					<span>-</span>
					<select name="catgo1" className="dropdown">
						<option>09시 00분</option>
						<option>09시 30분</option>
						<option>10시 00분</option>
						<option>10시 30분</option>
					</select>
				</div>
				<div className="area student">
					<p>유학생 선택</p>
					<select name="catgo3" className="dropdown">
						<option>바라트벡 울잔</option>
						<option>카와이 히나코</option>
						<option>드로즈드 캣시아</option>
						<option>알무카메토바 아니사</option>
					</select>
				</div>
				<div className="regist_btn">등록</div>
			</div>
			<div className="scroll_area">
				<table className="pop_table2">
					<colgroup>
						<col width="15%" />
						<col width="20%" />
						<col width="20%" />
					</colgroup>
					<tbody>
						<tr>
							<td>1</td>
							<td>2020-07-22</td>
							<td>09:00 - 12:30</td>
							<td>바라트벡 울잔</td>
							<td>
								<a href="#">
									<img
										src="/global/img/row_del_btn.gif"
										alt="유힉생 스케줄 삭제"
									/>
								</a>
							</td>
						</tr>
						<tr>
							<td>2</td>
							<td>2020-07-22</td>
							<td>09:00 - 12:30</td>
							<td>알무카메토바 아니사</td>
							<td>
								<a href="#">
									<img
										src="/global/img/row_del_btn.gif"
										alt="유힉생 스케줄 삭제"
									/>
								</a>
							</td>
						</tr>
						<tr>
							<td>3</td>
							<td>2020-07-22</td>
							<td>09:00 - 12:30</td>
							<td>바라트벡 울잔</td>
							<td>
								<a href="#">
									<img
										src="/global/img/row_del_btn.gif"
										alt="유힉생 스케줄 삭제"
									/>
								</a>
							</td>
						</tr>
					</tbody>
				</table>
			</div>
			<div className="btn_area right">
				<Link className="bbtn blue">등록</Link>
				{/* <div className="bbtn white" onClick={closeSch}>
					닫기
				</div> */}
			</div>
		</div>
	);
}
