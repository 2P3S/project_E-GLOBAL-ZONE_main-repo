import React, { useEffect, useState } from "react";
import moment from "moment";
import Modal from "./Modal";
import ModalCalendar from "../../common/modal/ModalCalendar";
import useModal from "../../../modules/hooks/useModal";
import {
	getAdminSection,
	patchAdminSection,
	postAdminSection,
} from "../../../modules/hooks/useAxios";

export default function CreateSection({
	isSetSectMode,
	handleClose: thisHandleClose,
	selectSect: defaultSect,
}) {
	const [isLoading, setIsLoading] = useState(true);
	const [mode, setMode] = useState(isSetSectMode);
	const [currentSect, setCurrentSect] = useState({
		sect_name: "",
		sect_start_date: "YYYY-MM-DD",
		sect_end_date: "YYYY-MM-DD",
	});
	const { isOpen, handleOpen, handleClose } = useModal();
	const [isDone, setIsDone] = useState(false);
	const [resData, setResData] = useState();
	const [startDate, setStartDate] = useState("YYYY-MM-DD");
	const [endDate, setEndDate] = useState("YYYY-MM-DD");
	const [target, setTarget] = useState();
	const [selectSect, setSelectSect] = useState({
		year: moment(Date.now()).format("YYYY"), // YYYY
		sect: "1", // Sect
	});

	useEffect(() => {
		if (defaultSect) {
			getAdminSection({ name: defaultSect }, setResData);
		} else {
			getAdminSection(
				{ name: `${moment(Date.now()).format("YYYY학년도")} 1학기` },
				setResData
			);
		}
	}, []);

	useEffect(() => {
		if (resData) {
			if (resData.data && !Array.isArray(resData.data)) {
				setCurrentSect({ ...resData.data });
				setMode(false);
				setStartDate(moment(resData.data.sect_start_date).format("YYYY-MM-DD"));
				setEndDate(moment(resData.data.sect_end_date).format("YYYY-MM-DD"));
			} else {
				setCurrentSect({
					sect_name: "",
					sect_start_date: "",
					sect_end_date: "",
				});
				setMode(true);
				setStartDate("YYYY-MM-DD");
				setEndDate("YYYY-MM-DD");
			}
			setIsLoading(false);
			resData ? console.log(resData) : console.log();
		}
	}, [resData]);

	useEffect(() => {
		setCurrentSect({ ...currentSect, sect_start_date: startDate });
	}, [startDate]);
	useEffect(() => {
		setCurrentSect({ ...currentSect, sect_end_date: endDate });
	}, [endDate]);

	useEffect(() => {
		console.log(selectSect);
		getAdminSection({ name: `${selectSect.year}학년도 ${selectSect.sect}학기` }, setResData);
	}, [selectSect]);

	useEffect(() => {
		window.easydropdown.all();
	});

	useEffect(() => {
		if (isDone) {
			thisHandleClose();
		}
	}, [isDone]);

	const handleSetTarget = (target) => {
		setTarget(target);
	};

	return isLoading ? (
		<></>
	) : (
		<div className="popup semester">
			{isSetSectMode ? (
				<>
					<p className="tit">학기 기간 설정</p>
					<div className="top_select">
						<select
							name="catgo1"
							className="dropdown"
							onChange={(e) => {
								setSelectSect({ ...selectSect, year: e.target.value });
							}}
						>
							<option>{moment(Date.now()).format("YYYY")}</option>
							<option>{moment(Date.now()).add(1, "year").format("YYYY")}</option>
						</select>
						<span>학년도</span>
						<select
							name="catgo1"
							className="dropdown"
							onChange={(e) => {
								setSelectSect({ ...selectSect, sect: e.target.value });
							}}
						>
							<option>1</option>
							<option>여름</option>
							<option>2</option>
							<option>겨울</option>
						</select>
						<span>학기</span>

						<div
							className="btn"
							onClick={
								mode
									? () => {
											postAdminSection(
												{
													sect_name: `${selectSect.year}학년도 ${selectSect.sect}학기`,
													sect_start_date: startDate,
													sect_end_date: endDate,
												},
												setIsDone
											);
									}
									: () => {
											patchAdminSection(currentSect.sect_id, currentSect, setIsDone);
									}
							}
						>
							{mode ? "저장" : "수정"}
						</div>
					</div>
				</>
			) : (
				<p className="tit"> {defaultSect} 기간 설정</p>
			)}

			<div className="date_select">
				<div
					className="start_date"
					onClick={(e) => {
						handleOpen();
						handleSetTarget("sect_start_date");
					}}
				>
					<p className="tit">학기 시작일</p>
					<div className="date">{startDate}</div>
				</div>
				<span>-</span>
				<div
					className="start_date"
					onClick={(e) => {
						handleOpen();
						handleSetTarget("sect_end_date");
					}}
				>
					<p className="tit">학기 종료 일</p>
					<div className="date">{endDate}</div>
				</div>
			</div>

			{/* <div className="btn_area right"> << 위치 이동 >>
				<div
					className="bbtn darkGray"
					onClick={
						mode
							? () => {
									postAdminSection(
										{
											sect_name: `${selectSect.year}학년도 ${selectSect.sect}학기`,
											sect_start_date: startDate,
											sect_end_date: endDate,
										},
										setIsDone
									);
							  }
							: () => {
									patchAdminSection(currentSect.sect_id, currentSect, setIsDone);
							  }
					}
				>
					{mode ? "저장" : "수정"}
				</div>
			</div> */}
			<Modal isOpen={isOpen} handleClose={handleClose}>
				<ModalCalendar
					handleClose={handleClose}
					setState={target === "sect_start_date" ? setStartDate : setEndDate}
					isStartDate={target === "sect_start_date" ? true : false}
					selectDate={target === "sect_start_date" ? startDate : endDate}
				/>
			</Modal>
		</div>
	);
}
