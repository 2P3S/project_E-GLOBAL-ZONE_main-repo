import React, { useState, useRef } from "react";
import Modal from "components/common/modal/Modal";
import ShowList from "components/common/modal/ShowList";
import useClick from "../../modules/hooks/useClick";
let i = 0;
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
				<ShowList handleClose={handleClose} isOpen={isOpen} />
			</Modal>
		</div>
	);
};

export default function ScheduleTable({ scheduleList }) {
	const printSchedule = (v) => {
		if (v) {
			switch (v.status) {
				case "nothing":
					return <Schedule status="gray oneline">예약 없음</Schedule>;
				case "reserved":
					return <Schedule status="mint oneline">{v.value}명 예약 완료</Schedule>;
				case "reserving":
					if (typeof v.value === "object") {
						return (
							<Schedule status="blue">
								{`신청한 학생:${v.value[0]}`}
								<br />
								{`예약 미승인:${v.value[1]}`}
							</Schedule>
						);
					} else {
						return (
							<Schedule status="blue oneline">{`예약 미승인:${v.value}`}</Schedule>
						);
					}
				case "result":
					return (
						<Schedule status="yellow">
							{`참가학생:${v.value}`}
							<br />
							[결과 미승인]
						</Schedule>
					);
				case "done":
					return <Schedule status="purple oneline">결과 입력완료</Schedule>;
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
							영어
						</th>
					</tr>
					{scheduleList[0].map((value, index) => {
						return (
							<tr key={i++}>
								<td>{value.name}</td>
								{value.schedule.map((v) => (
									<td key={i++}>{printSchedule(v)}</td>
								))}
							</tr>
						);
					})}
					<tr>
						<th scope="row" rowSpan={scheduleList[1].length + 1}>
							중국어
						</th>
					</tr>
					{scheduleList[1].map((value) => {
						return (
							<tr key={i++}>
								<td>{value.name}</td>
								{value.schedule.map((v) => (
									<td key={i++}>{printSchedule(v)}</td>
								))}
							</tr>
						);
					})}
					<tr>
						<th scope="row" rowSpan={scheduleList[2].length + 1}>
							일본어
						</th>
					</tr>
					{scheduleList[2].map((value) => {
						return (
							<tr key={i++}>
								<td>{value.name}</td>
								{value.schedule.map((v, index) => (
									<td key={i++}>{printSchedule(v)}</td>
								))}
							</tr>
						);
					})}
				</tbody>
			</table>
		</div>
	);
}
