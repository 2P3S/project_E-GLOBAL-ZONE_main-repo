import korean from "../axios";

import reservation from "./reservation";

/**
 * get a list of sections has attended
 * return axios get promise instance
 */
const getKoreanSection = () => korean.get("section");

/**
 * create an account for korean students
 * @param {object} data {std_kor_id, std_kor_dept, std_kor_name, std_kor_phone, std_kor_mail}
 */
const postKoreanAccount = (data) => korean.post("account", data);

/**
 * get a schedule list that is can applicate today
 */
const getKoreanSchedule = () => korean.get("schedule");

export default { ...reservation, getKoreanSection, postKoreanAccount, getKoreanSchedule };
