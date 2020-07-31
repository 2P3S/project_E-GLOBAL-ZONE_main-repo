import React from "react";
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";
import { selectIsLogin, selectIsMobile } from "../redux/loginSlice/loginSlice";
import { useSelector } from "react-redux";
import Reservation from "../routes/Reservation/Reservation";
import Schedule from "../routes/Schedule/Schedule";
import Result from "../routes/Result/Result";
import Header from "../components/mobile/Header";
const login = () => {
	return (
		<>
			<select>
				<option>관리자</option>
				<option>학생</option>
				<option>유학생</option>
			</select>
			<input type="text"></input>
			<input type="text"></input>
			<button>로그인</button>
		</>
	);
};
const webMain = () => {
	return <>webMain</>;
};
const mobile = () => {
	return <>mobile</>;
};
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
						<Header />
						<Switch>
							<Redirect exact path="/" to={`/reservation`} />
							{/* 예약 조회 페이지 */}
							<Route exact path="/reservation" component={Reservation} />
							<Route path="/reservation/:id" component={mobile} />
							{/* 예약 폼 */}

							{/* 스케쥴 페이지 */}
							<Route path="/schedule" component={Schedule} />

							{/* 결과 페이지 */}
							<Route path="/result" component={Result} />
						</Switch>
					</>
				) : (
					// web
					<Switch>
						<Route path="/" exact component={webMain} />
					</Switch>
				)
			) : (
				//notlogin
				<Switch>
					<Route path="/manager" component={login} />
					<Route path="/student" component={login} />
					<Route path="/foreign" component={login} />
				</Switch>
			)}
		</Router>
	);
}

export default Routes;
