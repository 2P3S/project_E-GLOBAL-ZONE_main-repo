import React, { useEffect } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { selectIsLogin, selectUser } from "redux/loginSlice/loginSlice";
import { useSelector } from "react-redux";

import MobileRouter from "app/Routers/Router.Mobile";
import { ManagerRouter, ForeignerRouter } from "app/Routers/Router.Web";
import { LoginRouter } from "app/Routers/Router.Login";
import conf from "../conf/userConf";
import { logIn } from "../redux/loginSlice/loginSlice";

function Routes() {
	const isLogin = useSelector(selectIsLogin);
	const User = useSelector(selectUser);
	// const id = 0;
	useEffect(() => {
		logIn();
	}, []);
	return (
		<Router>
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

export default Routes;
