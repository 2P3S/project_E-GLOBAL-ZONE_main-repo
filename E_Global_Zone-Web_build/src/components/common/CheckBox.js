import React from "react";
import ScheduleConf from "../../conf/scheduleConf";

/**
 * CheckBox - 스케줄 및 예약관리 체크박스
 * @param handleAll
 * @param handleCheck
 * @param data
 * @returns {JSX.Element}
 */
export default ({handleAll, handleCheck, data}) => {
    const checkBox = (id) => {
        const ids = ["allCheck","no_app_reservation","not_result","no_app_result","ok_result"];
        ids.forEach(value=>{
            document.getElementById(value).checked = false;
        })
        document.getElementById(id).checked = true;
    }
    return <div className="check_box_area">
        <div className="check_box" onClick={() => {
            handleAll()
            checkBox("allCheck")
        }}>
            <div className="check_box_input all">
                <input type="checkbox" id="allCheck" name=""/>
                <label htmlFor="allCheck"></label>
            </div>
        </div>
        <div className="check_box"

        >
            <div className="check_box_input">
                <input type="checkbox" id="no_app_reservation" name=""
                       onClick={() => {
                           handleCheck(data, ScheduleConf.STATUS.RESERVATION_IN_PROGRESS);
                           checkBox("no_app_reservation")
                       }}
                />
                <label htmlFor="no_app_reservation">
					<span>
						예약 미승인 <span className="blue">10</span>건
					</span>
                </label>
            </div>
        </div>
        <div className="check_box">
            <div className="check_box_input">
                <input type="checkbox" id="not_result" name=""
                       onClick={() => {
                           handleCheck(data, ScheduleConf.STATUS.RESERVATION_DONE);
                           checkBox("not_result")
                       }}
                />
                <label htmlFor="not_result">
					<span>
						결과 미입력 <span className="mint">2</span>건
					</span>
                </label>
            </div>
        </div>
        <div className="check_box">
            <div className="check_box_input">
                <input type="checkbox" id="no_app_result" name=""
                       onClick={()=>{
                           handleCheck(data, ScheduleConf.STATUS.RESULT_IN_PROGRESS);
                           checkBox("no_app_result")
                       }}
                />
                <label htmlFor="no_app_result">
					<span>
						결과 미승인 <span className="yellow">3</span>건
					</span>
                </label>
            </div>
        </div>
        <div className="check_box">
            <div className="check_box_input">
                <input type="checkbox" id="ok_result" name=""
                       onClick={()=>{
                           handleCheck(data, ScheduleConf.STATUS.RESULT_DONE);
                           checkBox("ok_result")
                       }}
                />
                <label htmlFor="ok_result">
					<span>
						결과 입력완료 <span className="puple">2</span>건
					</span>
                </label>
            </div>
        </div>
    </div>
}