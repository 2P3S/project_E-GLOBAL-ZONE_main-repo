const { admin } = require("../axios");

export const postAdminNotice = (data) => admin.post("notice", data);
