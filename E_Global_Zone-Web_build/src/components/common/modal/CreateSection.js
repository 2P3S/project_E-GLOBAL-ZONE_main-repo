import React, { useEffect, useState } from "react";
import moment from "moment";
import Modal from "./Modal";
import ModalCalendar from "../../common/modal/ModalCalendar";
import useModal from "../../../modules/hooks/useModal";
import { getAdminSection, patchAdminSection, postAdminSection } from "../../../api/admin/section";
import { useHistory } from "react-router-dom";

export default function CreateSection({
	isSetSectMode,
	handleClose: thisHandleClose,
	selectSect: defaultSect,
}) {
	const history = useHistory();
	const [isLoading, setIsLoading] = useState(true);
	const [mode, setMode] = useState(isSetSectMode);
	const [currentSect, setCurrentSect] = useState({
		sect_name: "",
		sect_start_date: "YYYY-MM-DD",
		sect_end_date: "YYYY-MM-DD",
	});
	const [previousSect, setPreviousSect] = useState({
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
	const [selectSect, setSelectSect] = useState();

	const _setStartDate = (value) => {
		if (moment(value).isBefore(Date.now())) {
		} else {
			setStartDate(value);
		}
	};
	const _setEndDate = (value) => {
		if (moment(value).isBefore(Date.now())) {
		} else {
			setEndDate(value);
		}
	};

	useEffect(() => {
		console.log(defaultSect);
		if (defaultSect) {
			getAdminSection({ name: defaultSect }).then((res) => setResData(res.data));
		} else {
			setSelectSect({
				year: moment(Date.now()).format("YYYY"), // YYYY
				sect: "1", // Sect
			});
		}
		setIsLoading(true);
	}, []);

	useEffect(() => {
		if (resData) {
			if (resData.data && !Array.isArray(resData.data)) {
				setCurrentSect({ ...resData.data });
				setPreviousSect({ ...resData.data });
				setMode(false);
				setStartDate(
					moment(resData.data.sect_start_date, "YYYY-MM-DD").format("YYYY-MM-DD")
				);
				setEndDate(moment(resData.data.sect_end_date, "YYYY-MM-DD").format("YYYY-MM-DD"));
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
			resData ? process.env.REACT_APP_DEVELOP_MODE && console.log(resData) : console.log();
		}
	}, [resData]);

	useEffect(() => {
		setCurrentSect({ ...currentSect, sect_start_date: startDate });
	}, [startDate]);
	useEffect(() => {
		setCurrentSect({ ...currentSect, sect_end_date: endDate });
	}, [endDate]);

	useEffect(() => {
		process.env.REACT_APP_DEVELOP_MODE && console.log(selectSect);
		selectSect &&
			getAdminSection({
				name: `${selectSect.year}학년도 ${selectSect.sect}학기`,
			}).then((res) => setResData(res.data));
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
								moment(endDate, "YYYY-MM-DD") > moment(Date.now())
									? mode
										? () => {
												postAdminSection({
													sect_name: `${selectSect.year}학년도 ${selectSect.sect}학기`,
													sect_start_date: startDate,
													sect_end_date: endDate,
												}).then((res) => {
													setIsDone(true);
												});
										  }
										: () => {
												if (window.confirm("학기를 수정하시겠습니까?"))
													patchAdminSection(
														currentSect.sect_id,
														currentSect
													).then((res) => {
														// setIsDone(true);
														alert(res.data.message);
														if (
															moment(
																currentSect.sect_end_date
															).isAfter(
																moment(previousSect.sect_end_date)
															)
														) {
															alert(
																"새로 생성된 기간에 스케줄을 입력합니다."
															);
															history.push(
																`/modify/section/${
																	currentSect.sect_id
																}/${moment(
																	previousSect.sect_end_date
																)
																	.add(1, "day")
																	.format("YYYY-MM-DD")}/0`
															);
														}
													});
										  }
									: () => alert("이미 종료 된 학기입니다.")
							}
						>
							{mode ? "저장" : "수정"}
						</div>
					</div>
				</>
			) : (
				<>
					<p className="tit"> {defaultSect} 기간 설정</p>
					<div className="top_select">
						<div
							className="btn"
							onClick={
								mode
									? () => {
											postAdminSection({
												sect_name: `${selectSect.year}학년도 ${selectSect.sect}학기`,
												sect_start_date: startDate,
												sect_end_date: endDate,
											}).then((res) => {
												setIsDone(true);
											});
									  }
									: () => {
											patchAdminSection(
												currentSect.sect_id,
												currentSect
											).then((res) => {
												setIsDone(true);
											});
									  }
							}
						>
							{mode ? "저장" : "수정"}
						</div>
					</div>
				</>
			)}

			<div className="date_select">
				<div
					className="start_date"
					onClick={(e) => {
						if (mode || moment(startDate, "YYYY-MM-DD") > moment(Date.now())) {
							handleOpen();
							handleSetTarget("sect_start_date");
						}
					}}
				>
					<p className="tit">학기 시작일</p>
					<div className="date">{startDate}</div>
				</div>
				<span>-</span>
				<div
					className="start_date"
					onClick={(e) => {
						if (mode || moment(endDate, "YYYY-MM-DD") > moment(Date.now())) {
							handleOpen();
							handleSetTarget("sect_end_date");
						}
					}}
				>
					<p className="tit">학기 종료 일</p>
					<div className="date">{endDate}</div>
				</div>
			</div>
			<Modal isOpen={isOpen} handleClose={handleClose} btn={false}>
				<ModalCalendar
					handleClose={handleClose}
					setState={target === "sect_start_date" ? _setStartDate : _setEndDate}
					isStartDate={target === "sect_start_date" ? true : false}
					selectDate={
						target === "sect_start_date"
							? startDate === "YYYY-MM-DD"
								? moment(Date.now())
								: moment(startDate, "YYYY-MM-DD").format("YYYY-MM-DD")
							: endDate === "YYYY-MM-DD"
							? moment(Date.now())
							: moment(endDate, "YYYY-MM-DD").format("YYYY-MM-DD")
					}
				/>
			</Modal>
		</div>
	);
}
