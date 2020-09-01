// import defaultAxios from "axios";
// import conf from "../../conf/conf";

// /**
//  * Hooks - useAxios is returns response dataset
//  * @param {AxiosStatic, function} axiosInstance
//  * @param {object} opts url,
//  * @return {object} state response data
//  */
// // const useAxios = (opts, axiosInstance = defaultAxios) => {
// 	const [state, setState] = useState({
// 		loading: true,
// 		error: null,
// 		data: null,
// 	});
// 	useEffect(() => {
// 		axiosInstance(opts).then((data) => {
// 			setState({
// 				...state,
// 				error: null,
// 				loading: false,
// 				data: data.data,
// 			});
// 		});
// 	}, []);
// 	return state;
// };
//
// export const getAdminDeptList = (setState) => {
// 	defaultAxios({ url: conf.url + "/api/admin/department" }).then((res) => {
// 		setState(res.data);
// 	});
// };

/**
 * @param {AxiosStatic, function} axiosInstance
 * @param {object} opts url,
 */
// export const postAxios = (opts, history, axiosInstance = defaultAxios) => {
// 	let result = false;
// 	axiosInstance(opts).then((data) => {
// 		if (data.status === 202) {
// 			alert(data.data.message);
// 			history.push("/schedule");
// 		}
// 		if (data.status == 201) {
// 			alert(data.data.message);
// 			history.push("/schedule");
// 		}
// 	});
// };

// export const getKoreanReservation = (date, std_kor_id, setData) => {
// 	defaultAxios({
// 		url: conf.url + `/api/korean/reservation`,
// 		params: { search_date: date, std_kor_id },
// 	}).then((data) => {
// 		setData(data.data);
// 	});
// };

// export default useAxios;

/**
 * getKoreanReservationResult
 * @param sect_id
 * @param search_month
 * @param std_kor_id
 */
// export const getKoreanReservationResult = (sect_id, search_month, std_kor_id, setData) => {
// 	defaultAxios({
// 		url: conf.url + `/api/korean/reservation/result`,
// 		params: {
// 			sect_id,
// 			search_month,
// 			std_kor_id,
// 		},
// 	}).then((data) => {
// 		setData(data.data);
// 	});
// };

// export const getForeignerSchedule = (std_for_id, end_date, start_date, setData) => {
// 	console.log(conf.url + `/api/foreigner/schedule`, start_date, end_date);
// 	defaultAxios({
// 		url: conf.url + `/api/foreigner/schedule`,
// 		params: {
// 			start_date,
// 			end_date,
// 			std_for_id,
// 		},
// 	}).then((data) => {
// 		setData(data.data);
// 	});
// };

/**
 *
 * @param sch_id
 * @param result_start_img
 * @param result_end_4img
 * @todo => 이미지 데이터를 보내야 되는데 가질 못해!
//  */

// export const getForeignerReservation = (sch_id, std_for_id, setData) => {
// 	defaultAxios({
// 		url: conf.url + `/api/foreigner/reservation/${sch_id}`,
// 		params: {
// 			std_for_id,
// 		},
// 	}).then((res) => {
// 		setData(res.data);
// 	});
// };

// export const patchForeignerReservationPermission = (
// 	sch_id,
// 	permission_std_kor_id_list,
// 	not_permission_std_kor_id_list,
// 	setState
// ) => {
// 	defaultAxios({
// 		url: conf.url + `/api/foreigner/reservation/permission/${sch_id}`,
// 		method: "patch",
// 		data: { permission_std_kor_id_list, not_permission_std_kor_id_list },
// 		headers: {
// 			"Context-Type": "application/json",
// 		},
// 	})
// 		.then((res) => {
// 			res.status === 200 && setState(true);
// 		})
// 		.catch((e) => {
// 			console.log(e);
// 		});
// };

// export const postAdminForeignerAccount = (data, setState) => {
// 	defaultAxios({
// 		method: "post",
// 		url: conf.url + `/api/admin/foreigner/account`,
// 		data: data,
// 	})
// 		.then((res) => {
// 			setState(true);
// 		})
// 		.catch((e) => console.log(e));
// };

// export const getAdminForeignerWork = (setDataSet, sect_id = 5) => {
// 	defaultAxios({
// 		url: conf.url + `/api/admin/foreigner/work/${sect_id}`,
// 	}).then((res) => {
// 		setDataSet(res.data);
// 	});
// };

// export const getAdminSection = (year) => {
// 	defaultAxios({
// 		url: conf.url + `/api/admin/section`,
// 		params: {
// 			year,
// 		},
// 	});
// };

// export const getKoreanSection = (std_kor_id, setState) => {
// 	defaultAxios({
// 		url: conf.url + `/api/korean/section`,
// 		params: {
// 			std_kor_id,
// 		},
// 	}).then((res) => {
// 		setState(res.data.data);
// 	});
// };

