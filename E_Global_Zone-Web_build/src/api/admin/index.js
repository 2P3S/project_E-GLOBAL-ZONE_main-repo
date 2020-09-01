const { adminLogin, adminLogout } = require("../axios");

export const postAdminLogin = (data) => adminLogin.post("", data);
export const postAdminLogout = () => adminLogout.post("");
