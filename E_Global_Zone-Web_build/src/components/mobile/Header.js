import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import useClick from "../../modules/hooks/useClick";

/**
 * Header for Mobile
 * @returns {JSX.Element}
 * @constructor
 */
export default function Header() {
	const [pathname, setPathname] = useState(useHistory().location.pathname);
	let useClicks;
	const { home, reservation, schedule, result, login } = (useClicks = {
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
				} catch (error) {
					// console.log(error);
				}
			}
		}
	}, [pathname]);
	return (
		<>
			<div className="mhead">
				<div className="logo">
					<Link to="/">
						<img
							src="/global/mobile/img/logo.gif"
							alt="영진전문대학교 글로벌존 영문로고"
						/>
					</Link>
				</div>
				<div className="login">
					<div>
						<img src="/global/mobile/img/login_ico.gif" alt="로그인 페이지 이동" />
					</div>
				</div>
			</div>
			{/* {pathname !== "/login" ? (
				<div className="wrap">
					<ul className="tab no3">
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
			) : (
				<></>
			)} */}
		</>
	);
}
