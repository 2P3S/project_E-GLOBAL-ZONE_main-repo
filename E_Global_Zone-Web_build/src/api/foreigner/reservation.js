import { foreigner } from "../axios";

export const getForeignerReservation = (sch_id) => foreigner.get(`/reservation/${sch_id}`);

export const patchForeignerReservationPermission = (sch_id, data) =>
	foreigner.patch(`/reservation/permission/${sch_id}`, data);

export const postForeignerReservationResult = (sch_id, data, setState) => {
	let ajax = new XMLHttpRequest();

	ajax.onreadystatechange = () => {
		if (ajax.readyState === 0) {
			ajax.setRequestHeader("content-type", "multipart/form-data");
		}
		if (ajax.readyState === 4) {
			// console.log(ajax.response);
			if (ajax.status === 201) {
				setState(true);
			}
		}
	};

	ajax.open(
		"post",
		process.env.REACT_APP_BASE_URL + `foreigner/reservation/result/${sch_id}?guard=foreigner`,
		true
	);

	ajax.setRequestHeader("Authorization", `Bearer ${window.localStorage.getItem("token")}`);
	ajax.send(data);
};
