import React, { useEffect } from "react";
import Item from "./Item";
import { useSelector } from "react-redux";
import { selectToday } from "../../redux/confSlice/confSlice";
/**
 *  Item's props
 * language
 * foreignName
 * startTime
 * endTime
 * status => 출석 인증 완료, 출석 인증 대기, 예약 대기, 예약 완료, 미참석
 */

/**
 * List for Item
 * @param tabView
 * @param data
 * @returns {JSX.Element}
 * @constructor
 */
export default function List({ tabView, data }) {
	const toDay = useSelector(selectToday);
	useEffect(() => {
		console.log(data);
	});
	return tabView ? (
		<div className="reservation_boxs tab_wrap">
			{data &&
				data.data &&
				data.data.map((item) => {
					return (
						<>
							<Item
								id={item.sch_id}
								language={item.std_for_lang}
								name={item.std_for_name}
								time={[
									item.sch_start_date.substr(10, 9),
									item.sch_end_date.substr(10, 9),
								]}
								status={item.sch_res_available}
							/>
						</>
					);
				})}
		</div>
	) : (
		<div className="reservation_boxs">
			{data.data.map((item) => {
				let status;
				if (new Date(item.sch_end_date) > new Date(toDay)) {
					console.log("시작안됨");
					if (item.res_state_of_permission) {
						status = "reserved";
					} else {
						status = "pending";
					}
				} else {
					console.log("완료됨");
					if (item.sch_state_of_result_input) {
						if (item.res_state_of_attendance) {
							status = "confirm";
						} else {
							status = "absent";
						}
					} else {
						status = "done";
					}
				}

				console.log(status);
				return (
					<Item
						id={item.sch_id}
						language={item.std_for_lang}
						name={item.std_for_name}
						time={[item.sch_start_date.substr(10, 9), item.sch_end_date.substr(10, 9)]}
						status={status}
						zoomPw={item.sch_for_zoom_pw}
						zoomId={item.std_for_zoom_id}
					/>
				);
			})}
		</div>
	);
}
