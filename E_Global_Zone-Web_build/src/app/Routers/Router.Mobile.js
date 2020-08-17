import React from "react";
import { Switch, Redirect, Route } from "react-router-dom";
import MobileHeader from "components/mobile/Header";
import { Reservation, Schedules as Schedule, Results, ApplicationForm } from "routes/Mobile/Korean";
import MobileLogin from "components/mobile/Login";
import Footer from "components/mobile/Footer";

export default () => {
	return (
		<div className="wrap">
			<MobileHeader />
			<Switch>
				<Redirect exact path="/" to={`/reservation`} />

				{/* 예약 조회 페이지 */}
				<Route exact path="/reservation" component={Reservation} />
				<Route path="/reservation/:id" component={ApplicationForm} />
				{/* 예약 폼 */}

				{/* 스케쥴 페이지 */}
				<Route path="/schedule" component={Schedule} />

				{/* 결과 페이지 */}
				<Route path="/result" component={Results} />

				{/* 임시 로그인 */}
				<Route path="/login" component={MobileLogin} />
			</Switch>
			<Footer />
		</div>
	);
};
