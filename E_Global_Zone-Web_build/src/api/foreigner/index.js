import { foreigner, foreignerLogin, foreignerLogout } from "../axios";

export const patchPassword = (std_for_passwd) => foreigner.patch("/password", { std_for_passwd });

export const postForeignerLogout = () => foreignerLogout.post("");

export const postForeignerLogin = (data) => foreignerLogin.post("", data);
