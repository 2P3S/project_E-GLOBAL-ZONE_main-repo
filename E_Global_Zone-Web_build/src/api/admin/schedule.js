import { admin } from "../axios";

export const getAdminSchedule = (params) => admin.get("schedule", { params });
export const postAdminSchedule = (data) => admin.post("schedule", data);

// 온라인/오프라인 스케줄 조회 API 추가
export const getAdminScheduleOnline = (params) => {
  console.log("getAdminScheduleOnline params:", { ...params, is_offline: 0 });
  return admin.get("schedule", { params: { ...params, is_offline: 0 } });
};
export const getAdminScheduleOffline = (params) => {
  console.log("getAdminScheduleOffline params:", { ...params, is_offline: 1 });
  return admin.get("schedule", { params: { ...params, is_offline: 1 } });
};

export const getAdminScheduleImage = (sch_id) =>
  admin.get(`schedule/image/${sch_id}`);
export const postAdminScheduleAdd = (sch_id, data) =>
  admin.post(`schedule/add/${sch_id}`, data);
export const postAdminScheduleSome = (data) =>
  admin.post(`schedule/some`, data);

export const deleteAdminScheduleAdd = (sch_id) =>
  admin.delete(`schedule/add/${sch_id}`);
export const deleteAdminScheduleSome = (sch_id) =>
  admin.delete(`schedule/some/${sch_id}`);
export const deleteAdminScheduleDate = (params) =>
  admin.delete(`schedule/date`, { params });

export const deleteAdminSchedule = (params) =>
  admin.delete(`/schedule`, { params });

export const getAdminScheduleUnapproved = (date, sch_state_of_permission) =>
  admin.get(`schedule/unapproved/${date}`, {
    params: { sch_state_of_permission },
  });
export const patchAdminScheduleApproval = (sch_id, data) =>
  admin.patch(`schedule/approval/${sch_id}`, data);

export const getAdminHoliday = (params) => admin.get("holiday", { params });
export const patchAdminScheduleUpdate = (sch_id, params) =>
  admin.patch(`schedule/update/${sch_id}`, params).then((res) => {
    alert(res.data.message);
  });

export const patchAdminScheduleLocation = (sch_id, location) =>
  admin
    .patch(`schedule/location/${sch_id}`, { sch_location: location })
    .then((res) => {
      alert(res.data.message);
      return res;
    });
