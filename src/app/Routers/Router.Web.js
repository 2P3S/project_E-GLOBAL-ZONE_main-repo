import React, { useEffect } from "react";
import { Switch, Redirect, Route } from "react-router-dom";

import { Schedules, Students, Settings } from "routes/Web/Manager";
import SchdulesForeign from "routes/Web/Foreign/Schedules/Schedules";
import Header from "components/common/Header";
import Footer from "components/common/Footer";
import Foreigner from "routes/Web/Manager/Students/Foreigner";

export function ManagerRouter() {
	useEffect(() => {
		window.easydropdown.all();
	}, []);
	return (
		<>
			<Header />
			<div className="wrapper">
				<Switch>
					{/* <Redirect exact path="/" to={`/schedules/now`} /> */}

					<Route exact path="/" component={Schedules} />

					<Route exact path="/schedules/:term" component={Schedules} />
					{/* term => 학기 */}

					<Route exact path="/students/:term/korean" component={Students} />
					<Route exact path="/students/:term/foreigner" component={Foreigner} />
					{/* category => foreigner, Korean */}

					<Route path="/settings" component={Settings} />
				</Switch>
			</div>
			<Footer />
		</>
	);
}
export function ForeignerRouter() {
	return (
		<Switch>
			<Redirect exact path="/" to={`/1`} />
			<Route path="/:id/schedule" component={SchdulesForeign} />
		</Switch>
	);
}
