import React, { useEffect, useState } from "react";
import Routes from "./Routes";

import { setDept, selectDept, setSelectDate } from "../redux/confSlice/confSlice";
import { useDispatch, useSelector } from "react-redux";

import { useHistory, useParams } from "react-router-dom";
import { getDepartment, getRestDate } from "../api/axios";
import { isMobile } from "react-device-detect";

/**
 * React App
 * @namespace App
 * @returns {JSX.Element} App with GlobalStyles, Routes
 */
const App = () => {
	const [data, setData] = useState();
	const dispatch = useDispatch();
	const dept = useSelector(selectDept);

	useEffect(() => {
		getDepartment().then((res) => setData(res.data));
	}, []);

	useEffect(() => {
		if (data && data.data) {
			dispatch(setDept(data));
		}
	}, [data]);
	return <>{dept ? <Routes /> : <>서버 오류입니다. 관리자에게 문의하십시오.</>}</>;
};

export default App;
