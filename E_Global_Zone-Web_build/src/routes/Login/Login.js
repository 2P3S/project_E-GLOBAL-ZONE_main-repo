import React, { useRef, useState, useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";
import useClick from "../../modules/hooks/useClick";
import { useDispatch, useSelector } from "react-redux";
import { logIn, setClass } from "../../redux/userSlice/userSlice";
import { blankValidator } from "../../modules/validator";
import conf from "../../conf/conf";
import { postLoginForeigner } from "../../modules/hooks/useAxios";

const Login = () => {
	const dispatch = useDispatch();
	const login = useSelector(logIn);
	const history = useHistory();
	const id = useRef();
	const pw = useRef();

	const [data, setData] = useState();
	const [pending, setPending] = useState(false);

	useEffect(() => {
		console.log(pending, data);
		if (pending) {
			if (data) {
				console.log(data);
				alert(data.message);

				window.localStorage.setItem("token", data.token);
				window.localStorage.setItem("loginId", data.data.info.std_for_id);
				window.localStorage.setItem("loginName", data.data.info.std_for_name);
				window.localStorage.setItem("userClass", conf.userClass.FOREIGNER);
			}
		}
		return;
	}, [pending, data]);

	const handleLogin = () => {
		const { value: idValue } = id.current;
		const { value: pwValue } = pw.current;
		if (blankValidator(idValue, pwValue));
		console.log("login", idValue, pwValue);
		postLoginForeigner({ std_for_id: idValue, password: pwValue }, setData, setPending);
	};

	return (
		<div className="content">
			<div className="sub_title">
				<p className="tit">글로벌존 서비스 로그인</p>
			</div>
			<div className="login_wrap">
				<p className="tit">Login</p>
				<LoginHeader />
				<div className="login_input">
					<input type="text" name="id" placeholder="학번을 입력해주세요." ref={id} />
					<input
						type="password"
						name="password"
						placeholder="비밀번호를 입력해주세요."
						ref={pw}
					/>
					<div className="submit" onClick={handleLogin}>
						로그인
					</div>
				</div>
			</div>
		</div>
	);
};

export const KoreanLogin = () => {
	const dispatch = useDispatch();
	const history = useHistory();
	const googleLogin = () => {}; //googleLogin
	return (
		<div className="content">
			<div className="sub_title">
				<p className="tit">글로벌존 서비스 로그인</p>
			</div>
			<div className="login_wrap">
				<p className="tit">Login</p>
				<LoginHeader />
				<div
					className="gsuite_login"
					onClick={() => {
						if (googleLogin) {
						}
						dispatch(logIn());
						dispatch(setClass([1, conf.userClass.KOREAN]));
						history.push("/");
					}}
				>
					<div className="btn">g.yju.ac.kr 계정으로 로그인하기</div>
					<p>@g.yju.ac.kr 로 끝나는 G-suite 계정만 사용이 가능합니다.</p>
				</div>
			</div>
		</div>
	);
};

function LoginHeader() {
	const history = useHistory();
	const location = useLocation();
	return (
		<ul className="tab no2">
			<li
				className={location.pathname === "/student" && "on"}
				onClick={() => {
					history.push("/student");
				}}
			>
				한국인 학생
			</li>
			<li
				className={location.pathname === "/foreigner" && "on"}
				onClick={() => {
					history.push("/foreigner");
				}}
			>
				유학생
			</li>
		</ul>
	);
}

export default Login;
