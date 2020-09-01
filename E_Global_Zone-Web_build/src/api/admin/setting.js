import { admin } from "../axios";

export const getAdminSetting = (params) => admin.get("setting", { params });

export const postAdminSetting = (data) => admin.post("setting", data);
