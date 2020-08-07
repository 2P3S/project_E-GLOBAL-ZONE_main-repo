import React from "react";
import Item from "./Item";
/**
 *  Item's props
 * language
 * foreignName
 * startTime
 * endTime
 * status => 출석 인증 완료, 출석 인증 대기, 예약 대기, 예약 완료, 미참석
 */

export default function List({ tabView, data = [] }) {
	return tabView ? (
		<div className="reservation_boxs tab_wrap">
			{data.map((item) => (
				<>
					<Item
						language={item.language}
						name={item.name}
						time={item.time}
						status={item.status}
					/>
				</>
			))}
		</div>
	) : (
		<div className="reservation_boxs">
			{data.map((item) => (
				<Item
					language={item.language}
					name={item.name}
					time={item.time}
					status={item.status}
				/>
			))}
		</div>
	);
}
