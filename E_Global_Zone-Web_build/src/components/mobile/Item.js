import React from "react";
import conf from "../../conf/conf";
import {useHistory} from 'react-router-dom'
import useClick from "../../modules/hooks/useClick";

// English -> .box puple
// Japanese -> .box blue
// China -> .box pink

/**
 * status
 * 출석인증 완료 : confirm
 * 출석인증 대기 : done
 * 예약 대기 : pending
 * 예약 완료 : reserved
 * 미참석 : nonattendance
 */
const CONFIRM = "출석인증 완료";
const DONE = "출석인증 대기";
const PENDING = "예약 대기";
const RESERVED = "예약 완료";
const NON_ATTENDANCE = "미참석";

/**
 * Item for Mobile Schedule
 * @param id
 * @param language
 * @param name
 * @param time
 * @param status
 * @param zoomPw
 * @param zoomId
 * @returns {JSX.Element}
 * @constructor
 */
export default function Item({id ,language, name, time, status, zoomPw, zoomId}) {

    const history = useHistory();

    const application = useClick(()=>{
        history.push(`schedule/${id}`)
    });

    const setStatus = (status) => {
        if (typeof status === "boolean") {
            return status;
        } else {
            switch (status) {
                case "confirm":
                    return CONFIRM;
                case "done":
                    return DONE;
                case "pending":
                    return PENDING;
                case "reserved":
                    return RESERVED;
                case "absent":
                    return NON_ATTENDANCE;
                default:
                    break;
            }
        }
    };
    const scheduleInfo = {
        class:
            typeof status === "boolean" ? status ? "box blue" : "box pink" :
                status === "done" || status === "confirm"
                    ? "box puple"
                    : status === "pending" || status === "reserved"
                    ? "box blue"
                    : "box pink",
        language:
            language === conf.language.ENGLISH ? "[영어]" : language === conf.language.JAPANESE ? "[일본어]" : "[중국어]",
        name,
        time,
        status: setStatus(status),
    };
    return (
        <>
            <div className={scheduleInfo.class}>
                <ul>
                    <li>{`${scheduleInfo.language} ${scheduleInfo.name}`}</li>
                    <li className="eng">{scheduleInfo.time.map((e) => e)} </li>
                </ul>
                {
                    status === "reserved"? <ul>
                        <li>
                            {/*줌 아이디 : {zoomId}*/}
                        </li>
                    </ul>:
                        <></>
                }
                {((status) => {
                    if (!typeof status === "boolean")
                        if (status !== "done" && status !== "confirm") {
                            return (
                                <div>
                                    <img src="/global/mobile/img/cancel_btn.png" alt="삭제 버튼"/>
                                </div>
                            );
                        }
                })(status)}
                {((status) => {
                    if (typeof status !== "boolean") {
                        return <span>{status==="reserved"? `${scheduleInfo.status}` :`${scheduleInfo.status}`}</span>
                    } else {
                        return status ? <span ref={application}>예약</span> : <span>예약 불가능</span>;
                    }
                })(status)}
            </div>
            {/* <div className="box puple">
				<ul>
					<li>[영어] 쉬라이 알리오트시나</li>
					<li className="eng">AM 09:00 ~ PM 01:00 </li>
				</ul>
				<span>출석인증 대기</span>
			</div>
			<div className="box blue">
				<ul>
					<li>[영어] 쉬라이 알리오트시나</li>
					<li className="eng">AM 09:00 ~ PM 01:00 </li>
				</ul>
				<a href="#">
					<img src="/img/cancel_btn.png" alt="삭제 버튼" />
				</a>
				<span>예약 대기</span>
			</div>
			<div className="box pink">
				<ul>
					<li>[영어] 쉬라이 알리오트시나</li>
					<li className="eng">AM 09:00 ~ PM 01:00 </li>
				</ul>
				<a href="#">
					<img src="/img/cancel_btn.png" alt="삭제 버튼" />
				</a>
				<span>예약 완료</span>
			</div>
			<div className="box pink">
				<ul>
					<li>[영어] 쉬라이 알리오트시나</li>
					<li className="eng">AM 09:00 ~ PM 01:00 </li>
				</ul>
				<a href="#">
					<img src="/img/cancel_btn.png" alt="삭제 버튼" />
				</a>
				<span>미참석</span>
			</div> */}
        </>
    );
}
