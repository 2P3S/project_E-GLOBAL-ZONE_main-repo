import React from "react";

export default function Results() {
	return (
		<div>
			<div class="wrap mobile_result">
				<ul class="tab no3">
					<li>
						<a href="student_reservation.php">예약 조회</a>
					</li>
					<li>
						<a href="student_schedule.php">스케줄 조회</a>
					</li>
					<li>
						<a href="student_result.php" class="on">
							결과 관리
						</a>
					</li>
				</ul>

				<p class="tit">2020년 1학기</p>
				<div class="point_info">
					<p>
						<span class="name">이구슬</span> 학생의
						<br />
						글로벌 포인트 현황
					</p>
					<div class="result">
						<span class="rank">상위 10%</span>8<span class="times">회</span>
					</div>
				</div>

				<select name="" id="" class="mt50">
					<option value="">2020년 1학기</option>
					<option value="">2020년 여름학기</option>
					<option value="">2020년 2학기</option>
					<option value="">2020년 겨울학기</option>
				</select>

				<div class="history_wrap">
					<div class="month_move">
						<p>2020년 7월</p>
						<div class="arrow">
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
								<td class="score">+5</td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
}
