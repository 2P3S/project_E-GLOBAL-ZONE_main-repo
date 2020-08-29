import korean from "../axios";

import reservation from "./reservation";

const getKoreanSection = () => korean.get("section");

const postKoreanAccount = (data) => korean.post("account", data);

const getKoreanSchedule = () => korean.get("schedule");

export default { ...reservation, getKoreanSection, postKoreanAccount, getKoreanSchedule };
