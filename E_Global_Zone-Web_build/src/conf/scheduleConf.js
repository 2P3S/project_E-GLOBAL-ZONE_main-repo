const RESERVATION_NOTHING = 0,
    RESERVATION_IN_PROGRESS = 1,
    RESERVATION_DONE = 2,
    RESULT_IN_PROGRESS = 3,
    RESULT_DONE = 4;

class ScheduleConf {
   static STATUS = {
        RESERVATION_NOTHING,
        RESERVATION_IN_PROGRESS,
        RESERVATION_DONE,
        RESULT_IN_PROGRESS,
        RESULT_DONE
    }

}

export default ScheduleConf;