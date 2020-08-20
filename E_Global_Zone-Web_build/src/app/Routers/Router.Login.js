import React from "react";
import { Switch, Redirect, Route } from "react-router-dom";

/**
 * LoginRouter - Router for Login
 * @returns {JSX.Element}
 * @constructor
 */
export const LoginRouter = () => {
	return (
		<Switch>
			<Redirect exact path="/" to={`/student`} />

			<Route path="/student" component={""} />
			<Route path="/manager" component={""} />
		</Switch>
	);
};
