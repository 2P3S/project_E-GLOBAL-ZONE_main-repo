import React, {useEffect, useState} from "react";
import Modal from "components/common/modal/Modal";
import InsertSchedule from "components/common/modal/InsertSchedule";
import ScheduleTable from "components/common/ScheduleTable";
import CheckBox from 'components/common/CheckBox';
import DailySchedule from "../../../../conf/class/DailySchedule";
import conf from "conf/conf";

export default function Schedules() {
    const mockup = [
        [new DailySchedule(1, "name1", conf.language.ENGLISH, new Array(9)),
        new DailySchedule(1, "name1", conf.language.ENGLISH, new Array(9)),
        new DailySchedule(1, "name1", conf.language.ENGLISH, new Array(9)),],
     [   new DailySchedule(1, "name1", conf.language.CHINESE, new Array(9)),
        new DailySchedule(1, "name1", conf.language.CHINESE, new Array(9)),
        new DailySchedule(1, "name1", conf.language.CHINESE, new Array(9)),],
       [ new DailySchedule(1, "name1", conf.language.JAPANESE, new Array(9)),
        new DailySchedule(1, "name1", conf.language.JAPANESE, new Array(9)),]
    ];
    const [insertIsOpen, setInsertIsOpen] = useState(false);
    const [scheduleList, setScheduleList] = useState();
    useEffect(() => {
        setScheduleList(mockup);
    }, [])

    const openSch = () => {
        setInsertIsOpen(true);
    };
    const closeSch = () => {
        setInsertIsOpen(false);
    };

    return (
        <div className="content">
            <div className="sub_title">
                <p className="tit">{new Date().toDateString().toUpperCase()}</p>
                <div className="select_date">
                    <img src="/global/img/select_date_ico.gif" alt="날짜 선택"/>
                </div>
                <CheckBox setScheduleList={setScheduleList}/>
            </div>
            <div className="wrap">
                {scheduleList ? <ScheduleTable
                    scheduleList={scheduleList}
                /> : <></>}

                <div className="table_btn">
                    <a href="#" onClick={openSch}>
                        개별 입력
                    </a>
                    <Modal isOpen={insertIsOpen} onRequestClose={closeSch}>
                        <InsertSchedule closeSch={closeSch}/>
                    </Modal>
                    <a href="#">CSV 입력</a>
                </div>
            </div>
        </div>
    );
}
