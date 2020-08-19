import React, {useEffect} from "react";

export default function Schedules() {
    useEffect(() => {
        window.easydropdown.all();
    }, []);
    return (
        <div className="wrapper">
            <div class="content">
                <div class="sub_title">
                    <p class="tit">스케줄 및 예약관리</p>
                </div>
                <div class="status_wrap">
                    <div class="mt50">
                        <img
                            src="/global/mobile/img/calendar_ex.png"
                            alt="캘린더 예시"
                            style={{width: "260px"}}
                        />
                    </div>
                    <div class="status_box">
                        <div class="gray">
                            이번주 스케줄
                            <p>
                                <span>11</span>건
                            </p>
                        </div>
                        <div class="blue">
                            예약 승인 대기
                            <p>
                                <span>4</span>건
                            </p>
                        </div>
                        <div class="mint">
                            예약 승인 완료
                            <p>
                                <span>2</span>건
                            </p>
                        </div>
                        <div class="yellow">
                            출석 결과 미입력
                            <p>
                                <span>2</span>건
                            </p>
                        </div>
                        <div class="puple">
                            출석 결과 입력완료
                            <p>
                                <span>2</span>건
                            </p>
                        </div>
                    </div>
                </div>

                <div class="week_wrap">
                    <ul class="day_week">
                        <li>
                            일<span>12</span>
                        </li>
                        <li>
                            월<span class="today">13</span>
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
                    </ul>
                    <div class="week_table">
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
                                    <div class="blue">
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
                                    <div class="blue">
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
                                    <div class="yellow">
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
                                    <div class="blue">
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
                                    <div class="yellow">
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
                                    <div class="mint">
                                        <p>8명 예약 완료</p>
                                    </div>
                                </td>
                                <td></td>
                                <td>
                                    <div class="gray">
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
                                    <div class="mint">
                                        <p>6명 예약 완료</p>
                                    </div>
                                </td>
                                <td></td>
                                <td>
                                    <div class="puple">
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
                                    <div class="blue">
                                        <p>
                                            신청한 학생 : 8명
                                            <br/>
                                            예약 미승인 : 6명
                                        </p>
                                    </div>
                                </td>
                                <td></td>
                                <td>
                                    <div class="puple">
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
