import React, { useEffect, useState } from "react";
import Calendar from "../../../../components/mobile/Calendar";
import TabView from "../../../../components/mobile/TabView";
import useAxios from "../../../../modules/hooks/useAxios";
import conf from "../../../../conf/conf";

/**
 * Korean :: 스케줄 조회
 * @returns {JSX.Element}
 * @constructor
 */
export default function Schedules() {
	const [data, setData] = useState();
	const { loading, error, data: resData } = useAxios({ url: conf.url + `api/korean/schedule` });
	async function getResData(loading, error, data) {
		if (!loading) {
			console.log(data.result);
			setData(data.result);
		}
	}
	useEffect(() => {
		getResData(loading, error, resData);
	});
	return (
		<>
			<Calendar />
			{!loading ? <TabView list={data} /> : <></>}
		</>
	);
}
