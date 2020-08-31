import React, { useEffect, useState } from "react";
import Calendar from "../../../../components/mobile/Calendar";
import TabView from "../../../../components/mobile/TabView";

import conf from "../../../../conf/conf";
import { getKoreanSchedule } from "../../../../api/korean";

/**
 * Korean :: 스케줄 조회
 * @returns {JSX.Element}
 * @constructor
 */
export default function Schedules() {
	const [data, setData] = useState();
	const [pending, setPending] = useState(false);
	useEffect(() => {
		getKoreanSchedule().then((res) => {
			setData(res.data);
			setPending(true);
		});
	}, []);

	return (
		<>
			<Calendar />
			{pending && <TabView list={data} />}
		</>
	);
}
