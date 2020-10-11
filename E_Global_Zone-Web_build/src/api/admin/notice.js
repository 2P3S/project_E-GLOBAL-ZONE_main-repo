const { admin } = require("../axios");

export const postAdminNotice = (data) => admin.post("notice", data);
export const deleteAdminNotice = (noti_id) => admin.delete(`notice/${noti_id}`);
// export const getAdminNotice = (params) => admin.get("notice", { params });
