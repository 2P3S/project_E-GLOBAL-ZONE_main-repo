export function setInterceptors(instance, guard, isGoogle = false) {
	instance.interceptors.request.use(
		function (config) {
			// 헤더 - 토큰
			config.headers.Authorization = !isGoogle
				? guard === "foreigner"
					? `Bearer ${window.localStorage.getItem("global-zone-foreigner-token")}`
					: `Bearer ${window.localStorage.getItem("global-zone-admin-token")}`
				: `${window.localStorage.getItem("global-zone-korean-token")}`;
			if (guard)
				config.params = {
					guard,
					...config.params,
				};
			return config;
		},
		function (error) {
			alert(error.response.data.message);
			return Promise.reject(error);
		}
	);

	instance.interceptors.response.use(
		function (response) {
			if (response.status === 201 || response.status === 202) {
				alert(response.data.message);
			}
			return response;
		},
		function (error) {
			alert(error.response.data.message);
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
			alert(error.response.data.message);
			return Promise.reject(error);
		}
	);

	instance.interceptors.response.use(
		function (response) {
			alert(response.message);
			return response;
		},
		function (error) {
			alert(error.response.data.message);
			return Promise.reject(error);
		}
	);
	return instance;
}
