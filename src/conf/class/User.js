import conf from "../userConf";

export default class User {
	id;
	userClass;
	name;
	constructor(id, className) {
		this.setId(id);
		this.setUserClass(className);
	}
	getId = () => this.id;
	setId = (id) => {
		this.id = id;
	};

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
