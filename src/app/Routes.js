import React from "react";
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";
import { selectIsLogin, selectIsMobile } from "../redux/loginSlice/loginSlice";
import { useSelector } from "react-redux";
import Reservation from "../routes/Mobile/Reservation/Reservation";
import Schedule from "../routes/Mobile/Schedule/Schedule";
import Results from "../routes/Mobile/Results/Results";

import ApplicationForm from "../routes/Mobile/ApplicationForm/ApplicationForm";

/**
 * Functional Component of React to routing app
 * @constant {state} isLogin -> get login status from redux:login
 * @constant {state} isMobile -> get device environment status from redux:login
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
	const isMobile = useSelector(selectIsMobile);
	const id = 0;

	return (
		<Router>
			{isLogin ? (
				isMobile ? (
					//mobile
					<>
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
					</>
				) : (
					// web
					<Switch>
						<Route path="/" exact component={home} />
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
const home = () => <></>;

export default Routes;
