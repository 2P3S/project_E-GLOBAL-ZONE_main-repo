import React, { useEffect, useState, useRef } from "react";
import { deleteAdminNotice } from "../../../../api/admin/notice";

import { getNotice, getNoticeImg } from "../../../../api/axios";
import Modal from "../../../../components/common/modal/Modal";
import WirteNotice from "../../../../components/common/modal/WirteNotice";
import useModal from "../../../../modules/hooks/useModal";

export default function Notice() {
	const [current, setCurrent] = useState(1);
	const [list, setList] = useState([]);
	const [area, setArea] = useState("zone");
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
		getNotice({ noti_url: area, num_of_notice: 10, page: current }).then((res) => {
			console.log(res.data.data);
			setList(res.data.data.data);
			if (res.data.data.last_page) {
				const { current_page, last_page } = res.data.data;
				let firstIndex =
					current_page % 10 === 0
						? current_page - 10
						: current_page - (current_page % 10);
				let lastIndex = firstIndex + 10 > last_page ? last_page : firstIndex + 10;
				const pagenation = document.getElementById("pagenation");
				pagenation.innerHTML = "";
				let first = document.createElement("button");
				first.innerHTML += '<img src="/global/img/paging_prev_ico.gif" />';
				first.addEventListener("click", () => {
					setCurrent(current === 1 ? 1 : current_page - 1);
				});
				pagenation.appendChild(first);
				if (firstIndex !== 0) {
					let firstPage = document.createElement("button");
					firstPage.innerText = "1";
					firstPage.addEventListener("click", () => {
						setCurrent(1);
					});
					pagenation.appendChild(firstPage);
					let dots = document.createElement("button");
					dots.innerText = "...";
					pagenation.appendChild(dots);
				}
				for (let i = firstIndex; i < lastIndex; i++) {
					let btn = document.createElement("button");
					btn.innerText = i + 1;
					if (i + 1 == current_page) {
						btn.classList.add("on");
					}
					btn.addEventListener("click", () => {
						setCurrent(i + 1);
					});
					pagenation.appendChild(btn);
				}
				if (lastIndex !== last_page) {
					let dots = document.createElement("button");
					dots.innerText = "...";
					pagenation.appendChild(dots);
					let lastPage = document.createElement("button");
					lastPage.innerText = last_page;
					lastPage.addEventListener("click", () => {
						setCurrent(last_page);
					});
					pagenation.appendChild(lastPage);
				}

				let last = document.createElement("button");
				last.innerHTML += '<img src="/global/img/paging_next_ico.gif" />';
				pagenation.appendChild(last);
				last.addEventListener("click", () => {
					setCurrent(current === last_page ? last_page : current_page + 1);
				});
			}
		});
	};

	const handleChange = (e) => {
		setArea(e.target.value);
	};

	// did mount
	useEffect(() => {
		rendering();
	}, []);

	// update
	useEffect(() => {
		rendering();
	}, [current, area]);

	// every rendering
	useEffect(() => {
		window.easydropdown.all();
	});
	return (
		<div className="content">
			<div className="sub_title">
				<div className="top_semester">
					<p className="tit">공지사항 관리</p>
					<div>
						<select onChange={handleChange}>
							<option value="zone">글로벌 존</option>
							<option value="center">글로벌 센터</option>
						</select>
					</div>
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
				<WirteNotice
					handleClose={handleCloseForWriteNotice}
					reRendering={rendering}
					area={area}
				/>
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
