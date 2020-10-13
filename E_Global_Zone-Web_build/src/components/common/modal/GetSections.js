import React, { useEffect, useState } from "react";
import { getAdminSection, deleteAdminSection } from "../../../api/admin/section";
import moment from "moment";
import useModal from "../../../modules/hooks/useModal";
import Modal from "./Modal";
import Loader from "../Loader";
import CreateSection from "./CreateSection";
import { handleEnterKey } from "../../../modules/handleEnterKey";
import { getAdminExportResult } from "../../../api/admin/export";

export default function GetSections({ handleClose }) {
	const [sectList, setSectList] = useState({});
	const [selectSect, setSelectSect] = useState();
	const [loading, setLoading] = useState(false);

	const { isOpen, handleClose: handleCloseForModal, handleOpen } = useModal();

	useEffect(() => {
		getAdminSection({ year: moment().format("YYYY") }).then((res) => setSectList(res.data));
	}, []);

	const handleClick = () => {
		getAdminSection({ year: document.getElementById("year").value }).then((res) =>
			setSectList(res.data)
		);
	};

	return (
		<div className="popup inquiry">
			<p className="tit">학기 기간 조회</p>

			<div className="search_box">
				<input
					onKeyUp={(e) => handleEnterKey(e, handleClick)}
					type="text"
					placeholder="년도를 입력하세요"
					id="year"
				/>
				<button onClick={handleClick}>검색</button>
			</div>

			<div className="scroll_area mt20">
				<table className="pop_table">
					<colgroup>
						<col />
						<col />
						<col />
						<col />
						<col />
						<col />
					</colgroup>
					<thead>
						<tr>
							<th scope="col">학기 명</th>
							<th scope="col">시작일</th>
							<th scope="col">종료일</th>
							<th scope="col">근무 학생 수</th>
							<th scope="col">결과 사진</th>
							<th scope="col">수정/삭제</th>
						</tr>
					</thead>

					<tbody>
						{sectList.data &&
							sectList.data.map((v) => {
								return (
									<tr>
										<td>{v.sect_name}</td>
										<td>
											{moment(v.sect_start_date, "YYYY-MM-DD").format(
												"YYYY-MM-DD"
											)}
										</td>
										<td>
											{moment(v.sect_end_date, "YYYY-MM-DD").format(
												"YYYY-MM-DD"
											)}
										</td>
										<td>{v.std_for_count}명</td>
										<td>
											<div
												// style={{
												// 	border: "1px solid black",
												// 	borderRadius: "5px",
												// }}
												className="table_down_btn"
												onClick={(e) => {
													setLoading(true);
													getAdminExportResult(
														v.sect_id,
														v.sect_name
													).then(() => {
														setLoading(false);
													});
												}}
											>
												다운로드
											</div>
										</td>
										<td>
											{moment(v.sect_start_date, "YYYY-MM-DD").isAfter(
												moment(Date.now())
											) ? (
												<img
													onClick={() => {
														if (
															window.confirm(
																"정말 삭제 하시겠습니까?"
															)
														)
															deleteAdminSection(v.sect_id).then(
																(res) => {
																	alert(res.data.message);
																	handleClose();
																}
															);
														// handleOpen();
													}}
													src="/global/img/enrol_del_btn.gif"
													alt="학기 삭제 버튼"
												/>
											) : moment(v.sect_end_date).isAfter(
													moment(Date.now())
											  ) ? (
												<img
													onClick={() => {
														setSelectSect(v.sect_name);
														handleOpen();
													}}
													src="/global/img/modify_ico.gif"
													alt="학기 수정 버튼"
												/>
											) : (
												<>-</>
											)}
										</td>
									</tr>
								);
							})}
					</tbody>
				</table>
			</div>
			<Modal isOpen={loading}>
				<Loader />
			</Modal>
			<Modal isOpen={isOpen} handleClose={handleCloseForModal}>
				<CreateSection handleClose={handleCloseForModal} selectSect={selectSect} />
			</Modal>
		</div>
	);
}