// export const getAdminSetting = (setState) => {
// 	defaultAxios({
// 		url: conf.url + `/api/admin/setting`,
// 	}).then((res) => {
// 		setState(res.data);
// 	});
// };

// export const postAdminSetting = (settings) => {
// 	defaultAxios({
// 		method: "post",
// 		url: conf.url + `/api/admin/setting`,
// 		data: settings,
// 	}).then((res) => {
// 		// console.log(res.data);
// 	});
// };

// export const getAdminSection = (params, setState) => {
// 	defaultAxios({
// 		url: conf.url + `/api/admin/section`,
// 		params,
// 	}).then((res) => {
// 		setState(res.data);
// 	});
// };

// export const patchAdminSection = (sect_id, data, setIsDone) => {
// 	defaultAxios({
// 		method: "patch",
// 		url: conf.url + `/api/admin/section/${sect_id}`,
// 		data,
// 	})
// 		.then((res) => {
// 			setIsDone(true);
// 		})
// 		.catch(() => {
// 			setIsDone(false);
// 		});
// };

// export const postAdminSection = (data, setIsDone = function () {}) => {
// 	defaultAxios({
// 		method: "post",
// 		url: conf.url + `/api/admin/section`,
// 		data,
// 	})
// 		.then((res) => {
// 			setIsDone(true);
// 		})
// 		.catch(() => {
// 			setIsDone(false);
// 		});
// };

// export const getAdminForeignerNoWork = (sect_id, setState) => {
// 	defaultAxios({
// 		url: conf.url + `/api/admin/foreigner/no_work/${sect_id}`,
// 	}).then((res) => {
// 		setState(res.data.data);
// 	});
// };

// // /api/admin/foreigner/work
// export const postAdminForeignerWork = (data, setState) => {
// 	defaultAxios({
// 		method: "post",
// 		url: conf.url + `/api/admin/foreigner/work`,
// 		data,
// 	})
// 		.then((res) => {
// 			setState(true);
// 		})
// 		.catch((e) => {
// 			setState(false);
// 		});
// };

// api/admin/foreigner/account/1133445?favorite_bool=0

/**
 * getAdminForeignerAccountFavorite
 * @param {int} std_id
 * @param {int} isFavorite 0 or 1
 */
// export const getAdminForeignerAccountFavorite = (std_id, isFavorite) => {
// 	defaultAxios({
// 		url: conf.url + `api/admin/foreigner/account/${std_id}`,
// 		params: {
// 			favorite_bool: isFavorite,
// 		},
// // 	});
// // };

// export const postAdminSchedule = (data, isDone) => {
// 	defaultAxios({
// 		method: "POST",
// 		url: conf.url + `api/admin/schedule`,
// 		data,
// 	})
// 		.then((res) => {
// 			isDone(true);
// 		})
// 		.catch(() => {
// 			isDone(false);
// 		});
// };
// // api/admin/schedule?sect_id=1&std_for_id=1234567
// export const deleteAdminSchedule = (data, isDone) => {
// 	defaultAxios({
// 		method: "delete",
// 		url: conf.url + `api/admin/schedule`,
// 		params: data,
// 	})
// 		.then((res) => {
// 			console.log("done");
// 			isDone(true);
// 		})
// 		.catch(() => {
// 			isDone(false);
// 		});
// };

// /api/admin/foreigner?foreigners[0]=1234567
// export const getAdminForeignerInfo = (data, setData) => {
// 	defaultAxios({
// 		method: "get",
// 		url: conf.url + `api/admin/foreigner`,
// 		params: data,
// 	})
// 		.then((res) => {
// 			setData(res.data);
// 		})
// 		.catch(() => {
// 			setData(false);
// 		});
// };

// export const getAdminSchedule = (search_date, setData) => {
// 	defaultAxios({
// 		method: "get",
// 		url: conf.url + `api/admin/schedule`,
// 		params: search_date,
// 	})
// 		.then((res) => {
// 			setData(res.data);
// 		})
// 		.catch(() => {
// 			setData(false);
// 		});
// };

// http://hyun9803.iptime.org/api/admin/korean

// export const postAdminKorean = (data, setState) => {
// 	defaultAxios({
// 		method: "post",
// 		url: conf.url + `api/admin/korean`,
// 		data: data,
// 	})
// 		.then((res) => {
// 			if (res.status === 200) {
// 				setState(res.data);
// 			} else {
// 				setState([]);
// 			}
// 		})
// 		.catch((e) => {
// 			setState(e);
// 			console.log(e);
// 		});
// };

