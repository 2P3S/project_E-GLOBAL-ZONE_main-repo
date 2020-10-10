import React, { useEffect, useState } from "react";
import { convertToRaw, EditorState } from "draft-js";
import imageCompression from "browser-image-compression";
import draftToHtml from "draftjs-to-html";
import { Editor } from "react-draft-wysiwyg";
import "./css/react-draft-wysiwyg.css";
import { postAdminNotice } from "../../../api/admin/notice";
export default function WirteNotice() {
	const option = { maxSizeMb: 5, useWebWorker: true };
	const [editorState, setEditorState] = useState(EditorState.createEmpty());
	const [noti_imgs, setNoti_imgs] = useState([]);
	const [loading, setLoading] = useState(false);
	const [data, setData] = useState(new FormData());
	useEffect(() => {
		console.log(editorState);
		console.log(draftToHtml(convertToRaw(editorState.getCurrentContent())));
	});
	const handleFileInput = async (e) => {
		const imageFile = e.target.files[0];
		console.log("originalFile instanceof Blob", imageFile instanceof Blob); // true
		console.log(`originalFile size ${imageFile.size / 1024 / 1024} MB`);

		const options = {
			maxSizeMB: 2,
			maxWidthOrHeight: 1920,
			useWebWorker: true,
		};
		try {
			const compressedFile = await imageCompression(imageFile, options);
			console.log("compressedFile instanceof Blob", compressedFile instanceof Blob); // true
			console.log(`compressedFile size ${compressedFile.size / 1024 / 1024} MB`); // smaller than maxSizeMB
			setNoti_imgs([...noti_imgs, new File([compressedFile], imageFile.name)]);
		} catch (error) {
			console.log(error);
		}
		// let file = e.target.files[0];
	};
	const handleSubmit = () => {
		data.append("noti_url", "center");
		data.append("noti_title", document.getElementById("title").value);
		data.append("noti_content", draftToHtml(convertToRaw(editorState.getCurrentContent())));
		console.log(noti_imgs);
		if (noti_imgs.length > 0)
			noti_imgs.forEach((v, i) => {
				data.append(`noti_imgs[${i}]`, v);
			});
		postAdminNotice(data);
	};
	useEffect(() => {
		if (loading) setLoading(false);
	}, [loading]);
	return (
		<div className="popup board">
			<p className="tit mb20">글쓰기</p>
			<div className="board_form_row">
				<p>제목</p>
				<input type="text" placeholder="제목을 입력해주세요." id="title" />
			</div>
			<div className="board_form_row">
				<p>내용</p>
				<Editor
					id="test"
					editorState={editorState}
					toolbarClassName="toolbarClassName"
					wrapperClassName="wrapperClassName"
					editorClassName="editorClassName"
					onEditorStateChange={(contentState) => {
						setEditorState(contentState);
					}}
				/>
			</div>

			<div class="board_file_row">
				<div class="tit">첨부파일</div>
				<div class="file_area">
					<div class="filebox">
						<label for="ex_file">사진 업로드</label>
						<input
							type="file"
							id="ex_file"
							onChange={handleFileInput}
							accept="image/*"
						/>
					</div>
					<ul>
						{loading ? (
							<></>
						) : (
							noti_imgs.map((v, i) => {
								return (
									<li key={v.name} id={v.name}>
										<span>{v.name}</span>
										<div
											className="del_btn"
											onClick={(e) => {
												noti_imgs.splice(i, 1);
												setLoading(true);
											}}
										>
											<img
												src="/global/img/file_del_btn.gif"
												alt="파일 삭제"
											/>
										</div>
									</li>
								);
							})
						)}
					</ul>
				</div>
			</div>
			<div class="btn_area">
				<div class="bbtn darkGray" onClick={handleSubmit}>
					글 저장
				</div>
			</div>
		</div>
	);
}
