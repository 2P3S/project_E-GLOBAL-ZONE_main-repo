import React, { useEffect, useState } from "react";
import { Switch, Redirect, Route, Link, useHistory, useLocation } from "react-router-dom";
import MobileHeader from "../../components/mobile/Header";
import {
	Reservation,
	Schedules as Schedule,
	Results,
	ApplicationForm,
} from "../../routes/Mobile/Korean";
import MobileLogin from "../../components/mobile/Login";
import Footer from "../../components/mobile/Footer";
import useClick from "../../modules/hooks/useClick";

/**
 * MobileRouter - Router for Mobile(Korean students)
 * @returns {JSX.Element}
 */
export default () => {
	const [pathname, setPathname] = useState(useHistory().location.pathname);
	let useClicks;
	const location = useLocation();
	const { reservation, schedule, result } = (useClicks = {
		home: useClick(() => setPathname("/reservation")),
		reservation: useClick(() => setPathname("/reservation")),
		schedule: useClick(() => setPathname("/schedule")),
		result: useClick(() => setPathname("/result")),
		login: useClick(() => setPathname("/login")),
	});
	useEffect(() => {
		for (const key in useClicks) {
			if (useClicks.hasOwnProperty(key)) {
				const element = useClicks[key];
				try {
					if (`/${key}` === pathname) {
						element.current.className = "on";
					} else {
						element.current.className = "";
					}
				} catch (e) {}
			}
		}
	}, [pathname]);
	useEffect(() => {
		let link = document.getElementById("content");
		link.innerHTML = "";
		link.rel = "stylesheet";
		link.href = "/css/mobile/content.css";
		document.head.appendChild(link);
	}, []);
	const handleClick = (e) => {
		for (let i = 1; i <= 3; i++) {
			document.getElementById(`tab${i}`).classList.remove("on");
		}
		e.target.classList.add("on");
	};
	useEffect(() => {
		switch (location.pathname) {
			case "/reservation":
				reservation.current.className = "on";
				schedule.current.className = "";
				result.current.className = "";
				break;
			case "/schedule":
				reservation.current.className = "";
				schedule.current.className = "on";
				result.current.className = "";
				break;
			case "/result":
				reservation.current.className = "";
				schedule.current.className = "";
				result.current.className = "on";
				break;

			default:
				break;
		}
	});

	return (
		<>
			<div className="all">
				<MobileHeader />
				<div className="wrapper">
					<div className="mtab">
						<ul className="no3">
							<li>
								<Link ref={reservation} to="/reservation" className="on">
									예약 조회
								</Link>
							</li>
							<li>
								<Link ref={schedule} to="/schedule">
									스케줄 조회
								</Link>
							</li>
							<li>
								<Link ref={result} to="/result">
									결과 관리
								</Link>
							</li>
						</ul>
					</div>

					<Switch>
						{/* 예약 조회 페이지 */}
						<Route exact path="/reservation" component={Reservation} />
						<Route path="/schedule/:id" component={ApplicationForm} />
						{/* 예약 폼 */}

						{/* 스케쥴 페이지 */}
						<Route path="/schedule" component={Schedule} />

						{/* 결과 페이지 */}
						<Route path="/result" component={Results} />

						{/* 임시 로그인 */}
						<Route path="/login" component={MobileLogin} />

						<Redirect path="/" to={`/reservation`} />
					</Switch>
				</div>
				<Footer />
			</div>
		</>
	);
};