// export const postAdminScheduleAdd = (sch_id, data, setState) => {
// 	defaultAxios({
// 		method: "post",
// 		url: conf.url + `api/admin/schedule/add/${sch_id}`,
// 		data: data,
// 	})
// 		.then((res) => {
// 			if (res.status === 201) {
// 				setState("success");
// 			} else {
// 				setState("fail");
// 			}
// 		})
// 		.catch((e) => {
// 			setState("fail");
// 			console.log(e);
// 		});
// };

// export const deleteAdminScheduleAdd = (sch_id, handleClose) => {
// 	defaultAxios({
// 		method: "delete",
// 		url: conf.url + `api/admin/schedule/add/${sch_id}`,
// 	})
// 		.then((res) => {
// 			handleClose();
// 		})
// 		.catch((e) => {
// 			console.log(e);
// 		});
// };

// /api/admin/korean?page=${params.page}
// export const getAdminKorean = (page, setState) => {
// 	defaultAxios({
// 		method: "get",
// 		url: conf.url + `/api/admin/korean`,
// 		params: { page: page },
// 	})
// 		.then((res) => {
// 			setState(res.data);
// 		})
// 		.catch((e) => {
// 			console.log(e);
// 		});
// };

// http://hyun9803.iptime.org/api/admin/korean/restrict?std_kor_id=2050342&restrict_reason=사유입니다.&restrict_period=5

// export const postAdminKoreanRestrict = (data, setState) => {
// 	defaultAxios({
// 		method: "post",
// 		url: conf.url + `api/admin/korean/restrict`,
// 		data,
// 	})
// 		.then((res) => {
// 			res.status === 201 && setState(true);
// 		})
// 		.catch((e) => {
// 			console.log(e);
// 		});
// };
// export const patchAdminKoreanRestrict = (id, setState) => {
// 	defaultAxios({
// 		method: "patch",
// 		url: conf.url + `api/admin/korean/restrict/${id}`,
// 	})
// 		.then((res) => {
// 			res.status === 200 && setState(true);
// 		})
// 		.catch((e) => {
// 			console.log(e);
// 		});
// };

// http://hyun9803.iptime.org/api/admin/korean/account
// export const getAdminKoreanAccount = (setState) => {
// 	defaultAxios({
// 		url: conf.url + `api/admin/korean/account`,
// 	})
// 		.then((res) => {
// 			res.status === 200 && setState(res.data);
// 		})
// 		.catch((e) => {
// 			console.log(e);
// 		});
// };

// export const patchAdminKoreanAccount = (data, setState) => {
// 	defaultAxios({
// 		method: "patch",
// 		url: conf.url + `api/admin/korean/account`,
// 		data,
// 	})
// 		.then((res) => {
// 			res.status === 200 && setState(true);
// 		})
// 		.catch((e) => {
// 			console.log(e);
// 		});
// };

// export const deleteAdminScheduleSome = (sch_id, setState) => {
// 	defaultAxios({
// 		method: "delete",
// 		url: conf.url + `api/admin/schedule/some/${sch_id}`,
// 	})
// 		.then((res) => {
// 			res.status === 200 && setState(true);
// 		})
// 		.catch((e) => {
// 			console.log(e);
// 		});
// };
// http://hyun9803.iptime.org/api/admin/schedule/unapproved/2020-09-01

// export const getAdminScheduleUnaproved = (date, setState) => {
// 	defaultAxios({
// 		url: conf.url + `api/admin/schedule/unapproved/${date}`,
// 	})
// 		.then((res) => {
// 			res.status === 200 && setState(res.data);
// 		})
// 		.catch((e) => {
// 			console.log(e);
// 		});
// };

// http://hyun9803.iptime.org/api/admin/schedule/approval/3668

// export const patchAdminScheduleAprovel = (sch_id, data, setState) => {
// 	defaultAxios({
// 		method: "patch",
// 		url: conf.url + `api/admin/schedule/approval/${sch_id}`,
// 		data,
// 	})
// 		.then((res) => {
// 			res.status === 200 && setState(true);
// 		})
// 		.catch((e) => {
// 			console.log(e);
// 		});
// };
// api/admin/foreigner/account/1425197

// export const patchAdminForeignerAccount = (std_for_id, setState, data = {}, guard = "admin") => {
// 	defaultAxios({
// 		method: "patch",
// 		url: conf.url + `api/admin/foreigner/account/${std_for_id}`,
// 		data,
// 		params: { guard },
// 	})
// 		.then((res) => {
// 			res.status === 200 && setState(true);
// 		})
// 		.catch((e) => {
// 			console.log(e);
// 		});
// };

// // Login

// export const postLoginForeigner = (data, setState, setPending, provider = "foreigners") => {
// 	defaultAxios({
// 		method: "POST",
// 		url: conf.url + `login/foreigner`,
// 		params: { provider: provider },
// 		data,
// 	})
// 		.then((res) => {
// 			setPending(true);
// 			res.status === 200 && setState(res.data);
// 		})
// 		.catch((e) => console.log(e));
// };
