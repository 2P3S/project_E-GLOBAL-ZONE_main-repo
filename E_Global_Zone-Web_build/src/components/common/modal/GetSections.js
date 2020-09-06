import React, { useEffect, useState } from "react";
import { getAdminSection } from "../../../api/admin/section";
import moment from "moment";
import useModal from "../../../modules/hooks/useModal";
import Modal from "./Modal";
import CreateSection from "./CreateSection";
import { handleEnterKey } from "../../../modules/handleEnterKey";

export default function GetSections() {
	const [sectList, setSectList] = useState({});
	const [selectSect, setSelectSect] = useState();

	const { isOpen, handleClose, handleOpen } = useModal();

	useEffect(() => {
		getAdminSection({ year: moment().format("YYYY") }).then((res) => setSectList(res.data));
	}, []);

	const handleClick = () => {
		getAdminSection({ year: document.getElementById("year").value })
			.then((res) => setSectList(res.data))
			.catch((res) => alert(res.data.message));
	};

	useEffect(() => {
		console.log(sectList);
	}, [sectList]);
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
						<col width="12%" />
					</colgroup>
					<thead>
						<tr>
							<th scope="col">구분</th>
							<th scope="col">시작일</th>
							<th scope="col">종료일</th>
							<th scope="col">근무 학생 수</th>
							<th scope="col">수정</th>
						</tr>
					</thead>
					<tbody>
						{sectList.data &&
							sectList.data.map((v) => {
								return (
									<tr>
										<td>
											<div className="cursor">{v.sect_name}</div>
										</td>
										<td>{moment(v.sect_start_date).format("YYYY-MM-DD")}</td>
										<td>{moment(v.sect_end_date).format("YYYY-MM-DD")}</td>
										<td>{v.std_for_count}명</td>
										<td>
											<img
												onClick={() => {
													setSelectSect(v.sect_name);
													handleOpen();
												}}
												src="/global/img/modify_ico.gif"
												alt="학기 수정 버튼"
											/>
										</td>
									</tr>
								);
							})}
						{/* <tr>
							<td>
								<div className="cursor">2020학년도 2학기</div>
								<img src="/global/img/modify_ico.gif" alt="학기 수정 버튼" />
							</td>
							<td>2020-08-24</td>
							<td>2020-12-03</td>
							<td>32명</td>
						</tr>
						<tr>
							<td>2020학년도 2학기</td>
							<td>2020-08-24</td>
							<td>2020-12-03</td>
							<td>32명</td>
						</tr>
						<tr>
							<td>2020학년도 2학기</td>
							<td>2020-08-24</td>
							<td>2020-12-03</td>
							<td>32명</td>
						</tr>
						<tr>
							<td>2020학년도 2학기</td>
							<td>2020-08-24</td>
							<td>2020-12-03</td>
							<td>32명</td>
						</tr> */}
					</tbody>
				</table>
			</div>
			<Modal isOpen={isOpen} handleClose={handleClose}>
				<CreateSection handleClose={handleClose} selectSect={selectSect} />
			</Modal>
		</div>
	);
}
