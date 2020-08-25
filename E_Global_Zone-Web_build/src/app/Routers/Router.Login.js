import React from "react";
import { Switch, Redirect, Route } from "react-router-dom";
import Login, {KoreanLogin} from "../../routes/Login/Login";

/**
 * LoginRouter - Router for Login
 * @returns {JSX.Element}
 * @constructor
 */
export const LoginRouter = () => {
	return (
		<Switch>
			{/*<Redirect exact path="/" to={`/student`} />*/}
			<Route exact path="/" component={Login} />
			<Route path="/student" component={KoreanLogin} />
			<Route path="/manager" component={""} />
		</Switch>
	);
};
