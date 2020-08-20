import React from "react";

export default function ConfirmRestriction() {
	return (
		<div className="popup restriction">
			<p className="tit">이용 제한 등록</p>
			<p className="txt">
				OOO 학생의 <span>이용제한 사유</span>를 입력해주세요.
			</p>
			<textarea name="" id="" cols="20" rows="4"></textarea>

			<div className="btn_area">
				<a href="" class="bbtn mint">
					등록
				</a>
				<a href="" class="bbtn white">
					닫기
				</a>
			</div>
		</div>
	);
}
