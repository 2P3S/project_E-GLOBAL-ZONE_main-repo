import React, {useEffect, useState} from "react";
import {getKoreanReservationResult} from "../../../../modules/hooks/useAxios";

/**
 * Korean :: 결과 조회
 * @returns {JSX.Element}
 * @constructor
 * @todo 섹션 아이디 받아와야함
 */
export default function Results() {
	const [data, setData] = useState();
	useEffect(()=>{
		getKoreanReservationResult(5,8,1321704, setData);
	},[]);
	return (
		<div>
			<div className="wrap mobile_result">
				<p className="tit">2020년 1학기</p>
				<div className="point_info">
					<p>
						<span className="name">이구슬</span> 학생의
						<br />
						글로벌 포인트 현황
					</p>
					<div className="result">
						<span className="rank">상위 10%</span>8<span className="times">회</span>
					</div>
				</div>

				<select name="" id="" className="mt50">
					<option value="">2020년 1학기</option>
					<option value="">2020년 여름학기</option>
					<option value="">2020년 2학기</option>
					<option value="">2020년 겨울학기</option>
				</select>

				<div className="history_wrap">
					<div className="month_move">
						<p>2020년 7월</p>
						<div className="arrow">
							<a href="#">
								<img src="/global/mobile/img/month_move_prev.gif" alt="이전 달" />
							</a>
							<a href="#">
								<img src="/global/mobile/img/month_move_next.gif" alt="다음 달" />
							</a>
						</div>
					</div>
					<div>
						<a href=""></a>
					</div>
					<table>
						<colgroup>
							<col width="30%" />
							<col width="50%" />
							<col width="20%" />
						</colgroup>
						<thead>
							<tr>
								<th scope="col">일시</th>
								<th scope="col">유학생</th>
								<th scope="col">점수</th>
							</tr>
						</thead>
						<tbody>
							<tr>
								<td>7/10 9시 - 12시</td>
								<td>쉬라이 알리오트 시나</td>
								<td className="score">+5</td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
}
