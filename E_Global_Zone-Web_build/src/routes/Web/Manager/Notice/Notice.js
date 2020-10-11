import React, { useEffect, useState, useRef } from "react";
import { deleteAdminNotice } from "../../../../api/admin/notice";

import { getNotice, getNoticeImg } from "../../../../api/axios";
import Modal from "../../../../components/common/modal/Modal";
import WirteNotice from "../../../../components/common/modal/WirteNotice";
import useModal from "../../../../modules/hooks/useModal";

export default function Notice() {
	const [list, setList] = useState([]);
	const [board, setBoard] = useState({
		noti_id: "",
		title: "",
		date: "",
		views: "",
		contents: "",
	});
	const {
		isOpen: isOpenForWriteNotice,
		handleOpen: handleOpenForWriteNotice,
		handleClose: handleCloseForWriteNotice,
	} = useModal();
	const {
		isOpen: isOpenForBoard,
		handleOpen: handleOpenForBoard,
		handleClose: handleCloseForBoard,
	} = useModal();
	const rendering = () => {
		setList([]);
		getNotice({ noti_url: "center", num_of_notice: 20, page: 1 }).then((res) => {
			console.log(res.data.data.data);
			setList(res.data.data.data);
			if (res.data.last_page) {
				const pagenation = document.getElementById("pagenation");
				pagenation.innerHTML = "";
				let first = document.createElement("button");
				// first.innerText = "<<";
				first.innerHTML += '<img src="/global/img/paging_prev_ico.gif" />';
				first.addEventListener("click", () => {
					// history.push(`/students/1/korean`);
					// setPending(true);
				});
				pagenation.appendChild(first);
				for (let i = 0; i < res.data.last_page; i++) {
					let btn = document.createElement("button");
					btn.innerText = i + 1;
					// if (i + 1 == params.page) {
					// 	btn.classList.add("on");
					// }
					btn.addEventListener("click", () => {
						// history.push(`/students/${i + 1}/korean`);
						// setPending(true);
					});
					pagenation.appendChild(btn);
				}
				let last = document.createElement("button");
				// last.innerText = ">>";
				last.innerHTML += '<img src="/global/img/paging_next_ico.gif" />';
				pagenation.appendChild(last);
				last.addEventListener("click", () => {
					// history.push(`/students/${resData.data.last_page}/korean`);
					// setPending(true);
				});
			}
		});
	};
	// did mount
	useEffect(() => {
		rendering();
	}, []);
	return (
		<div className="content">
			<div className="sub_title">
				<div className="top_semester">
					<p className="tit">공지사항 관리</p>
				</div>
			</div>

			<div className="wrap">
				<div className="scroll_area">
					<table className="student_manage_table">
						<colgroup>
							<col width="5%" />
							<col width="40%" />
							<col width="15%" />

							<col width="5%" />
							<col width="5%" />
						</colgroup>
						<thead>
							<tr>
								<th scope="col" className="bg">
									번호
								</th>
								<th scope="col" className="bg">
									제목
								</th>
								<th scope="col" className="bg">
									작성일
								</th>

								<th scope="col" className="bg">
									조회수
								</th>
								<th scope="col" className="bg">
									삭제
								</th>
							</tr>
						</thead>
						<tbody>
							{list &&
								list.map((v) => {
									return (
										<tr>
											<td>{v.noti_id}</td>
											<td
												className="name"
												onClick={(e) => {
													setBoard({
														noti_id: v.noti_id,
														title: v.noti_title,
														date: v.created_at,
														views: v.noti_views,
														contents: v.noti_content,
													});
													handleOpenForBoard();
												}}
											>
												{v.noti_title}
											</td>
											<td>{v.created_at}</td>

											<td>{v.noti_views}</td>
											<td className="name">
												<div
													onClick={(e) => {
														window.confirm("정말 삭제하시겠습니까?") &&
															deleteAdminNotice(v.noti_id).then(
																(res) => {
																	rendering();
																}
															);
													}}
												>
													<img
														src="/global/img/delete_ico.gif"
														alt="삭제"
													/>
												</div>
											</td>
										</tr>
									);
								})}
						</tbody>
					</table>
				</div>
				<span id="pagenation"></span>

				<div className="table_btn">
					<div className="gray" onClick={handleOpenForWriteNotice}>
						공지사항 작성
					</div>
				</div>
			</div>
			<Modal isOpen={isOpenForWriteNotice} handleClose={handleCloseForWriteNotice}>
				<WirteNotice handleClose={handleCloseForWriteNotice} />
			</Modal>
			<Modal isOpen={isOpenForBoard} handleClose={handleCloseForBoard}>
				<Board {...board} reRendering={rendering} />
			</Modal>
		</div>
	);
}

const Board = ({ noti_id, title, date, views, contents, reRendering }) => {
	const [imgList, setImgList] = useState([]);

	// did mount
	useEffect(() => {
		getNoticeImg(noti_id).then((res) => {
			setImgList(res.data.data);
		});
		return reRendering;
	}, []);
	return (
		<div className="popup board">
			<div className="view_area">
				<p className="noti_tit">{title}</p>
				<ul className="noti_info">
					<li>
						작성일 <span>{date}</span>
					</li>
					<li>
						조회수 <span>{views}</span>
					</li>
				</ul>
				<div className="modal-imgs">
					{imgList.map((img, index) => (
						<img
							className="modal-img"
							key={index}
							src={img.noti_img}
							alt="이미지"
						></img>
					))}
					<div className="noti_view" dan>
						<div dangerouslySetInnerHTML={{ __html: contents }}></div>
					</div>
				</div>
			</div>
		</div>
	);
};
