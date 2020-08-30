import { foreigner } from "../axios";

const schedule = "/schedule";

/**
 *
 * @param {object} params {start_date, end_date}
 */
export const getForeignerSchedule = (start_date, end_date) =>
	foreigner.get(`${schedule}`, {
		params: {
			start_date: start_date,
			end_date: end_date,
		},
	});
