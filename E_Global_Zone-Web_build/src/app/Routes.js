import React, { useEffect } from "react";
import { BrowserRouter as Router, useHistory } from "react-router-dom";
import { selectIsLogin, selectUser } from "redux/userSlice/userSlice";
import { useSelector, useDispatch } from "react-redux";

import MobileRouter from "app/Routers/Router.Mobile";
import { ManagerRouter, ForeignerRouter } from "app/Routers/Router.Web";
import { LoginRouter } from "app/Routers/Router.Login";
import conf from "../conf/conf";
import { logOut, setClass } from "redux/userSlice/userSlice";

function Routes() {
	const isLogin = useSelector(selectIsLogin);
	const User = useSelector(selectUser);

	// const dispatch = useDispatch();
	return (
		<Router>
			<Test />
			{isLogin ? (
				User.getUserClass() === conf.userClass.KOREAN ? (
					//mobile
					<>
						<MobileRouter />
					</>
				) : User.getUserClass() === conf.userClass.FOREIGNER ? (
					// web
					<ForeignerRouter />
				) : (
					// User === "Manager"
					<ManagerRouter />
				)
			) : (
				//notlogin
				<LoginRouter />
			)}
		</Router>
	);
}

const Test = () => {
	const dispatch = useDispatch();
	const history = useHistory();
	const student = () => {
		dispatch(setClass(conf.userClass.KOREAN));
		history.push("/");
	};
	const foreigner = () => {
		dispatch(setClass(conf.userClass.FOREIGNER));
		history.push("/");
	};
	const manager = () => {
		dispatch(setClass(conf.userClass.MANAGER));
		history.push("/");
	};
	return (
		<div>
			<button onClick={student}>학생</button>
			<button onClick={foreigner}>유학생</button>
			<button onClick={manager}>관리자</button>
		</div>
	);
};

export default Routes;
