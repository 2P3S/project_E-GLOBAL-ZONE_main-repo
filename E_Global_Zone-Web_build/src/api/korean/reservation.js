import korean from "../axios";

const reservation = "/reservation";

const getKoreanReservation = (search_date) => korean.get(reservation, { params: { search_date } });
const postKoreanReservation = (sch_id) => korean.post(`${reservation}/${sch_id}`);
const deleteKoreanReservation = (res_id) => korean.delete(`${reservation}/${res_id}`);

const getKoreanReservationResult = (sect_id, search_month) =>
	korean.get(reservation + "/result", { params: { sect_id, search_month } });

export default {
	getKoreanReservation,
	postKoreanReservation,
	deleteKoreanReservation,
	getKoreanReservationResult,
};
