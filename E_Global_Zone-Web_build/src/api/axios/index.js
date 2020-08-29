import axios from "axios";
import { setInterceptors } from "./interceptors/inertceptors";

// 엑시오스 초기화 함수
function createDefaultInstance() {
	return axios.create({
		baseURL: process.env.REACT_APP_BASE_URL,
	});
}

// 엑시오스 초기화 함수
function createInstanceGuard(url) {
	const instance = axios.create({
		baseURL: `${process.env.REACT_APP_BASE_URL}${url}`,
	});

	return setInterceptors(instance, url);
}

// 엑시오스 초기화 함수
function createInstanceGuardKorean(url) {
	const instance = axios.create({
		baseURL: `${process.env.REACT_APP_BASE_URL}${url}`,
	});
	return setInterceptors(instance, false, true);
}

const instance = createDefaultInstance();
export const admin = createInstanceGuard("admin");
export const foreigner = createInstanceGuard("foreigner");
export const korean = createInstanceGuardKorean("korean");

// commons
export const getDepartment = () => instance.get("department");
