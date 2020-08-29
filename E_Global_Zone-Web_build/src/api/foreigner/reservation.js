import { foreigner } from "../axios";

const getForeignerReservation = (sch_id) => foreigner.get(`/reservation/${sch_id}`);

const patchForeignerReservationPermission = (sch_id, data) =>
	foreigner.patch(`/reservation/permission/${sch_id}`, data);

const postForeignerReservationResult = (sch_id, data) => {
	let ajax = new XMLHttpRequest();
	ajax.onreadystatechange = () => {
		if (ajax.readyState === 0) {
			ajax.setRequestHeader("content-type", "multipart/form-data");
		}
		if (ajax.readyState === 4) {
			// console.log(ajax.response);
		}
	};

	ajax.open("post", conf.url + `/api/foreigner/reservation/result/${sch_id}`, true);
	ajax.send(data);
};

export default {
	getForeignerReservation,
	patchForeignerReservationPermission,
	postForeignerReservationResult,
};
