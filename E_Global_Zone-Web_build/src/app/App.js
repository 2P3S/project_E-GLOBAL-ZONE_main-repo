import React, { useEffect, useState } from "react";
import Routes from "./Routes";

import { setDept, selectDept, setSelectDate } from "../redux/confSlice/confSlice";
import { useDispatch, useSelector } from "react-redux";
import dotenv from "dotenv";
import conf from "../conf/conf";
import { useHistory, useParams } from "react-router-dom";
import { getDepartment } from "../api/axios";

dotenv.config();

/**
 * React App
 * @namespace App
 * @returns {JSX.Element} App with GlobalStyles, Routes
 */
const App = () => {
	const [data, setData] = useState();
	const dispatch = useDispatch();
	const dept = useSelector(selectDept);
	const history = useHistory();
	useEffect(() => {
		getDepartment().then((res) => setData(res.data));
		console.log(history);
	}, []);
	useEffect(() => {
		if (data && data.data) {
			dispatch(setDept(data));
		}
	}, [data]);
	return <>{dept && <Routes />}</>;
};

export default App;
