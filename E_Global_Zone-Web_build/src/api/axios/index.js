import axios from "axios";
import { setInterceptors, setLoginInterceptors } from "./interceptors/inertceptors";

// 엑시오스 기본 함수
function createDefaultInstance() {
	return axios.create({
		baseURL: process.env.REACT_APP_BASE_URL,
	});
}

// 엑시오스 가드 함수
function createInstanceGuard(url, guard = false) {
	const instance = axios.create({
		baseURL: `${process.env.REACT_APP_BASE_URL}${url}`,
	});

	return setInterceptors(instance, guard ? guard : url);
}

// 엑시오스 한국인 가드 함수
function createInstanceGuardKorean(url) {
	const instance = axios.create({
		baseURL: `${process.env.REACT_APP_BASE_URL}${url}`,
	});
	return setInterceptors(instance, false, true);
}

function createInstanceLogin(provider) {
	const instance = axios.create({
		baseURL: `${process.env.REACT_APP_BASE_URL}login/${provider}`,
	});
	return setLoginInterceptors(instance, `${provider}s`);
}

const instance = createDefaultInstance();
export const admin = createInstanceGuard("admin");
export const foreigner = createInstanceGuard("foreigner");
export const korean = createInstanceGuardKorean("korean");
export const koreanLogin = createInstanceGuardKorean("login/korean");

export const foreignerLogout = createInstanceGuard("logout", "foreigner");

// loginProvider

export const foreignerLogin = createInstanceLogin("foreigner");

// commons
export const getDepartment = () => instance.get("department");
