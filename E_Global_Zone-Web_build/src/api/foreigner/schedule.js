import { foreigner } from "../axios";

const schedule = "/schedule";

/**
 *
 * @param {object} params {start_date, end_date}
 */
const getForeignerSchedule = (params) => foreigner.get(schedule, { params: { ...params } });

export default { getForeignerSchedule };
