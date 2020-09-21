import React, { useEffect } from "react";
import { Switch, Redirect, Route } from "react-router-dom";
import Login, { KoreanLogin, MobileLogin, AdminLogin } from "../../routes/Login/Login";
import SignUp from "../../routes/Login/SignUp";
import { isMobile } from "react-device-detect";
import ResetPassword from "../../routes/Login/ResetPassword";
/**
 * LoginRouter - Router for Login
 * @returns {JSX.Element}
 * @constructor
 */
export const LoginRouter = () => {
	useEffect(() => {
		// let link = document.getElementById("content");
		// link.innerHTML = "";
		// link.rel = "stylesheet";
		// link.href = "/css/content.css";
	}, []);
	return (
		<Switch>
			{/*<Redirect exact path="/" to={`/student`} />*/}

			<Route exact path="/foreigner" component={Login} />
			<Route exact path="/student" component={isMobile ? MobileLogin : KoreanLogin} />
			<Route exact path="/admin" component={AdminLogin} />

			<Route exact path="/:userClass/password" component={ResetPassword} />

			<Route exact path="/korean/signup" component={SignUp} />

			<Redirect path="/" to="/student" />
			{/* <Route path="/" component={isMobile ? MobileLogin : KoreanLogin} /> */}
		</Switch>
	);
};
