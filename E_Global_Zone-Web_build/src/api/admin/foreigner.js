import { admin } from "../axios";

function foreigner(url) {
	return `foreigner/${url}`;
}

export const postAdminForeignerAccount = (data) => admin.post(foreigner("account"), data);
export const postAdminForeignerSearch = (data) => admin.post(foreigner('search'), data);

export const updateAdminForeignerAccount = (std_for_id, data) =>
	admin.patch(foreigner(`account/update/${std_for_id}`), data);

export const patchAdminForeignerAccount = (std_for_id) =>
	admin.patch(foreigner(`account/${std_for_id}`));
export const deleteAdminForeignerAccount = (std_for_id) =>
	admin.delete(foreigner(`account/${std_for_id}`));

export const getAdminForeignerAll = (params) => admin.get(foreigner('all'), { params });
export const getAdminForeignerWork = (sect_id) => admin.get(foreigner(`work/${sect_id}`));
export const getAdminForeignerWorkSpecial = (sect_id, params) =>
	admin.get(foreigner(`work/special/${sect_id}`), { params });
// export const postAdminForeignerWork = (data) => admin.post(foreigner("work"), data);
export const postAdminForeignerWork = (sect_id, data) =>
	admin.post(foreigner(`work/${sect_id}`), data);

export const getAdminForeignerNoWork = (sect_id) => admin.get(foreigner(`no_work/${sect_id}`));

export const getAdminForeignerAccountFavorite = (std_id, favorite_bool) =>
	admin.get(foreigner(`account/${std_id}`), { params: { favorite_bool } });

export const getAdminForeigner = (params) => admin.get(foreigner(""), { params });

export const getAdminReservation = (sch_id) => admin.get(`/reservation/${sch_id}`);
export const patchAdminReservationPermission = (sch_id, data) =>
	admin.patch(`/reservation/permission/${sch_id}`, data);
