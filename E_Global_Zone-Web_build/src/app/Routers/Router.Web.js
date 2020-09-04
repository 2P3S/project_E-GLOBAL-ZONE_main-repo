import React, { useEffect } from "react";
import { Switch, Redirect, Route } from "react-router-dom";

import { Schedules, Students, Settings, Section } from "routes/Web/Manager";

import Header from "../../components/common/Header";
import Footer from "../../components/common/Footer";
import Foreigner from "../../routes/Web/Manager/Students/Foreigner";
import ForeignerSchedules from "../../routes/Web/Foreigner/Schedules/Schedules";
import { useSelector } from "react-redux";
import { selectToday } from "../../redux/confSlice/confSlice";

/**
 * ManagerRouter - Router for Manager
 * @returns {JSX.Element}
 * @constructor
 */
export function ManagerRouter() {
	const today = useSelector(selectToday);
	useEffect(() => {
		window.easydropdown.all();
	}, []);
	return (
		<>
			<Header />
			<div className="wrapper">
				<Switch>
					<Redirect exact path="/" to={`/schedules/${today}`} />

					{/* <Route exact path="/" component={Schedules} /> */}

					<Route exact path="/schedules/:date" component={Schedules} />
					{/* term => 학기 */}

					<Route exact path="/students/:page/korean" component={Students} />
					<Route exact path="/students/:sect_id/foreigner" component={Foreigner} />
					{/* category => foreigner, Korean */}

					<Route path="/settings" component={Settings} />

					<Route path="/section/:sect_id/:std_for_id" component={Section} />
				</Switch>
			</div>
			<Footer />
		</>
	);
}

/**
 * ForeignerRouter - Router for Foreigner students
 * @returns {JSX.Element}
 * @constructor
 */
export function ForeignerRouter() {
	return (
		<>
			<Header /> {/* 유학생용 헤더로 대체해야함 */}
			<Switch>
				<Redirect exact path="/" to={`/1`} />
				<Route exact path="/:id" component={ForeignerSchedules} />
			</Switch>
			<Footer />
		</>
	);
}
