const { admin } = require("../axios");

export const getAdminDeptList = () => admin.get("department");
