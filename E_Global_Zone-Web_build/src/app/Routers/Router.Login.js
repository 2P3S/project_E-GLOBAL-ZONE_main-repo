import React from "react";
import { Switch, Redirect, Route } from "react-router-dom";
import Login, { KoreanLogin, MobileLogin } from "../../routes/Login/Login";
import SignUp from "../../routes/Login/SignUp";
import { isMobile } from "react-device-detect";
/**
 * LoginRouter - Router for Login
 * @returns {JSX.Element}
 * @constructor
 */
export const LoginRouter = () => {
	return (
		<Switch>
			{/*<Redirect exact path="/" to={`/student`} />*/}

			<Route exact path="/foreigner" component={Login} />
			<Route exact path="/student" component={KoreanLogin} />
			<Route exact path="/manager" component={""} />

			<Route path="/" component={isMobile ? MobileLogin : KoreanLogin} />

			<Route exact path="/korean/sign-up" component={SignUp} />
		</Switch>
	);
};
