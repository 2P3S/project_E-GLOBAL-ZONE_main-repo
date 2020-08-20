import React from "react";
import useClick from "../../../modules/hooks/useClick";

/**
 * Moadl - 학생 등록 승인
 * @param handleClose
 * @returns {JSX.Element}
 * @constructor
 */
export default function ConfirmStudent({ handleClose }) {
	return (
		<div className="popup approval">
			<div className="tit_area">
				<p className="tit">한국인 학생 등록 승인</p>
				<p className="person">
					신청인원 : <span>6</span>명
				</p>
			</div>
			<div className="scroll_area">
				<table className="pop_table">
					<thead>
						<tr>
							<th scope="col">
								<div className="table_check">
									<input type="checkbox" id="a1" name="" />
									<label htmlFor="a1"></label>
								</div>
							</th>
							<th scope="col">계열학과</th>
							<th scope="col">학번</th>
							<th scope="col">이름</th>
							<th scope="col">연락처</th>
							<th scope="col">G Suite 계정</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td>
								<div className="table_check">
									<input type="checkbox" id="a2" name="" />
									<label htmlFor="a2"></label>
								</div>
							</td>
							<td>컴정</td>
							<td>1901192</td>
							<td>이일영</td>
							<td>010-0000-0000</td>
							<td>zxc1234@g.yju.ac.kr</td>
						</tr>
						<tr>
							<td>
								<div className="table_check">
									<input type="checkbox" id="a3" name="" />
									<label htmlFor="a3"></label>
								</div>
							</td>
							<td>컴정</td>
							<td>1901192</td>
							<td>이일영</td>
							<td>010-0000-0000</td>
							<td>zxc1234@g.yju.ac.kr</td>
						</tr>
						<tr>
							<td>
								<div className="table_check">
									<input type="checkbox" id="a4" name="" />
									<label htmlFor="a4"></label>
								</div>
							</td>
							<td>컴정</td>
							<td>1901192</td>
							<td>이일영</td>
							<td>010-0000-0000</td>
							<td>zxc1234@g.yju.ac.kr</td>
						</tr>
						<tr>
							<td>
								<div className="table_check">
									<input type="checkbox" id="a5" name="" />
									<label htmlFor="a5"></label>
								</div>
							</td>
							<td>컴정</td>
							<td>1901192</td>
							<td>이일영</td>
							<td>010-0000-0000</td>
							<td>zxc1234@g.yju.ac.kr</td>
						</tr>
						<tr>
							<td>
								<div className="table_check">
									<input type="checkbox" id="a6" name="" />
									<label htmlFor="a6"></label>
								</div>
							</td>
							<td>컴정</td>
							<td>1901192</td>
							<td>이일영</td>
							<td>010-0000-0000</td>
							<td>zxc1234@g.yju.ac.kr</td>
						</tr>
						<tr>
							<td>
								<div className="table_check">
									<input type="checkbox" id="a7" name="" />
									<label htmlFor="a7"></label>
								</div>
							</td>
							<td>컴정</td>
							<td>1901192</td>
							<td>이일영</td>
							<td>010-0000-0000</td>
							<td>zxc1234@g.yju.ac.kr</td>
						</tr>
					</tbody>
				</table>
			</div>

			<div className="btn_area">
				<div href="" className="bbtn mint">
					등록
				</div>
				<div
					className="bbtn white"
					ref={useClick(() => {
						handleClose();
					})}
				>
					닫기
				</div>
			</div>
		</div>
	);
}
