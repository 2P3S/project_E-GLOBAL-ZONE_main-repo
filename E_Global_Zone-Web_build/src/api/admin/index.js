const { adminLogin } = require("../axios");

export const postAdminLogin = (data) => adminLogin.post("", data);
