import { admin } from "../axios";

export const getAdminSchedule = (params) => admin.get("schedule", { params });
export const postAdminSchedule = (data) => admin.post("schedule", data);

export const postAdminScheduleAdd = (sch_id, data) => admin.post(`schedule/add/${sch_id}`, data);

export const deleteAdminScheduleAdd = (sch_id) => admin.delete(`schedule/add/${sch_id}`);
export const deleteAdminScheduleSome = (sch_id) => admin.delete(`schedule/some/${sch_id}`);

export const deleteAdminSchedule = (params) => admin.delete(`/schedule`, { params });

export const getAdminScheduleUnapproved = (date) => admin.get(`schedule/unapproved/${date}`);
export const patchAdminScheduleApproval = (sch_id, data) =>
	admin.patch(`schedule/approval/${sch_id}`, data);
