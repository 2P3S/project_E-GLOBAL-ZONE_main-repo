const { admin } = require("../axios");

export const getAdminSection = (year) => admin.get("section", { params: { year } });

export const patchAdminSection = (sect_id, data) => admin.patch(`section/${sect_id}`, data);

export const postAdminSection = (data) => admin.post("section", data);
