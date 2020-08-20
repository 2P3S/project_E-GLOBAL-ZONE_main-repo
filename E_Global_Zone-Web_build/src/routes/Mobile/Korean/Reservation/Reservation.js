import React from "react";
import Calendar from "components/mobile/Calendar";
import List from "components/mobile/List";
import mockup from "test/mockup";

/**
 * Korean :: 예약 조회
 * @returns {JSX.Element}
 * @constructor
 */
export default function Reservation() {
	return (
		<>
			<Calendar />
			<List data={mockup} />
		</>
	);
}
