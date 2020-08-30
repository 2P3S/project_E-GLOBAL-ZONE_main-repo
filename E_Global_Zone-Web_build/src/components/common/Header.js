import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUser } from "../../redux/userSlice/userSlice";
import conf from "../../conf/conf";
import useModal from "../../modules/hooks/useModal";
import Modal from "./modal/Modal";
import { patchAdminForeignerAccount } from "../../modules/hooks/useAxios";
import { postForeignerLogout } from "../../api/foreigner";
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
		const password = document.getElementById("password");
		const checkPassword = document.getElementById("checkPassword");
		if (password.value !== "" && checkPassword.value !== "") {
			if (password.value === checkPassword.value) {
				setIsSame(true);
				console.log("same");
			} else {
				console.log("not same");
				setIsSame(false);
			}
		}
	};
	const handleClick = () => {
		console.log(user);
		isSame &&
			patchAdminForeignerAccount(
				user.id,
				setPending,
				{ std_for_passwd: document.getElementById("password").value },
				"foreigner"
			);
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
					</ul>
				) : (
					<ul className="menu">
						<li>
							<div onClick={handleOpen}>비밀번호 변경</div>
						</li>
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
						<Modal isOpen={isOpen} handleClose={handleClose}>
							<div>
								<p>비밀번호 변경 할거냐</p>
								<input
									id="password"
									type="password"
									onChange={handleChange}
									placeholder="비밀번호"
								/>
								<input
									id="checkPassword"
									type="password"
									onChange={handleChange}
									placeholder="비밀번호 확인"
								/>
								<button onClick={handleClick}>비밀번호 변경</button>
							</div>
						</Modal>
					</ul>
				)}
			</div>
		</div>
	);
}
