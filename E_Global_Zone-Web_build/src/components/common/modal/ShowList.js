import React, { useEffect } from "react";

/**
 * Modal - 신청 학생 명단보기
 * @param handleClose
 * @returns {JSX.Element}
 * @constructor
 */
export default function ShowList({ handleClose }) {
	useEffect(() => {
		window.easydropdown.all();
	}, []);
	return (
		<div className="popup enrol">
			<div className="top">
				<div className="left">
					<p className="tit">신청 학생 명단보기</p>
					<p className="txt">
						7월 13일(월) <span>AM09:00 ~ PM12:00</span>
					</p>
				</div>
				<p className="name">바라트벡 울잔</p>
			</div>

			<div className="area">
				<ul>
					<li>
						<div className="student">
							<div className="del_btn">
								<img src="/global/img/enrol_del_btn.gif" alt="신청 학생 삭제" />
							</div>
							<p className="name">이구슬</p>
							<select name="catgo" className="dropdown">
								<option value="approval">승인</option>
								<option value="non_approval">미승인</option>
							</select>
						</div>
					</li>
					<li>
						<div className="student">
							<div className="del_btn">
								<img src="/global/img/enrol_del_btn.gif" alt="신청 학생 삭제" />
							</div>
							<p className="name">이구슬</p>
							<select name="catgo" className="dropdown">
								<option value="approval">승인</option>
								<option value="non_approval">미승인</option>
							</select>
						</div>
					</li>
					<li>
						<div className="student">
							<div className="del_btn">
								<img src="/global/img/enrol_del_btn.gif" alt="신청 학생 삭제" />
							</div>
							<p className="name">이구슬</p>
							<select name="catgo" className="dropdown">
								<option value="approval">승인</option>
								<option value="non_approval">미승인</option>
							</select>
						</div>
					</li>
					<li>
						<div className="add_student">
							학생 추가{" "}
							<img src="/global/img/add_student_ico.gif" alt="학생 추가 아이콘" />
						</div>
					</li>
				</ul>
			</div>

			<div className="btn_area right">
				<a href="" className="bbtn white left">
					일괄승인
				</a>
				<a href="" className="bbtn mint">
					저장
				</a>
				<div className="bbtn white" onClick={handleClose}>
					닫기
				</div>
			</div>
		</div>
	);
}
