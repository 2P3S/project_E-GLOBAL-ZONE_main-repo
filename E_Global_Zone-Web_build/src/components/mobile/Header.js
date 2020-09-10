import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import useClick from "../../modules/hooks/useClick";
import { GoogleLogout } from "react-google-login";

/**
 * Header for Mobile
 * @returns {JSX.Element}
 * @constructor
 */
export default function Header() {
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
					<GoogleLogout
						clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
						buttonText="Logout"
						onLogoutSuccess={(res) => {
							window.localStorage.clear();
							window.location.reload(true);
						}}
						onFailure={() => {
							window.localStorage.clear();
						}}
					/>
				</div>
			</div>
		</>
	);
}
