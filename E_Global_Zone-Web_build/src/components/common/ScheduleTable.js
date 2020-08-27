import React, { useEffect, useState } from "react";
import Modal from "../../components/common/modal/Modal";
import ShowList from "../../components/common/modal/ShowList";
import useClick from "../../modules/hooks/useClick";
import ConfirmResult from "./modal/ConfirmResult";
import conf from "../../conf/conf";
import ScheduleConf from "../../conf/scheduleConf";

/**
 * Schedule - a Schedule
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
const Schedule = (props) => {
	const [isOpen, setIsOpen] = useState(false);

	function handleOpen() {
		setIsOpen(true);
	}

	function handleClose() {
		setIsOpen(false);
	}

	const ref = useClick(handleOpen);
	return (
		<div className="status" ref={ref}>
			<p className={props.status}>{props.children}</p>
			<Modal isOpen={isOpen} onRequestClose={handleClose}>
				{props.status === "yellow" ? (
					<ConfirmResult scheduleId={props.schduleId} />
				) : (
					<ShowList handleClose={handleClose} isOpen={isOpen} />
				)}
			</Modal>
		</div>
	);
};

/**
 * ScheduleTable - Manager :: 스케줄 및 예약관리
 * @param scheduleList
 * @returns {JSX.Element}
 * @constructor
 */
export default function ScheduleTable({ scheduleList }) {
	// state1 :: [예약현황] 미승인 / 총 신청 학생
	// state2 :: [예약 승인 완료]
	// state3 :: [결과 미입력] 출석 학생
	// state4 :: [결과 입력 완료]
	// state5 :: [관리자 미승인] 출석 학생
	// state6 :: [관리자 승인 완료]
	// state7 :: 예약없음
	useEffect(() => {
		console.log(scheduleList);
	}, []);
	const printSchedule = (v) => {
		if (v) {
			switch (v.status) {
				case ScheduleConf.STATUS.RESERVATION_NOTHING:
					return (
						<Schedule status="state_box state7" scheduleId={v.scheduleId}>
							예약 없음
						</Schedule>
					);
				case ScheduleConf.STATUS.RESERVATION_DONE:
					return (
						<Schedule status="state_box state2" scheduleId={v.scheduleId}></Schedule>
					);
				case ScheduleConf.STATUS.RESERVATION_IN_PROGRESS:
					if (typeof v.value === "object") {
						return (
							<Schedule status="state_box state1" scheduleId={v.scheduleId}>
								<p>
									{v.value[0]} / <span>{v.value[1]}</span>
								</p>
							</Schedule>
						);
					} else {
						return (
							<>
								<Schedule
									status="blue oneline"
									scheduleId={v.scheduleId}
								>{`예약 미승인:${v.value}`}</Schedule>
							</>
						);
					}
				case ScheduleConf.STATUS.RESULT_IN_PROGRESS:
					return (
						<Schedule status="yellow" scheduleId={v.scheduleId}>
							{`참가학생:${v.value}`}
							<br />
							[결과 미승인]
						</Schedule>
					);
				case ScheduleConf.STATUS.RESULT_DONE:
					return (
						<Schedule status="puple oneline" scheduleId={v.scheduleId}>
							결과 입력완료
						</Schedule>
					);
				default:
					return "";
			}
		} else {
			return "";
		}
	};

	// 필요기능 클릭 시 해당 스케줄 정보
	return (
		<div className="scroll_area">
			<ul className="sch_time">
				<li>9AM</li>
				<li>10AM</li>
				<li>11AM</li>
				<li>12PM</li>
				<li>1PM</li>
				<li>2PM</li>
				<li>3PM</li>
				<li>4PM</li>
				<li>5PM</li>
				<li>6PM</li>
			</ul>
			<table className="sch_table">
				<colgroup>
					<col width="5%" />
					<col width="14%" />
					<col width="9%" span="9" />
				</colgroup>
				<tbody>
					<tr>
						<th scope="row" rowSpan={scheduleList[0].length + 1}>
							{conf.language.ENGLISH}
						</th>
					</tr>
					{scheduleList[0].map((value, index) => {
						return (
							<tr key={index}>
								<td>{value.name}</td>
								{value.schedule.map((v, index) => (
									<td key={index}>{printSchedule(v)}</td>
								))}
							</tr>
						);
					})}
					<tr>
						<th scope="row" rowSpan={scheduleList[1].length + 1}>
							{conf.language.CHINESE}
						</th>
					</tr>
					{scheduleList[1].map((value, index) => {
						return (
							<tr key={index}>
								<td>{value.name}</td>
								{value.schedule.map((v, index) => (
									<td key={index}>{printSchedule(v)}</td>
								))}
							</tr>
						);
					})}
					<tr>
						<th scope="row" rowSpan={scheduleList[2].length + 1}>
							{conf.language.JAPANESE}
						</th>
					</tr>
					{scheduleList[2].map((value, index) => {
						return (
							<tr key={index}>
								<td>{value.name}</td>
								{value.schedule.map((v, index) => (
									<td key={index}>{printSchedule(v)}</td>
								))}
							</tr>
						);
					})}
				</tbody>
			</table>
		</div>
	);
}
