const { admin } = require("../axios");

export const getAdminSection = (params) => admin.get("section", { params });

export const patchAdminSection = (sect_id, data) => admin.patch(`section/${sect_id}`, data);

export const deleteAdminSection = (sect_id) => admin.delete(`section/${sect_id}`);

export const postAdminSection = (data) => admin.post("section", data);

export const getAdminSectionLastday = (sect_id) => admin.get(`section/lastday/${sect_id}`);
