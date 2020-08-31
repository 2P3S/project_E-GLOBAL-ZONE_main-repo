import conf from "../conf";

export default class User {
	id;
	userClass;
	name;
	constructor(id, className) {
		this.id = id;
		this.setUserClass(className);
	}

	getUserClass = () => this.userClass;
	setUserClass = (className) => {
		for (const key in conf.userClass) {
			if (conf.userClass.hasOwnProperty(key)) {
				const element = conf.userClass[key];
				if (element === className) {
					this.userClass = element;
				}
			}
		}
	};
}

class Korean extends User {
	department;
	gmail;
	attendance;
	absent;

	premission;
	restriction;

	constructor(id, className) {
		super(id, className);
		Korean.setKorean({});
	}

	setKorean(argObj) {
		this.department = argObj.kor_dept;
		this.gmail = argObj.kor_mail;
		this.attendance = argObj.kor_num_of_attendance;
		this.absent = argObj.kor_num_of_absent;
		this.premission = argObj.kor_state_of_permission;
		this.restriction = argObj.kor_state_of_restriction;
	}
}
