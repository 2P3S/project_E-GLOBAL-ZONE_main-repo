import React, {useState, useEffect} from "react";
import Calendar from "../../../../components/mobile/Calendar";
import moment from "moment";
import {useSelector} from "react-redux";
import {selectSelectDate, selectToday} from "../../../../redux/confSlice/confSlice";

/**
 * Foreigner :: 스케줄 관리
 * @returns {JSX.Element}
 * @constructor
 * @todo 구현바람
 */
export default function Schedules() {

    const makeWeek = (weekStartDate) => {
        let weeks = [];
        for (let i = 0; i < 7; i++) {
            weeks.push(moment(weekStartDate).add(i, 'd'));
        }
        return weeks;
    }

    const today = useSelector(selectToday);
    const selectedDate = useSelector(selectSelectDate);
    useEffect(() => {
        window.easydropdown.all();

    }, []);
    const [currentDate, setCurrentDate] = useState(moment(today));
    const [weekStartDate, setWeekStartDate] = useState();
    const [week, setWeek] = useState(makeWeek(weekStartDate));
    const getWeekStart = (currentDay) => {
        let startDate = currentDay;
        let i = 0;
        while (startDate.format('dddd') !== "Sunday") {
            startDate = startDate.subtract(1, 'd');
            i++;
            setWeekStartDate(startDate);
        }
        setWeekStartDate(moment(selectedDate).subtract(i, 'd').format("YYYY-MM-DD"));
    }
    useEffect(() => {
        getWeekStart(moment(today));
    }, [])
    useEffect(() => {
        getWeekStart(moment(selectedDate));
    }, [selectedDate]);
    useEffect(() => {
            console.log(weekStartDate);
            setWeek(makeWeek(weekStartDate));
        }
        ,
        [weekStartDate]
    );
    useEffect(() => {
        console.log(
            `currentDate: ${currentDate}`
        );
        console.log(
            `weekStartDate: ${weekStartDate}`
        );
        console.log(
            `week: ${week}`
        );
    })

    return (
        <div className="wrapper">
            <div className="content">
                <div className="sub_title">
                    <p className="tit">스케줄 및 예약관리</p>
                </div>
                <div className="status_wrap">
                    <div className="mt50 mr20">
                        <Calendar/>
                    </div>
                    <div className="status_box">
                        <div className="gray">
                            이번주 스케줄
                            <p>
                                <span>11</span>건
                            </p>
                        </div>
                        <div className="blue">
                            예약 승인 대기
                            <p>
                                <span>4</span>건
                            </p>
                        </div>
                        <div className="mint">
                            예약 승인 완료
                            <p>
                                <span>2</span>건
                            </p>
                        </div>
                        <div className="yellow">
                            출석 결과 미입력
                            <p>
                                <span>2</span>건
                            </p>
                        </div>
                        <div className="puple">
                            출석 결과 입력완료
                            <p>
                                <span>2</span>건
                            </p>
                        </div>
                    </div>
                </div>

                <div className="week_wrap">
                    <ul className="day_week">
                        {
                            week ?
                                <>
                                <li>
                                    일<span className={moment(selectedDate).diff(week[0],'days')===0?`today`:``}>{week[0].format("DD")}</span>
                                </li>
                                <li>
                                    월<span className={moment(selectedDate).diff(week[1],'days')===0?`today`:``}>{week[1].format("DD")}</span>
                                </li>
                                <li>
                                    화<span className={moment(selectedDate).diff(week[2],'days')===0?`today`:``}>{week[2].format("DD")}</span>
                                </li>
                                <li>
                                    수<span className={moment(selectedDate).diff(week[3],'days')===0?`today`:``}>{week[3].format("DD")}</span>
                                </li>
                                <li>
                                    목<span className={moment(selectedDate).diff(week[4],'days')===0?`today`:``}>{week[4].format("DD")}</span>
                                </li>
                                <li>
                                    금<span className={moment(selectedDate).diff(week[5],'days')===0?`today`:``}>{week[5].format("DD")}</span>
                                </li>
                                <li>
                                    토<span className={moment(selectedDate).diff(week[6],'days')===0?`today`:``}>{week[6].format("DD")}</span>
                                </li>
                            </> : <>
                                <li>
                                    일<span>12</span>
                                </li>
                                <li>
                                    월<span className="today">13</span>
                                </li>
                                <li>
                                    화<span>14</span>
                                </li>
                                <li>
                                    수<span>15</span>
                                </li>
                                <li>
                                    목<span>16</span>
                                </li>
                                <li>
                                    금<span>17</span>
                                </li>
                                <li>
                                    토<span>18</span>
                                </li>
                            </>
                        }

                    </ul>
                    <div className="week_table">
                        <ul>
                            <li>9AM</li>
                            <li>10AM</li>
                            <li>11AM</li>
                            <li>12PM</li>
                            <li>1PM</li>
                            <li>2PM</li>
                            <li>3PM</li>
                            <li>4PM</li>
                            <li>5PM</li>
                            <li>6PM</li>
                        </ul>
                        <table>
                            <colgroup>
                                <col width="14.2%" span="7"/>
                            </colgroup>
                            <tbody>
                            <tr>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                            </tr>
                            <tr>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                            </tr>
                            <tr>
                                <td></td>
                                <td>
                                    <div className="blue">
                                        <p>
                                            신청한 학생 : 8명
                                            <br/>
                                            예약 미승인 : 6명
                                        </p>
                                    </div>
                                </td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                            </tr>
                            <tr>
                                <td></td>
                                <td>
                                    <div className="blue">
                                        <p>
                                            신청한 학생 : 8명
                                            <br/>
                                            예약 미승인 : 6명
                                        </p>
                                    </div>
                                </td>
                                <td></td>
                                <td></td>
                                <td>
                                    <div className="yellow">
                                        <p>
                                            참가 학생 : 7명
                                            <br/>
                                            [결과 미입력]
                                        </p>
                                    </div>
                                </td>
                                <td></td>
                                <td></td>
                            </tr>
                            <tr>
                                <td></td>
                                <td>
                                    <div className="blue">
                                        <p>
                                            신청한 학생 : 8명
                                            <br/>
                                            예약 미승인 : 6명
                                        </p>
                                    </div>
                                </td>
                                <td></td>
                                <td></td>
                                <td>
                                    <div className="yellow">
                                        <p>
                                            참가 학생 : 7명
                                            <br/>
                                            [결과 미입력]
                                        </p>
                                    </div>
                                </td>
                                <td></td>
                                <td></td>
                            </tr>
                            <tr>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                            </tr>
                            <tr>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                            </tr>
                            <tr>
                                <td></td>
                                <td>
                                    <div className="mint">
                                        <p>8명 예약 완료</p>
                                    </div>
                                </td>
                                <td></td>
                                <td>
                                    <div className="gray">
                                        <p>예약 없음</p>
                                    </div>
                                </td>
                                <td></td>
                                <td></td>
                                <td></td>
                            </tr>
                            <tr>
                                <td></td>
                                <td>
                                    <div className="mint">
                                        <p>6명 예약 완료</p>
                                    </div>
                                </td>
                                <td></td>
                                <td>
                                    <div className="puple">
                                        <p>결과 입력완료</p>
                                    </div>
                                </td>
                                <td></td>
                                <td></td>
                                <td></td>
                            </tr>
                            <tr>
                                <td></td>
                                <td>
                                    <div className="blue">
                                        <p>
                                            신청한 학생 : 8명
                                            <br/>
                                            예약 미승인 : 6명
                                        </p>
                                    </div>
                                </td>
                                <td></td>
                                <td>
                                    <div className="puple">
                                        <p>결과 입력완료</p>
                                    </div>
                                </td>
                                <td></td>
                                <td></td>
                                <td></td>
                            </tr>
                            <tr>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
