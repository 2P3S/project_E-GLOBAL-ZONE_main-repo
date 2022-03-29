import axios from "axios";
import {
	setInterceptors,
	setLoginInterceptors,
	setRestDateInterceptors,
} from "./interceptors/inertceptors";

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
		headers: {
			"Access-Control-Allow-Origin": "*",
		},
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

function createRestDate(serviceKey) {
	const instance = axios.create({
		baseURL: `http://apis.data.go.kr/B090041/openapi/service/SpcdeInfoService/getRestDeInfo`,
	});
	return setRestDateInterceptors(instance, serviceKey);
}

export const instance = createDefaultInstance();
export const admin = createInstanceGuard("admin");
export const foreigner = createInstanceGuard("foreigner");
export const korean = createInstanceGuardKorean("korean");
export const koreanLogin = createInstanceGuardKorean("login/korean");

export const foreignerLogout = createInstanceGuard("logout", "foreigner");
export const adminLogout = createInstanceGuard("logout", "admin");
// loginProvider

export const foreignerLogin = createInstanceLogin("foreigner");
export const adminLogin = createInstanceLogin("admin");

// commons
export const getDepartment = () => instance.get("department");

export const getRestDate = (solYear, solMonth) =>
	createRestDate(process.env.REACT_APP_REST_DATE_SERVICE_KEY).get("", {
		params: { solYear, solMonth },
	});
