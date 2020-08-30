import { korean } from "../axios";

const reservation = "/reservation";

export const getKoreanReservation = (search_date) =>
	korean.get(reservation, { params: { search_date } });
export const postKoreanReservation = (sch_id) => korean.post(`${reservation}/${sch_id}`);
export const deleteKoreanReservation = (res_id) => korean.delete(`${reservation}/${res_id}`);
export const getKoreanReservationResult = (sect_id, search_month) =>
	korean.get(reservation + "/result", { params: { sect_id, search_month } });
