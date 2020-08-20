import React from "react";
import Calendar from "components/mobile/Calendar";
import TabView from "components/mobile/TabView";

/**
 * Korean :: 스케줄 조회
 * @returns {JSX.Element}
 * @constructor
 */
export default function Schedules() {
	return (
		<>
			<Calendar />
			<TabView />
		</>
	);
}
