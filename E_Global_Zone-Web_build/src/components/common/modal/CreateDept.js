import React from "react";

export default function CreateDept({ handleClose }) {
	return (
		<div className="popup depart_regist">
			<p className="tit">학과등록</p>

			<div className="gray_bg">
				<label htmlFor="">
					학과명 <input type="text" placeholder="학과명 입력" />
				</label>
				<label htmlFor="">
					줄임말 <input type="text" placeholder="학과명 줄임말 입력" />
				</label>
			</div>

			<div className="btn_area">
				<div
					className="bbtn mint"
					onClick={() => alert("아직 이용 할 수 없는 기능입니다.")}
				>
					저장
				</div>
				{/* <div className="bbtn darkGray" onClick={handleClose}>
					취소
				</div> */}
			</div>
		</div>
	);
}
