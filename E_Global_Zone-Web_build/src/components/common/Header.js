import React from "react";
import { Link } from "react-router-dom";

/**
 * Header for Manager
 * @returns {JSX.Element}
 * @constructor
 */
export default function Header() {
	return (
		<div className="head">
			<div className="head_area">
				<div className="logo">
					<Link to="/">
						<img src="/global/img/logo.gif" alt="영진전문대학교 로고" />
					</Link>
				</div>
				<ul className="menu">
					<li>
						<Link to="/schedules/now">스케줄 및 예약관리</Link>
					</li>
					<li>
						<Link to="/students/now/korean">학생관리</Link>
					</li>
					<li>
						<Link to="/students/now/foreigner">유학생관리</Link>
					</li>
					<li>
						<Link to="/settings">시스템 환경설정</Link>
					</li>
				</ul>
			</div>
		</div>
	);
}
