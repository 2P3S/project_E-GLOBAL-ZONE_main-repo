import React from "react";
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";
import { selectIsLogin, selectWhoAmI } from "../redux/loginSlice/loginSlice";
import { useSelector } from "react-redux";

import {
	Reservation,
	Schedules as Schedule,
	Results,
	ApplicationForm,
} from "../routes/Mobile/Korean";

import { Schedules, Students, Settings } from "../routes/Web/Manager";
import MobileHeader from "../components/mobile/Header";

/**
 * Functional Component of React to routing app
 * @constant {state} isLogin -> get login status from redux:login
 * @constant {state} whoAmI -> get device environment status from redux:login
 * @constant {state} id -> if user is loged in then get user id from redux:login
 *
 *
 * @returns
 *  @if(mobile) => Header + Router(mobile)
 *  @elseif(web) => Header + Router(web)
 *  @else(not loged in) => Redirection to Login Page
 */
function Routes() {
	const isLogin = useSelector(selectIsLogin);
	const whoAmI = useSelector(selectWhoAmI);
	// const id = 0;

	return (
		<Router>
			{isLogin ? (
				whoAmI === "Korean" ? (
					//mobile
					<>
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
							</Switch>
						</div>
					</>
				) : whoAmI === "Foreigner" ? (
					// web
					<Switch>
						<Redirect exact path="/" to={`/student`} />
					</Switch>
				) : (
					// whoAmI === "Manager"
					<Switch>
						<Redirect exact path="/" to={`/schedules/now`} />

						<Route exact path="/schedules/:term" component={Schedules} />
						{/* term => 학기 */}

						<Route exact path="/students/:term/:category" component={Students} />
						{/* category => foreigner, Korean */}

						<Route path="/settings" component={Settings} />
					</Switch>
				)
			) : (
				//notlogin
				<Switch>
					<Redirect exact path="/" to={`/student`} />

					<Route path="/student" component={login} />
					<Route path="/manager" component={login} />
				</Switch>
			)}
		</Router>
	);
}
const login = () => <></>;

export default Routes;
