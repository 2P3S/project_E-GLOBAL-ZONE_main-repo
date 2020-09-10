import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUser } from "../../redux/userSlice/userSlice";
import conf from "../../conf/conf";
import useModal from "../../modules/hooks/useModal";
import Modal from "./modal/Modal";
import { patchAdminForeignerAccount } from "../../api/admin/foreigner";
import { postForeignerLogout, patchPassword } from "../../api/foreigner";
import { postAdminLogout } from "../../api/admin";
/**
 * Header for Manager
 * @returns {JSX.Element}
 * @constructor
 */
export default function Header() {
	const history = useHistory();
	const user = useSelector(selectUser);
	const { isOpen, handleOpen, handleClose } = useModal();
	const [pending, setPending] = useState(false);
	const [isSame, setIsSame] = useState(false);
	useEffect(() => {
		pending && handleClose();
	}, [pending]);
	const handleChange = () => {
		const password = document.getElementById("_password");
		const checkPassword = document.getElementById("_checkPassword");
		if (password.value !== "" && checkPassword.value !== "") {
			if (password.value === checkPassword.value) {
				setIsSame(true);
			} else {
				setIsSame(false);
			}
		}
	};
	const handleClick = () => {
		isSame &&
			patchPassword({
				password: document.getElementById("_password").value,
			}).then((res) => {
				setPending(true);
				alert(res.data.message);
			});
	};
	return (
		<div className="head">
			<div className="head_area">
				<div className="logo">
					<Link to="/">
						<img src="/global/img/logo.gif" alt="영진전문대학교 로고" />
					</Link>
				</div>
				{user.userClass === conf.userClass.MANAGER ? (
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
						<li>
							<div
								onClick={() => {
									postAdminLogout().then(() => {
										window.localStorage.clear();
										alert("로그아웃 되었습니다.");
										window.location.replace("/");
									});
								}}
							>
								로그아웃
							</div>
						</li>
					</ul>
				) : (
					<ul className="menu">
						<li>
							<div
								onClick={() => {
									postForeignerLogout().then(() => {
										window.localStorage.clear();
										alert("로그아웃 되었습니다.");
										window.location.replace("/");
									});
								}}
							>
								로그아웃
							</div>
						</li>
					</ul>
				)}
			</div>
		</div>
	);
}
