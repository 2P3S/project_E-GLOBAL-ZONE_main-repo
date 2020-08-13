import React from "react";
import { Switch, Redirect, Route } from "react-router-dom";

import { Schedules, Students, Settings } from "routes/Web/Manager";
import SchdulesForeign from "routes/Web/Foreign/Schedules/Schedules";

export function ManagerRouter() {
	return (
		<>
			<div className="head">
				<div className="head_area">
					<div className="logo">
						<a href="#">
							<img src="/global/img/logo.gif" alt="영진전문대학교 로고" />
						</a>
					</div>
					<ul className="menu">
						<li>
							<a href="#">스케줄 및 예약관리</a>
						</li>
						<li>
							<a href="#">학생관리</a>
						</li>
						<li>
							<a href="#">시스템 환경설정</a>
						</li>
					</ul>
				</div>
			</div>
			<Switch>
				{/* <Redirect exact path="/" to={`/schedules/now`} /> */}

				<Route exact path="/" component={Schedules} />

				<Route exact path="/schedules/:term" component={Schedules} />
				{/* term => 학기 */}

				<Route exact path="/students/:term/:category" component={Students} />
				{/* category => foreigner, Korean */}

				<Route path="/settings" component={Settings} />
			</Switch>
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
