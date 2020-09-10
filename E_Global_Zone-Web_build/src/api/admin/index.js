const { adminLogin, adminLogout, instance } = require("../axios");

export const postAdminLogin = (data) => adminLogin.post("", data);
export const postAdminLogout = () => adminLogout.post("");
export const postReset = () => instance.post("/reset");
