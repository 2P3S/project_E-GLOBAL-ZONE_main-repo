import ScheduleConf from "../scheduleConf";

/**
 * DailySchedule for one foreigner student
 */
class DailySchedule extends ScheduleConf {
    id;
    name;
    language;
    schedule = [];

    /**
     * @method setSchedule is make a schedule for WeeklyScheduleTable
     *
     * @param {int} scheduleId scheduleId
     * @param {int} argStatus 0~4
     *
     * @return {object} {id, status}
     * */
    static setSchedule(scheduleId, argStatus) {
        let status;
        let value = undefined;
        switch (argStatus) {
            case this.STATUS.RESERVATION_NOTHING:
                status = this.STATUS.RESERVATION_NOTHING;
                break;
            case this.STATUS.RESERVATION_IN_PROGRESS:
                status = this.STATUS.RESERVATION_IN_PROGRESS;
                break;
            case this.STATUS.RESERVATION_DONE:
                status = this.STATUS.RESERVATION_DONE;
                break;
            case this.STATUS.RESULT_IN_PROGRESS:
                status = this.STATUS.RESULT_IN_PROGRESS;
                break;
            case this.STATUS.RESULT_DONE:
                status = this.STATUS.RESULT_DONE;
                break;
            default:
                status = null;
        }
        if (arguments[3] === undefined) {
            value = [Math.ceil(Math.random() * 10)]
        }
        return status !== null ?
            value !== undefined ? {scheduleId, status, value} : {scheduleId, status} :
            null;
    }

    /**
     * @constructor
     *
     * @param {int} id Foreigner student id
     * @param {string} name Foreigner student name
     * @param {string} language
     * @param {[string]} scheduleIds
     */
    constructor(id, name, language, scheduleIds) {
        super();
        let array = [];
        for (const element of scheduleIds) {
            array.push(DailySchedule.setSchedule(element, Math.floor(Math.random()*5), [2,3]));
        }
        this.name = name;
        this.language = language;
        this.schedule = array;
    }
}

export default DailySchedule;