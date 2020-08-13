import React from "react";
import { Switch, Redirect, Route } from "react-router-dom";

export const LoginRouter = () => {
	return (
		<Switch>
			<Redirect exact path="/" to={`/student`} />

			<Route path="/student" component={""} />
			<Route path="/manager" component={""} />
		</Switch>
	);
};
