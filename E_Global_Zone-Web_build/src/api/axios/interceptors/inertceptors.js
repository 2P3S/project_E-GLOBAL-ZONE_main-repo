export function setInterceptors(instance, guard, isGoogle = false) {
	instance.interceptors.request.use(
		function (config) {
			// 헤더 - 토큰
			config.headers.Authorization = !isGoogle
				? `Bearer ${window.localStorage.getItem("token")}`
				: `${window.localStorage.getItem("token")}`;
			if (guard)
				config.params = {
					guard,
					...config.params,
				};
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

export function setLoginInterceptors(instance, provider) {
	instance.interceptors.request.use(
		function (config) {
			if (provider)
				config.params = {
					provider,
					...config.params,
				};
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
