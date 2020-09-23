import React, { useEffect, useRef, useState } from "react";
import imageCompression from "browser-image-compression";
import {
	postForeignerReservationResult,
	getForeignerReservation,
} from "../../../api/foreigner/reservation";
import { useSelector } from "react-redux";
import { selectUser } from "../../../redux/userSlice/userSlice";
import conf from "../../../conf/conf";
import Modal from "./Modal";
import useModal from "../../../modules/hooks/useModal";

const InsertResult = ({
	sch_id,
	handleClose,
	std_for_name,
	sch_start_date,
	sch_end_date,
	std_for_id,
	reRender,
}) => {
	const option = { maxSizeMb: 2, maxWidthOrHeight: 900 };
	const user = useSelector(selectUser);
	const [data, setData] = useState(new FormData());
	const [stdData, setStdData] = useState();
	const [pending, setPending] = useState(false);
	const [startImgUrl, setStartImgUrl] = useState("");
	const [endImgUrl, setEndImgUrl] = useState("");
	const {
		isOpen: startImgIsOpen,
		handleClose: handleCloseForStartImg,
		handleOpen: handleOpenForStartImg,
	} = useModal();
	const {
		isOpen: endImgIsOpen,
		handleClose: handleCloseForEndImg,
		handleOpen: handleOpenForEndImg,
	} = useModal();

	const handleInputStartImage = async (e) => {
		if (data.has("result_start_img")) data.delete("result_start_img");
		const file = e.target.files[0];
		let compressedFile;
		try {
			compressedFile = await imageCompression(file, option);
			data.append("result_start_img", compressedFile);
			let tag = document.getElementById("startImg");
			tag.value = file.name;
			tag.addEventListener("click", handleOpenForStartImg);
			imageCompression.getDataUrlFromFile(compressedFile).then((result) => {
				setStartImgUrl(result);
			});
		} catch (error) {
			console.log(error);
		}
	};
	const handleInputEndImage = async (e) => {
		if (data.has("result_end_img")) data.delete("result_end_img");
		const file = e.target.files[0];
		let compressedFile;
		try {
			compressedFile = await imageCompression(e.target.files[0], option);
			data.append("result_end_img", compressedFile);
			let tag = document.getElementById("endImg");
			tag.value = file.name;
			tag.addEventListener("click", handleOpenForEndImg);
			imageCompression.getDataUrlFromFile(compressedFile).then((result) => {
				setEndImgUrl(result);
			});
		} catch (error) {
			console.log(error);
		}
	};

	const handleConfirm = () => {
		let attendance_std_kor_id_list = [];
		let absent_std_kor_id_list = [];
		stdData.data.map((v) => {
			if (document.getElementById(`${v.std_kor_id}`).value === "true") {
				attendance_std_kor_id_list.push(v.std_kor_id);
			} else {
				absent_std_kor_id_list.push(v.std_kor_id);
			}
		});

		attendance_std_kor_id_list.map((v, index) => {
			data.append(`attendance_std_kor_id_list[${index}]`, v);
		});

		absent_std_kor_id_list.map((v, index) => {
			data.append(`absent_std_kor_id_list[${index}]`, v);
		});

		postForeignerReservationResult(sch_id, data, setPending);
	};

	useEffect(() => {
		getForeignerReservation(sch_id).then((res) => setStdData(res.data));
		window.easydropdown.all();
		return reRender;
	}, []);
	useEffect(() => {
		pending && handleClose();
	}, [pending]);
	useEffect(() => {
		window.easydropdown.all();
	});
	return (
		<div className="popup list">
			<div className="top_tit">
				<div className="left">
					<p className="tit">출석 결과 입력하기</p>

					<p className="txt">
						<span>시작시간</span> {sch_start_date}
					</p>
					<p className="txt">
						<span>종료시간</span> {sch_end_date}
					</p>
				</div>
				<p className="name">
					{user.userClass === conf.userClass.FOREIGNER ? user.name : std_for_name}
				</p>
			</div>

			<div className="student_list">
				<ul>
					{stdData && stdData.data ? (
						stdData.data.map((v, index) => {
							let attendance = v.res_state_of_attendance;
							return (
								<li key={v.std_kor_id + "index"}>
									<div className="student">
										<p className="name">{v.std_kor_name}</p>
										<select
											name={"catgo"}
											className={"dropdown"}
											id={v.std_kor_id}
											key={`${v.std_kor_id}`}
										>
											<option value={true} selected={attendance}>
												출석
											</option>
											<option value={false} selected={!attendance}>
												불참
											</option>
										</select>
									</div>
								</li>
							);
						})
					) : (
						<>Loading</>
					)}
				</ul>
			</div>

			<ul className="img_file">
				{/*<li>*/}
				{/*    <p className="file_no">파일 첨부 1</p>*/}
				{/*    <p className="file_name">0713_zoom_승인 이미지 파일_1.jpg</p>*/}
				{/*    <div className="del"><img src="/global/img/img_list_del.gif" alt="첨부 이미지 파일 삭제"/></div>*/}
				{/*</li>*/}
				{/*<li>*/}
				{/*    <p className="file_no">파일 첨부 2</p>*/}
				{/*    <p className="file_name">0713_zoom_승인 이미지 파일_2.jpg</p>*/}
				{/*    <div className="del"><img src="/global/img/img_list_del.gif" alt="첨부 이미지 파일 삭제"/></div>*/}
				{/*</li>*/}
			</ul>

			{/*<p className="attend_rate">출석율 : <span>60%</span></p>*/}

			{/* <input type="file" name="img" onChange={handleInputImage} /> */}

			<div class="filebox">
				<p>시작 사진</p>
				<input type="text" id="startImg" class="upload-name" defaultValue="파일선택" />
				<label htmlFor="file1">업로드</label>
				<input type="file" accept="image/*" id="file1" onChange={handleInputStartImage} />
			</div>

			<div class="filebox">
				<p>종료 사진</p>
				<input id="endImg" class="upload-name" defaultValue="파일선택" />
				<label htmlFor="file">업로드</label>
				<input type="file" accept="image/*" id="file" onChange={handleInputEndImage} />
			</div>

			<ul className="img_info">
				<li>· 줌 출석 및 종료 캡쳐 사진은 일시 및 시간이 잘 보이는 사진이어야 합니다.</li>
				<li>· 이미지 사이즈 및 크기 : 900 x 900 / 2MB 이하</li>
			</ul>

			<div className="btn_area right">
				<div className="bbtn mint" onClick={handleConfirm}>
					저장
				</div>
				{/* <div className="bbtn red" onClick={handleConfirm}>
					삭제
				</div> */}
				<div className="bbtn darkGray" onClick={handleClose}>
					닫기
				</div>
			</div>
			<Modal isOpen={startImgIsOpen} handleClose={handleCloseForStartImg}>
				<img id="startImg_img" src={startImgUrl} onClick={handleCloseForStartImg}></img>
			</Modal>
			<Modal isOpen={endImgIsOpen} handleClose={handleCloseForEndImg}>
				<img id="endImg_img" src={endImgUrl} onClick={handleCloseForEndImg}></img>
			</Modal>
		</div>
	);
};

export default InsertResult;
