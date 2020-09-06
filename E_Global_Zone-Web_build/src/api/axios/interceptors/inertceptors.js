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
			error.response.data.message && alert(error.response.data.message);
			return Promise.reject(error);
		}
	);

	instance.interceptors.response.use(
		function (response) {
			if (response.status === 201) {
				response.data.message && alert(response.data.message);
			}
			return response;
		},
		function (error) {
			const { status } = error.response;
			const { message } = error.response.data;
			switch (status) {
				case 401:
					alert(message, 401);
					window.localStorage.clear();
					break;
				default:
					message && alert(message);
					break;
			}
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
			error.response.data.message && alert(error.response.data.message);
			return Promise.reject(error);
		}
	);

	instance.interceptors.response.use(
		function (response) {
			response.data.message && alert(response.data.message);
			return response;
		},
		function (error) {
			error.response.data.message && alert(error.response.data.message);
			return Promise.reject(error);
		}
	);
	return instance;
}
