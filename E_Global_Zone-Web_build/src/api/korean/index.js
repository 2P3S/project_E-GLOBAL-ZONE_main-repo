import { korean, koreanLogin } from "../axios";

/**
 * get a list of sections has attended
 * return axios get promise instance
 */
export const getKoreanSection = () => korean.get("section");

/**
 * create an account for korean students
 * @param {object} data {std_kor_id, std_kor_dept, std_kor_name, std_kor_phone, std_kor_mail}
 */
export const postKoreanAccount = (data) => korean.post("account", data);

/**
 * get a schedule list that is can applicate today
 */
export const getKoreanSchedule = (sch_id) => korean.get("schedule" + (sch_id ? `/${sch_id}` : ""));

export const postKoreanLogin = () => koreanLogin.post();
