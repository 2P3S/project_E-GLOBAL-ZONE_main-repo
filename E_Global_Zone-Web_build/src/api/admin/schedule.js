import { admin } from "../axios";

export const getAdminSchedule = (params) => admin.get("schedule", { params });
export const postAdminSchedule = (data) => admin.post("schedule", data);

export const getAdminScheduleImage = (sch_id) => admin.get(`schedule/image/${sch_id}`);
export const postAdminScheduleAdd = (sch_id, data) => admin.post(`schedule/add/${sch_id}`, data);
export const postAdminScheduleSome = (data) => admin.post(`schedule/some`, data);

export const deleteAdminScheduleAdd = (sch_id) => admin.delete(`schedule/add/${sch_id}`);
export const deleteAdminScheduleSome = (sch_id) => admin.delete(`schedule/some/${sch_id}`);
export const deleteAdminScheduleDate = (params) => admin.delete(`schedule/date`, { params });

export const deleteAdminSchedule = (params) => admin.delete(`/schedule`, { params });

export const getAdminScheduleUnapproved = (date, sch_state_of_permission) =>
	admin.get(`schedule/unapproved/${date}`, { params: { sch_state_of_permission } });
export const patchAdminScheduleApproval = (sch_id, data) =>
	admin.patch(`schedule/approval/${sch_id}`, data);

export const getAdminHoliday = (params) => admin.get("holiday", { params });
export const patchAdminScheduleUpdate = (sch_id, params) =>
	admin.patch(`schedule/update/${sch_id}`, params).then((res) => {
		alert(res.data.message);
	});
