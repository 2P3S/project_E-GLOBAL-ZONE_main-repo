import React, { useEffect, useState } from "react";
import Routes from "./Routes";
import { getAdminDeptList } from "../modules/hooks/useAxios";
import { setDept, selectDept } from "../redux/confSlice/confSlice";
import { useDispatch, useSelector } from "react-redux";
import conf from "../conf/conf";
import { useHistory } from "react-router-dom";

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
		getAdminDeptList(setData);
	}, []);
	useEffect(() => {
		if (data && data.data) {
			dispatch(setDept(data));
		}
	}, [data]);
	return <>{dept && <Routes />}</>;
};

export default App;
