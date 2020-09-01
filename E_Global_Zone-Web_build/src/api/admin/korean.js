import { admin } from "../axios";

export const postAdminKorean = (data) => admin.post("korean", data);

export const getAdminKorean = (params) => admin.get("korean", { params });

export const postAdminKoreanRestrict = (data) => admin.post("korean/restrict", data);
export const patchAdminKoreanRestrict = (id) => admin.patch(`korean/restrict/${id}`);

export const getAdminKoreanAccount = () => admin.get("korean/account");
export const patchAdminKoreanAccount = (data) => admin.patch("korean/account", data);
export const deleteAdminKoreanAccount = (std_kor_id) =>
	admin.delete(`korean/account/${std_kor_id}`);
