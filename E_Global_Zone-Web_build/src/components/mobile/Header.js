import React from "react";
import { Link } from "react-router-dom";
import { googleLogout } from '@react-oauth/google';

/**
 * Header for Mobile
 * @returns {JSX.Element}
 * @constructor
 */
export default function Header() {
    const handleLogout = () => {
        googleLogout();
        window.localStorage.clear();
        window.location.href = '/';
    };

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
				<div className="login" onClick={handleLogout} style={{cursor: 'pointer'}}>
					Logout
				</div>
			</div>
		</>
	);
}
