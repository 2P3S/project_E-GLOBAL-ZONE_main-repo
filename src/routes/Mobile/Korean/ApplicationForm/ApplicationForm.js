import React from "react";

export default function ApplicationForm() {
	return (
		<div class="wrap">
			<div class="apply_tit">
				<h3 class="tit">예약신청</h3>
				<p>
					신청인원 :<span> 5 </span>/ 10
				</p>
			</div>

			<div class="reservation_boxs mb30">
				<div class="box puple">
					<ul>
						<li>[영어] 쉬라이 알리오트시나</li>
						<li class="eng">AM 09:00 ~ PM 01:00 </li>
					</ul>
				</div>
			</div>

			<div class="input_box">
				<p>신청 날짜</p>
				<input type="text" value="2020년 7월 13일" readonly />
			</div>
			<div class="input_box">
				<p>신청 시간</p>
				<input type="text" value="오전 09시 00분 ~ 오후 12시 00분" readonly />
			</div>
			<div class="input_box">
				<p>유학생</p>
				<input type="text" value="바라트벡 울잔" readonly />
			</div>
			<div class="input_box">
				<p>신청 학생</p>
				<input type="text" value="이구슬" readonly />
			</div>
			<div class="input_box">
				<p>e-글로벌 존 예약 방침</p>
				<textarea readonly>
					[ 무단 예약 부도에 대한 동의 ] 예약 신청 후, 예약 취소 또는 관리자의 확인 없이
					예약 부도(일명 No Show)시, 관련 규정에 따라, 불이익이 주어짐에 동의합니다.
				</textarea>
			</div>

			<div class="agree">
				<div class="all_agree">
					<input type="checkbox" id="a1" name="전체동의" />
					<label for="a1">
						<span>e - 글로벌 존 예약 방침에 동의합니다.</span>
					</label>
				</div>
			</div>

			<div class="btn_wrap">
				<a href="#">신청하기</a>
			</div>
		</div>
	);
}
