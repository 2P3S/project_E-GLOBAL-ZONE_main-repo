import { admin } from "../axios";

export const getAdminExportForeigner = () =>
	admin.get(`export/foreigner`, { responseType: "arraybuffer" }).then((response) => {
		var blob = new Blob([response.data], {
			type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
		});
		console.log(response.data);
		var blobURL = window.URL.createObjectURL(blob);
		var tempLink = document.createElement("a");
		tempLink.style.display = "none";
		tempLink.href = blobURL;
		tempLink.setAttribute("download", `전체유학생정보.xlsx`);
		document.body.appendChild(tempLink);
		tempLink.click();
		document.body.removeChild(tempLink);
		window.URL.revokeObjectURL(blobURL);
	});
export const getAdminExportForeignerSect = (sect_id, sect_name) =>
	admin
		.get(`export/foreigner/sect/${sect_id}`, { responseType: "arraybuffer" })
		.then((response) => {
			var blob = new Blob([response.data], {
				type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
			});
			console.log(response.data);
			var blobURL = window.URL.createObjectURL(blob);
			var tempLink = document.createElement("a");
			tempLink.style.display = "none";
			tempLink.href = blobURL;
			tempLink.setAttribute("download", `${sect_name}학기유학생정보.xlsx`);
			document.body.appendChild(tempLink);
			tempLink.click();
			document.body.removeChild(tempLink);
			window.URL.revokeObjectURL(blobURL);
		});
export const getAdminExportKorean = () =>
	admin.get(`export/korean`, { responseType: "arraybuffer" }).then((response) => {
		var blob = new Blob([response.data], {
			type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
		});
		console.log(response.data);
		var blobURL = window.URL.createObjectURL(blob);
		var tempLink = document.createElement("a");
		tempLink.style.display = "none";
		tempLink.href = blobURL;
		tempLink.setAttribute("download", `전체한국인학생정보.xlsx`);
		document.body.appendChild(tempLink);
		tempLink.click();
		document.body.removeChild(tempLink);
		window.URL.revokeObjectURL(blobURL);
	});
