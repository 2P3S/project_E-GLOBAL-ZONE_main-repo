import React, { useEffect } from "react";
import { BrowserRouter as Router, useHistory } from "react-router-dom";
import { selectIsLogin, selectUser } from "redux/userSlice/userSlice";
import { useSelector, useDispatch } from "react-redux";

import MobileRouter from "app/Routers/Router.Mobile";
import { ManagerRouter, ForeignerRouter } from "app/Routers/Router.Web";
import { LoginRouter } from "app/Routers/Router.Login";
import conf from "../conf/conf";
import { logOut, setClass } from "redux/userSlice/userSlice";
import {setTodayFuture, setTodayToday} from "../redux/confSlice/confSlice";

/**
 * Routes for Routers
 * @returns {JSX.Element}
 * @constructor
 */
function Routes() {
	const isLogin = useSelector(selectIsLogin);
	const User = useSelector(selectUser);
	return (
		<Router>
			<Test />
			{isLogin ? (
			User.userClass === conf.userClass.KOREAN ? (
					//mobile
					<>
						<MobileRouter />
					</>
				) : User.userClass === conf.userClass.FOREIGNER ? (
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

	const nakamura = 1231234
	const korean = 1321704
	const dispatch = useDispatch();
	const history = useHistory();
	const user = useSelector(selectUser);
	const student = () => {
		dispatch(setClass([korean,conf.userClass.KOREAN]));
		history.push("/");
	};
	const foreigner = () => {
		dispatch(setClass([nakamura,conf.userClass.FOREIGNER]));
		history.push("/");
	};
	const manager = () => {
		dispatch(setClass([user.id,conf.userClass.MANAGER]));
		history.push("/");
	};
	const future = () => {
		dispatch(setTodayFuture());
	}
	const today = () => {
		dispatch(setTodayToday());
	}
	return (
		<div>
			<button onClick={student}>학생</button>
			<button onClick={foreigner}>유학생</button>
			<button onClick={manager}>관리자</button>
			<button onClick={future}>미래</button>
			<button onClick={today}>현재</button>
		</div>
	);
};

export default Routes;
