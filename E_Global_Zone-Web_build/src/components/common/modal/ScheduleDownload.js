import React, { useEffect, useState } from "react";
import moment from "moment";

import { getAdminExportReservation, getAdminExportSchedule } from "../../../api/admin/export";

export default function ScheduleDownload({ kindOfData }) {
	const changeDate = (input) => {
		let output = moment(input, "YYYY-MM-DD").format("YYYY-MM-DD");
		if (input.length === 8) {
			input.substr(7, 1) === "-" && (output = "");
		}
		return output === "Invalid date" || input.length !== 8 ? input : output;
	};
	const handleDownload = () => {
		let dateObj = {
			start_date: document.getElementById("start_date").value,
			end_date: document.getElementById("end_date").value,
		};
		switch (kindOfData) {
			case "schedule":
				getAdminExportSchedule(dateObj);
				break;
			case "reservation":
				getAdminExportReservation(dateObj);
				break;
			default:
				break;
		}
	};
	return (
		<div className="popup semester">
			<p className="tit">저장 기간 입력</p>
			<div className="top_select">
				<div className="btn" onClick={handleDownload}>
					저장
				</div>
			</div>
			<div className="date_select">
				<div className="start_date">
					<input
						id="start_date"
						type="text"
						className="date"
						style={{ outline: "none", borderWidth: "1px" }}
						placeholder="YYYYMMDD"
						maxLength="8"
						onChange={(e) => {
							e.target.value = changeDate(e.target.value);
						}}
					/>
				</div>
				<span>-</span>
				<div className="start_date">
					<input
						id="end_date"
						type="text"
						className="date"
						style={{ outline: "none", borderWidth: "1px" }}
						placeholder="YYYYMMDD"
						maxLength="10"
						onChange={(e) => {
							e.target.value = changeDate(e.target.value);
						}}
					/>
				</div>
			</div>
			<p style={{ color: "red" }}>※ 8자리 숫자로 입력해주세요.</p>
		</div>
	);
}
