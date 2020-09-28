import React, { useEffect } from "react";
import { Switch, Redirect, Route } from "react-router-dom";

import { Schedules, Students, Settings, Section } from "routes/Web/Manager";

import Header from "../../components/common/Header";
import Footer from "../../components/common/Footer";
import Foreigner from "../../routes/Web/Manager/Students/Foreigner";
import ForeignerSchedules from "../../routes/Web/Foreigner/Schedules/Schedules";
import { useSelector } from "react-redux";
import { selectToday } from "../../redux/confSlice/confSlice";
import { selectUser } from "../../redux/userSlice/userSlice";
import ModifySection from "../../routes/Web/Manager/Section/ModifySection";

/**
 * ManagerRouter - Router for Manager
 * @returns {JSX.Element}
 * @constructor
 */
export function ManagerRouter() {
	const today = useSelector(selectToday);
	useEffect(() => {
		window.easydropdown.all();

		let link = document.getElementById("content");
		link.innerHTML = "";
		link.rel = "stylesheet";
		link.href = "/css/content.css";
		document.head.appendChild(link);
	}, []);
	return (
		<>
			<Header />
			<div className="wrapper">
				<Switch>
					{/* <Route exact path="/" component={Schedules} /> */}

					<Route exact path="/schedules/:date" component={Schedules} />
					{/* term => 학기 */}

					<Route exact path="/students/:page/korean" component={Students} />
					<Route exact path="/students/:sect_id/foreigner" component={Foreigner} />
					{/* category => foreigner, Korean */}

					<Route exact path="/settings" component={Settings} />

					<Route exact path="/section/:sect_id/:std_for_id" component={Section} />
					<Route
						exact
						path="/modify/section/:sect_id/:sch_start_date/:std_for_id"
						component={ModifySection}
					/>

					<Redirect path="/" to={`/schedules/${today}`} />
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
	const user = useSelector(selectUser);
	useEffect(() => {
		let link = document.getElementById("content");
		link.innerHTML = "";
		link.rel = "stylesheet";
		link.href = "/css/content.css";
		document.head.appendChild(link);
	}, []);
	return (
		<>
			<Header /> {/* 유학생용 헤더로 대체해야함 */}
			<Switch>
				<Route exact path="/" component={ForeignerSchedules} />
				<Redirect path="/" to={`/`} />
			</Switch>
			<Footer />
		</>
	);
}
