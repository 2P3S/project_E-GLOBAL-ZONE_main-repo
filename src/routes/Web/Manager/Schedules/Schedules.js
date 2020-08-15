import React, { useState } from "react";
import Modal from "react-modal";
import InsertSchedule from "components/common/modal/InsertSchedule";

const modalStyle = {
	content: {
		top: "50%",
		left: "50%",
		right: "auto",
		bottom: "auto",
		marginRight: "-50%",
		transform: "translate(-50%, -50%)",
		zIndex: "2",
		overflow: "hidden",
	},
};
Modal.setAppElement(document.getElementById("modal-root"));
export default function Schedules() {
	const [schIsOpen, setSchIsOpen] = useState(false);
	const openSch = () => {
		setSchIsOpen(true);
	};
	const closeSch = () => {
		setSchIsOpen(false);
	};
	return (
		<div className="content">
			<div className="sub_title">
				<p className="tit">{new Date().toDateString().toUpperCase()}</p>
				<div className="select_date">
					<img src="/global/img/select_date_ico.gif" alt="날짜 선택" />
				</div>
				<div className="check_box_area">
					<div className="check_box">
						<div className="check_box_input all">
							<input type="checkbox" id="allCheck" name="" />
							<label htmlFor="allCheck"></label>
						</div>
					</div>

					<div className="check_box">
						<div className="check_box_input">
							<input type="checkbox" id="no_app_reservation" name="" />
							<label htmlFor="no_app_reservation">
								<span>
									예약 미승인 <span className="blue">10</span>건
								</span>
							</label>
						</div>
					</div>

					<div className="check_box">
						<div className="check_box_input">
							<input type="checkbox" id="not_result" name="" />
							<label htmlFor="not_result">
								<span>
									결과 미입력 <span className="mint">2</span>건
								</span>
							</label>
						</div>
					</div>

					<div className="check_box">
						<div className="check_box_input">
							<input type="checkbox" id="no_app_result" name="" />
							<label htmlFor="no_app_result">
								<span>
									결과 미승인 <span className="yellow">3</span>건
								</span>
							</label>
						</div>
					</div>

					<div className="check_box">
						<div className="check_box_input">
							<input type="checkbox" id="ok_result" name="" />
							<label htmlFor="ok_result">
								<span>
									결과 입력완료 <span className="puple">2</span>건
								</span>
							</label>
						</div>
					</div>
				</div>
			</div>
			<div className="wrap">
				<div className="scroll_area">
					<ul className="sch_time">
						<li>9AM</li>
						<li>10AM</li>
						<li>11AM</li>
						<li>12PM</li>
						<li>1PM</li>
						<li>2PM</li>
						<li>3PM</li>
						<li>4PM</li>
						<li>5PM</li>
						<li>6PM</li>
					</ul>
					<table className="sch_table">
						<colgroup>
							<col width="5%" />
							<col width="14%" />
							<col width="9%" span="9" />
						</colgroup>
						<tbody>
							<tr>
								<th scope="row" rowSpan="5">
									영어
								</th>
								<td>쉬라이 알리오트 시나</td>
								<td>
									<div className="status">
										<p className="blue">
											신청한 학생 : 8명
											<br />
											예약 미승인 : 6명
										</p>
									</div>
								</td>
								<td>
									<div className="status">
										<p className="blue">
											신청한 학생 : 8명
											<br />
											예약 미승인 : 6명
										</p>
									</div>
								</td>
								<td>
									<div className="status">
										<p className="blue">
											신청한 학생 : 8명
											<br />
											예약 미승인 : 6명
										</p>
									</div>
								</td>
								<td></td>
								<td></td>
								<td></td>
								<td></td>
								<td></td>
								<td></td>
							</tr>

							<tr>
								<td>드로즈드 캣시아 리나</td>
								<td></td>
								<td>
									<div className="status">
										<p className="mint oneline">8명 예약완료</p>
									</div>
								</td>
								<td>
									<div className="status">
										<p className="mint oneline">3명 예약완료</p>
									</div>
								</td>
								<td></td>
								<td></td>
								<td></td>
								<td></td>
								<td></td>
								<td></td>
							</tr>

							<tr>
								<td>마르친</td>
								<td></td>
								<td>
									<div className="status ">
										<p className="gray oneline">예약 없음</p>
									</div>
								</td>
								<td></td>
								<td>
									<div className="status ">
										<p className="blue oneline">예약 미승인 : 10명</p>
									</div>
								</td>
								<td>
									<div className="status ">
										<p className="mint oneline">10명 예약 완료</p>
									</div>
								</td>
								<td></td>
								<td></td>
								<td></td>
								<td></td>
							</tr>

							<tr>
								<td>케루젤 타티아나</td>
								<td></td>
								<td>
									<div className="status ">
										<p className="gray oneline">예약 없음</p>
									</div>
								</td>
								<td>
									<div className="status ">
										<p className="gray oneline">예약 없음</p>
									</div>
								</td>
								<td></td>
								<td>
									<div className="status ">
										<p className="mint oneline">10명 예약 완료</p>
									</div>
								</td>
								<td></td>
								<td></td>
								<td></td>
								<td></td>
							</tr>

							<tr>
								<td>볼디레바 엘레나</td>
								<td>
									<div className="status">
										<p className="blue">
											신청한 학생 : 8명
											<br />
											예약 미승인 : 6명
										</p>
									</div>
								</td>
								<td>
									<div className="status">
										<p className="blue">
											신청한 학생 : 8명
											<br />
											예약 미승인 : 6명
										</p>
									</div>
								</td>
								<td>
									<div className="status ">
										<p className="gray oneline">예약 없음</p>
									</div>
								</td>
								<td></td>
								<td></td>
								<td>
									<div className="status ">
										<p className="gray oneline">예약 없음</p>
									</div>
								</td>
								<td>
									<div className="status ">
										<p className="gray oneline">예약 없음</p>
									</div>
								</td>
								<td>
									<div className="status ">
										<p className="gray oneline">예약 없음</p>
									</div>
								</td>
								<td></td>
							</tr>

							<tr>
								<th scope="row" rowSpan="4">
									일본어
								</th>
								<td>오카 우라라</td>
								<td>
									<div className="status">
										<p className="blue">
											신청한 학생 : 8명
											<br />
											예약 미승인 : 6명
										</p>
									</div>
								</td>
								<td>
									<div className="status">
										<p className="blue">
											신청한 학생 : 8명
											<br />
											예약 미승인 : 6명
										</p>
									</div>
								</td>
								<td>
									<div className="status">
										<p className="yellow">
											참가 학생 : 5명
											<br />
											[결과 미승인]
										</p>
									</div>
								</td>
								<td></td>
								<td></td>
								<td></td>
								<td></td>
								<td></td>
								<td></td>
							</tr>

							<tr>
								<td>미즈시마 나나미</td>
								<td></td>
								<td></td>
								<td></td>
								<td></td>
								<td>
									<div className="status">
										<p className="puple oneline">결과 입력완료</p>
									</div>
								</td>
								<td>
									<div className="status">
										<p className="puple oneline">결과 입력완료</p>
									</div>
								</td>
								<td>
									<div className="status">
										<p className="gray oneline">예약 없음</p>
									</div>
								</td>
								<td></td>
								<td></td>
							</tr>

							<tr>
								<td>카와이 하나코</td>
								<td></td>
								<td>
									<div className="status">
										<p className="yellow">
											참가 학생 : 5명
											<br />
											[결과 미승인]
										</p>
									</div>
								</td>
								<td>
									<div className="status">
										<p className="yellow">
											참가 학생 : 10명
											<br />
											[결과 미승인]
										</p>
									</div>
								</td>
								<td></td>
								<td></td>
								<td></td>
								<td></td>
								<td></td>
								<td></td>
							</tr>

							<tr>
								<td>카와이 하나코</td>
								<td></td>
								<td>
									<div className="status">
										<p className="yellow">
											참가 학생 : 5명
											<br />
											[결과 미승인]
										</p>
									</div>
								</td>
								<td>
									<div className="status">
										<p className="yellow">
											참가 학생 : 10명
											<br />
											[결과 미승인]
										</p>
									</div>
								</td>
								<td></td>
								<td></td>
								<td></td>
								<td></td>
								<td></td>
								<td></td>
							</tr>
						</tbody>
					</table>
				</div>

				<div className="table_btn">
					<a href="#" onClick={openSch}>
						개별 입력
					</a>
					<Modal isOpen={schIsOpen} onRequestClose={closeSch} style={modalStyle}>
						<InsertSchedule closeSch={closeSch} />
					</Modal>
					<a href="#">CSV 입력</a>
				</div>
			</div>
		</div>
	);
}
