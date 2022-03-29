import { admin } from "../axios";

const decoder = (string) => {
	if (browserCheck() === "Safari") {
		return string;
	}
	return decodeURIComponent(escape(string));
};

function browserCheck() {
	const agt = navigator.userAgent.toLowerCase();
	if (agt.indexOf("chrome") != -1) return "Chrome";
	if (agt.indexOf("opera") != -1) return "Opera";
	if (agt.indexOf("staroffice") != -1) return "Star Office";
	if (agt.indexOf("webtv") != -1) return "WebTV";
	if (agt.indexOf("beonex") != -1) return "Beonex";
	if (agt.indexOf("chimera") != -1) return "Chimera";
	if (agt.indexOf("netpositive") != -1) return "NetPositive";
	if (agt.indexOf("phoenix") != -1) return "Phoenix";
	if (agt.indexOf("firefox") != -1) return "Firefox";
	if (agt.indexOf("safari") != -1) return "Safari";
	if (agt.indexOf("skipstone") != -1) return "SkipStone";
	if (agt.indexOf("netscape") != -1) return "Netscape";
	if (agt.indexOf("mozilla/5.0") != -1) return "Mozilla";
	if (agt.indexOf("msie") != -1) {
		let rv = -1;
		if (navigator.appName == "Microsoft Internet Explorer") {
			let ua = navigator.userAgent;
			var re = new RegExp("MSIE ([0-9]{1,}[.0-9]{0,})");
			if (re.exec(ua) != null) rv = parseFloat(RegExp.$1);
		}
		return "Internet Explorer " + rv;
	}
}

export const getAdminExportForeigner = () =>
	admin.get(`export/foreigner`, { responseType: "arraybuffer" }).then((response) => {
		let filename = "";
		var blob = new Blob([response.data], {
			type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;",
		});
		response.headers["content-disposition"].split(";").forEach((v) => {
			if (v.includes("filename")) {
				filename = v.split("=")[1].replace('"', "").replace('"', "");
			}
		});
		var blobURL = window.URL.createObjectURL(blob);
		var tempLink = document.createElement("a");
		tempLink.style.display = "none";
		tempLink.href = blobURL;
		tempLink.setAttribute("download", decoder(filename));
		document.body.appendChild(tempLink);
		tempLink.click();
		document.body.removeChild(tempLink);
		window.URL.revokeObjectURL(blobURL);
	});
export const getAdminExportForeignerSect = (sect_id, sect_name) =>
	admin
		.get(`export/foreigner/sect/${sect_id}`, { responseType: "arraybuffer" })
		.then((response) => {
			let filename = "";
			var blob = new Blob([response.data], {
				type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;",
			});
			response.headers["content-disposition"].split(";").forEach((v) => {
				if (v.includes("filename")) {
					filename = v.split("=")[1].replace('"', "").replace('"', "");
				}
			});
			var blobURL = window.URL.createObjectURL(blob);
			var tempLink = document.createElement("a");
			tempLink.style.display = "none";
			tempLink.href = blobURL;
			tempLink.setAttribute("download", decoder(filename));
			document.body.appendChild(tempLink);
			tempLink.click();
			document.body.removeChild(tempLink);
			window.URL.revokeObjectURL(blobURL);
		});
export const getAdminExportKorean = () =>
	admin.get(`export/korean`, { responseType: "arraybuffer" }).then((response) => {
		let filename = "";
		var blob = new Blob([response.data], {
			type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;",
		});
		response.headers["content-disposition"].split(";").forEach((v) => {
			if (v.includes("filename")) {
				filename = v.split("=")[1].replace('"', "").replace('"', "");
			}
		});
		var blobURL = window.URL.createObjectURL(blob);
		var tempLink = document.createElement("a");
		tempLink.style.display = "none";
		tempLink.href = blobURL;
		tempLink.setAttribute("download", decoder(filename));
		document.body.appendChild(tempLink);
		tempLink.click();
		document.body.removeChild(tempLink);
		window.URL.revokeObjectURL(blobURL);
	});

export const getAdminExportSchedule = (params) =>
	admin
		.get(`export/schedule`, { responseType: "arraybuffer", params: { ...params } })
		.then((response) => {
			let filename = "";
			var blob = new Blob([response.data], {
				type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;",
			});
			response.headers["content-disposition"].split(";").forEach((v) => {
				if (v.includes("filename")) {
					filename = v.split("=")[1].replace('"', "").replace('"', "");
				}
			});
			var blobURL = window.URL.createObjectURL(blob);
			var tempLink = document.createElement("a");
			tempLink.style.display = "none";
			tempLink.href = blobURL;
			tempLink.setAttribute("download", decoder(filename));
			document.body.appendChild(tempLink);
			tempLink.click();
			document.body.removeChild(tempLink);
			window.URL.revokeObjectURL(blobURL);
		});
export const getAdminExportReservation = (params) =>
	admin
		.get(`export/reservation`, { responseType: "arraybuffer", params: { ...params } })
		.then((response) => {
			let filename = "";
			var blob = new Blob([response.data], {
				type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;",
			});
			response.headers["content-disposition"].split(";").forEach((v) => {
				if (v.includes("filename")) {
					filename = v.split("=")[1].replace('"', "").replace('"', "");
				}
			});
			var blobURL = window.URL.createObjectURL(blob);
			var tempLink = document.createElement("a");
			tempLink.style.display = "none";
			tempLink.href = blobURL;
			tempLink.setAttribute("download", decoder(filename));
			document.body.appendChild(tempLink);
			tempLink.click();
			document.body.removeChild(tempLink);
			window.URL.revokeObjectURL(blobURL);
		});
