import axios from "axios";

import { setInterceptors } from "./common/interceptors";
import conf from "../conf/conf";

// 엑시오스 초기화 함수
function createInstance() {
	return axios.create({
		baseURL: conf.url,
	});
}

// 엑시오스 초기화 함수
function createInstanceWithAuth(url) {
	const instance = axios.create({
		baseURL: `${conf.url}${url}`,
	});
	return setInterceptors(instance);
}

export const instance = createInstance();
export const afterAuth = createInstanceWithAuth("");
export const manager = createInstanceWithAuth("manager");
export const foreigner = createInstanceWithAuth("foreigner");
export const korean = createInstanceWithAuth("korean");
// export const
