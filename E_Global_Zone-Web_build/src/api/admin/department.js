const { admin } = require("../axios");

export const getAdminDeptList = () => admin.get("department");
export const postAdminDeptList = (data) => admin.post("department", data);
export const patchAdminDeptList = (dept_id, data) => admin.patch(`department/${dept_id}`, data);
export const deleteAdminDeptList = (dept_id) => admin.delete(`department/${dept_id}`);
