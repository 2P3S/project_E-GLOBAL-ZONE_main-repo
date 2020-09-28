import React, { useEffect, useState } from "react";
import moment from "moment";
import Modal from "./Modal";
import ModalCalendar from "./ModalCalendar";
import useModal from "../../../modules/hooks/useModal";
import { getAdminSection, patchAdminSection, postAdminSection } from "../../../api/admin/section";

export default function ScheduleDownload() {
	const changeDate = (input) => {
		let output = moment(input, "YYYY-MM-DD").format("YYYY-MM-DD");
		if (input.length === 8) {
			input.substr(7, 1) === "-" && (output = "");
		}
		return output === "Invalid date" || input.length !== 8 ? input : output;
	};
	return (
		<div className="popup semester">
			<p className="tit">저장 기간 입력</p>
			<div className="top_select">
				<div className="btn">저장</div>
			</div>
			<div className="date_select">
				<div className="start_date">
					<input
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
