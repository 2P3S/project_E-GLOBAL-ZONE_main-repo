import React, { useState } from "react";
import Modal from "components/common/modal/Modal";
import InsertSchedule from "components/common/modal/InsertSchedule";
import ScheduleTable from "components/common/ScheduleTable";

const CheckBox = () => (
	<div className="check_box_area">
		<div className="check_box">
			<div className="check_box_input all">
				<input type="checkbox" id="allCheck" name="" />
				<label htmlFor="allCheck"></label>
			</div>
		</div>
		<div className="check_box">
			<div className="check_box_input">
				<input type="checkbox" id="no_app_reservation" name="" />
				<label htmlFor="no_app_reservation">
					<span>
						예약 미승인 <span className="blue">10</span>건
					</span>
				</label>
			</div>
		</div>
		<div className="check_box">
			<div className="check_box_input">
				<input type="checkbox" id="not_result" name="" />
				<label htmlFor="not_result">
					<span>
						결과 미입력 <span className="mint">2</span>건
					</span>
				</label>
			</div>
		</div>
		<div className="check_box">
			<div className="check_box_input">
				<input type="checkbox" id="no_app_result" name="" />
				<label htmlFor="no_app_result">
					<span>
						결과 미승인 <span className="yellow">3</span>건
					</span>
				</label>
			</div>
		</div>
		<div className="check_box">
			<div className="check_box_input">
				<input type="checkbox" id="ok_result" name="" />
				<label htmlFor="ok_result">
					<span>
						결과 입력완료 <span className="puple">2</span>건
					</span>
				</label>
			</div>
		</div>
	</div>
);
export default function Schedules() {
	const [insertIsOpen, setInsertIsOpen] = useState(false);

	const openSch = () => {
		setInsertIsOpen(true);
	};
	const closeSch = () => {
		setInsertIsOpen(false);
	};

	return (
		<div className="content">
			<div className="sub_title">
				<p className="tit">{new Date().toDateString().toUpperCase()}</p>
				<div className="select_date">
					<img src="/global/img/select_date_ico.gif" alt="날짜 선택" />
				</div>
				<CheckBox />
			</div>
			<div className="wrap">
				<ScheduleTable
					scheduleList={[
						[
							{
								name: "name",
								schedule: [
									null,
									{ id: 1, status: "nothing" },
									{ id: 2, status: "reserved", value: 10 },
									{ id: 3, status: "reserving", value: [5, 5] },
									{ id: 4, status: "reserving", value: 5 },
									{ id: 5, status: "result", value: 10 },
									{ id: 6, status: "done" },
									null,
									null,
								],
							},
							{
								name: "name",
								schedule: [
									null,
									{ id: 7, status: "nothing" },
									{ id: 8, status: "reserved", value: 10 },
									{ id: 9, status: "reserving", value: [5, 5] },
									{ id: 10, status: "reserving", value: 5 },
									{ id: 11, status: "result", value: 10 },
									{ id: 12, status: "done" },
									null,
									null,
								],
							},
							{
								name: "name",
								schedule: [
									null,
									{ id: 13, status: "nothing" },
									{ id: 14, status: "reserved", value: 10 },
									{ id: 15, status: "reserving", value: [5, 5] },
									{ id: 16, status: "reserving", value: 5 },
									{ id: 17, status: "result", value: 10 },
									{ id: 18, status: "done" },
									null,
									null,
								],
							},
						],
						[
							{
								name: "name",
								schedule: [
									null,
									{ id: 19, status: "nothing" },
									{ id: 20, status: "reserved", value: 10 },
									{ id: 0, status: "reserving", value: [5, 5] },
									{ id: 0, status: "reserving", value: 5 },
									{ id: 0, status: "result", value: 10 },
									{ id: 0, status: "done" },
									null,
									null,
								],
							},
							{
								name: "name",
								schedule: [
									null,
									{ id: 0, status: "nothing" },
									{ id: 0, status: "reserved", value: 10 },
									{ id: 0, status: "reserving", value: [5, 5] },
									{ id: 0, status: "reserving", value: 5 },
									{ id: 0, status: "result", value: 10 },
									{ id: 0, status: "done" },
									null,
									null,
								],
							},
							{
								name: "name",
								schedule: [
									null,
									{ id: 0, status: "nothing" },
									{ id: 0, status: "reserved", value: 10 },
									{ id: 0, status: "reserving", value: [5, 5] },
									{ id: 0, status: "reserving", value: 5 },
									{ id: 0, status: "result", value: 10 },
									{ id: 0, status: "done" },
									null,
									null,
								],
							},
						],
						[
							{
								name: "name",
								schedule: [
									null,
									{ id: 0, status: "nothing" },
									{ id: 0, status: "reserved", value: 10 },
									{ id: 0, status: "reserving", value: [5, 5] },
									{ id: 0, status: "reserving", value: 5 },
									{ id: 0, status: "result", value: 10 },
									{ id: 0, status: "done" },
									null,
									null,
								],
							},
							{
								name: "name",
								schedule: [
									null,
									{ id: 0, status: "nothing" },
									{ id: 0, status: "reserved", value: 10 },
									{ id: 0, status: "reserving", value: [5, 5] },
									{ id: 0, status: "reserving", value: 5 },
									{ id: 0, status: "result", value: 10 },
									{ id: 0, status: "done" },
									null,
									null,
								],
							},
							{
								name: "name",
								schedule: [
									null,
									{ id: 0, status: "nothing" },
									{ id: 0, status: "reserved", value: 10 },
									{ id: 0, status: "reserving", value: [5, 5] },
									{ id: 0, status: "reserving", value: 5 },
									{ id: 0, status: "result", value: 10 },
									{ id: 0, status: "done" },
									null,
									null,
								],
							},
						],
					]}
				/>
				<div className="table_btn">
					<a href="#" onClick={openSch}>
						개별 입력
					</a>
					<Modal isOpen={insertIsOpen} onRequestClose={closeSch}>
						<InsertSchedule closeSch={closeSch} />
					</Modal>
					<a href="#">CSV 입력</a>
				</div>
			</div>
		</div>
	);
}
