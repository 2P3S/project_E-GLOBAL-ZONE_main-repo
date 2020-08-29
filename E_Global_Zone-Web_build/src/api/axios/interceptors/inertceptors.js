export function setInterceptors(instance, isGoogle = false) {
	instance.interceptors.request.use(
		function (config) {
			// 헤더 - 토큰
			config.headers.Authorization = !isGoogle
				? `Bearer ${window.localStorage.getItem("token")}`
				: `${window.localStorage.getItem("token")}`;
			return config;
		},
		function (error) {
			return Promise.reject(error);
		}
	);

	instance.interceptors.response.use(
		function (response) {
			return response;
		},
		function (error) {
			return Promise.reject(error);
		}
	);
	return instance;
}
