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
import Loader from "../Loader";
import { LANGUAGE } from "../../../conf/language";

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
	const {
		isOpen: loaderIsOpen,
		handleClose: handleCloseForLoader,
		handleOpen: handleOpenForLoader,
	} = useModal();

	const handleInputStartImage = async (e) => {
		if (data.has("result_start_img")) data.delete("result_start_img");
		const file = e.target.files[0];
		let compressedFile;
		handleOpenForLoader();
		try {
			compressedFile = await imageCompression(file, option);
			data.append("result_start_img", new File([compressedFile], file.name));
			let tag = document.getElementById("startImg");
			tag.value = file.name;
			tag.addEventListener("click", handleOpenForStartImg);
			imageCompression.getDataUrlFromFile(compressedFile).then((result) => {
				setStartImgUrl(result);
			});
		} catch (error) {
			console.log(error);
			alert("error");
		} finally {
			handleCloseForLoader();
		}
	};
	const handleInputEndImage = async (e) => {
		if (data.has("result_end_img")) data.delete("result_end_img");
		const file = e.target.files[0];
		let compressedFile;
		handleOpenForLoader();
		try {
			compressedFile = await imageCompression(e.target.files[0], option);
			compressedFile.name = file.name;
			data.append("result_end_img", new File([compressedFile], file.name));
			let tag = document.getElementById("endImg");
			tag.value = file.name;
			tag.addEventListener("click", handleOpenForEndImg);
			imageCompression.getDataUrlFromFile(compressedFile).then((result) => {
				setEndImgUrl(result);
			});
		} catch (error) {
			console.log(error);
			alert("error");
		} finally {
			handleCloseForLoader();
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
					<p className="tit">
						{LANGUAGE[window.localStorage.getItem("global-zone-lang")].recordAttendance}
					</p>

					<p className="txt">
						<span>
							{LANGUAGE[window.localStorage.getItem("global-zone-lang")].startTime}
						</span>{" "}
						{sch_start_date}
					</p>
					<p className="txt">
						<span>
							{LANGUAGE[window.localStorage.getItem("global-zone-lang")].endTime}
						</span>{" "}
						{sch_end_date}
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
												{
													LANGUAGE[
														window.localStorage.getItem(
															"global-zone-lang"
														)
													].attendance
												}
											</option>
											<option value={false} selected={!attendance}>
												{
													LANGUAGE[
														window.localStorage.getItem(
															"global-zone-lang"
														)
													].absence
												}
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
				<p>{LANGUAGE[window.localStorage.getItem("global-zone-lang")].startPicture}</p>
				<input type="text" id="startImg" class="upload-name" defaultValue="파일선택" />
				<label htmlFor="file1">
					{LANGUAGE[window.localStorage.getItem("global-zone-lang")].upload}
				</label>
				<input type="file" accept="image/*" id="file1" onChange={handleInputStartImage} />
			</div>

			<div class="filebox">
				<p>{LANGUAGE[window.localStorage.getItem("global-zone-lang")].endPicture}</p>
				<input id="endImg" class="upload-name" defaultValue="파일선택" />
				<label htmlFor="file">
					{LANGUAGE[window.localStorage.getItem("global-zone-lang")].upload}
				</label>
				<input type="file" accept="image/*" id="file" onChange={handleInputEndImage} />
			</div>

			<ul className="img_info">
				<li>{LANGUAGE[window.localStorage.getItem("global-zone-lang")].zoomNotice}</li>
				<li>{LANGUAGE[window.localStorage.getItem("global-zone-lang")].imgNotice}</li>
			</ul>

			<div className="btn_area right">
				<div className="bbtn mint" onClick={handleConfirm}>
					{LANGUAGE[window.localStorage.getItem("global-zone-lang")].save}
				</div>
				{/* <div className="bbtn red" onClick={handleConfirm}>
					삭제
				</div> */}
				{/* <div className="bbtn darkGray" onClick={handleClose}>
					닫기
				</div> */}
			</div>
			<Modal isOpen={startImgIsOpen} handleClose={handleCloseForStartImg}>
				<img id="startImg_img" src={startImgUrl} onClick={handleCloseForStartImg}></img>
			</Modal>
			<Modal isOpen={endImgIsOpen} handleClose={handleCloseForEndImg}>
				<img id="endImg_img" src={endImgUrl} onClick={handleCloseForEndImg}></img>
			</Modal>
			<Modal isOpen={loaderIsOpen}>
				<Loader />
			</Modal>
		</div>
	);
};

export default InsertResult;
