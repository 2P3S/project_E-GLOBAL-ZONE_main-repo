import React from "react";
import Calendar from "components/mobile/Calendar";
import List from "components/mobile/List";
import mockup from "test/mockup";

export default function Reservation() {
	return (
		<>
			<Calendar />
			<List data={mockup} />
		</>
	);
}
