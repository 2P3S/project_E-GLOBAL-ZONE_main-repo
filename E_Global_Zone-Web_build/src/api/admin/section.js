const { admin } = require("../axios");

export const getAdminSection = (params) => admin.get("section", { params });

export const patchAdminSection = (sect_id, data) => admin.patch(`section/${sect_id}`, data);

export const postAdminSection = (data) => admin.post("section", data);
