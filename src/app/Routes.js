import React from "react";
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";
import { selectIsLogin, selectIsMobile } from "../redux/loginSlice/loginSlice";
import { useSelector } from "react-redux";
import Reservation from "../routes/Reservation/Reservation";
import Schedule from "../routes/Schedule/Schedule";
import Result from "../routes/Result/Result";
import Header from "../components/mobile/Header";
const login = () => {
	return <>login</>;
};
const webMain = () => {
	return <>webMain</>;
};
const mobile = () => {
	return <>mobile</>;
};
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
							<Route path="/reservation" component={Reservation} />
							{/* 예약 폼 */}
							<Route path=":id" component={mobile} />

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
					<Route path="/" component={login} />
				</Switch>
			)}
		</Router>
	);
}

export default Routes;
