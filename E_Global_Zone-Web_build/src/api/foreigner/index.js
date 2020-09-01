import { foreigner, foreignerLogin, foreignerLogout } from "../axios";

export const patchPassword = (data) => foreigner.patch("/password", data);

export const postForeignerLogout = () => foreignerLogout.post("");

export const postForeignerLogin = (data) => foreignerLogin.post("", data);
