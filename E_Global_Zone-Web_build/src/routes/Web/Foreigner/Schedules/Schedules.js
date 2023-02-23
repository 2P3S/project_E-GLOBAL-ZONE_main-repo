import React, { useState, useEffect, useRef } from "react";
import Calendar from "../../../../components/mobile/Calendar";
import moment from "moment";
import { useSelector } from "react-redux";
import {
  selectSelectDate,
  selectToday,
} from "../../../../redux/confSlice/confSlice";

import { selectUser } from "../../../../redux/userSlice/userSlice";
import Modal from "../../../../components/common/modal/Modal";
import useModal from "../../../../modules/hooks/useModal";
import ShowList from "../../../../components/common/modal/ShowList";
import ShowListDone from "../../../../components/common/modal/ShowListDone";
import InsertResult from "../../../../components/common/modal/InsertResult";
import Loader from "../../../../components/common/Loader";

import { getForeignerSchedule } from "../../../../api/foreigner/schedule";
import { LANGUAGE } from "../../../../conf/language";

const STATE_PENDING = "pending";
const STATE_RESERVED = "reserved";
const STATE_DONE = "done";
const STATE_CONFIRM = "confirm";
const STATE_NOTHING = "nothing";

class ScheduleData {
  countOfWeek = 0;
  countOfPending = 0;
  countOfReserved = 0;
  countOfDone = 0;
  countOfConfirm = 0;
}

class WeekData extends ScheduleData {
  monday;
  tuesday;
  wednesday;
  thursday;
  friday;

  constructor(arrayOfSchedule, today) {
    super();
    this.monday = [];
    this.tuesday = [];
    this.wednesday = [];
    this.thursday = [];
    this.friday = [];
    arrayOfSchedule.forEach((schedule) => {
      let oneSchedule = new Schedule(schedule, today);
      this.countOfWeek++;
      switch (parseInt(oneSchedule.day)) {
        case 1:
          this.monday.push(oneSchedule);
          break;
        case 2:
          this.tuesday.push(oneSchedule);
          break;
        case 3:
          this.wednesday.push(oneSchedule);
          break;
        case 4:
          this.thursday.push(oneSchedule);
          break;
        case 5:
          this.friday.push(oneSchedule);
          break;
      }

      switch (oneSchedule.state) {
        case STATE_PENDING:
          this.countOfPending++;
          break;
        case STATE_CONFIRM:
          this.countOfConfirm++;
          break;
        case STATE_DONE:
          this.countOfDone++;
          break;
        case STATE_RESERVED:
          this.countOfReserved++;
          break;
      }
    });
  }
}

class Schedule {
  sch_id;
  day;
  index;
  state;
  reservated_count;
  un_permission_count;
  sch_start_date;
  sch_end_date;
  sch_for_zoom_pw;
  sch_for_zoom_link;

  constructor(schObj, today) {
    this.sch_id = schObj.sch_id;
    this.setIndex(schObj.sch_start_date);
    this.setState(
      schObj.sch_end_date,
      schObj.un_permission_count,
      schObj.sch_state_of_result_input,
      schObj.reservated_count,
      today
    );
    this.reservated_count = schObj.reservated_count;
    this.un_permission_count = schObj.un_permission_count;
    this.sch_for_zoom_pw = schObj.sch_for_zoom_pw;
    this.setDate(schObj.sch_start_date);
    this.sch_end_date = schObj.sch_end_date;
    this.sch_start_date = schObj.sch_start_date;
    this.sch_for_zoom_link = schObj.sch_for_zoom_link;
  }

  setDate(sch_start_date) {
    let date = sch_start_date;
    this.day = moment(sch_start_date).format("d");
  }

  setIndex(sch_start_date) {
    let time = sch_start_date.substr(11, 2);
    let minute = sch_start_date.substr(14, 2);
    switch (time) {
      case "09":
        this.index = [0, minute === "00" ? 0 : 1];
        break;
      case "10":
        this.index = [1, minute === "00" ? 0 : 1];
        break;
      case "11":
        this.index = [2, minute === "00" ? 0 : 1];
        break;
      case "12":
        this.index = [3, minute === "00" ? 0 : 1];
        break;
      case "13":
        this.index = [4, minute === "00" ? 0 : 1];
        break;
      case "14":
        this.index = [5, minute === "00" ? 0 : 1];
        break;
      case "15":
        this.index = [6, minute === "00" ? 0 : 1];
        break;
      case "16":
        this.index = [7, minute === "00" ? 0 : 1];
        break;
      case "17":
        this.index = [8, minute === "00" ? 0 : 1];
        break;
      default:
        this.index = [false, 0];
    }
  }

  setState(
    sch_end_date,
    un_permission_count,
    sch_state_of_result_input,
    reservated_count,
    today
  ) {
    if (un_permission_count === 0 && reservated_count === 0) {
      this.state = STATE_NOTHING;
    } else {
      console.log(
        today,
        sch_end_date,
        moment(sch_end_date).isAfter(moment(today))
      );
      if (moment(sch_end_date).isAfter(moment(today))) {
        // 스케줄 시작 전
        if (reservated_count > 0 && un_permission_count === 0) {
          this.state = STATE_RESERVED;
        } else if (reservated_count > 0) {
          this.state = STATE_PENDING;
        }
      } else {
        // 스케줄 완료 후
        if (sch_state_of_result_input) {
          this.state = STATE_CONFIRM;
        } else {
          this.state = STATE_DONE;
        }
      }
    }
  }
}

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
      weeks.push(moment(weekStartDate).add(i, "d"));
    }
    return weeks;
  };
  const today = Date.now();
  const user = useSelector(selectUser);
  const selectedDate = useSelector(selectSelectDate);
  const [currentDate, setCurrentDate] = useState(moment(today));
  const [weekStartDate, setWeekStartDate] = useState();
  const [weekEndDate, setWeekEndDate] = useState();
  const [week, setWeek] = useState(makeWeek(weekStartDate));
  const [data, setData] = useState();
  const [scheduleData, setScheduleData] = useState();
  const { isOpen, handleClose, handleOpen } = useModal();
  const [modal, setModal] = useState(<></>);
  const [pending, setPending] = useState(false);
  const reRender = () => {
    getForeignerSchedule(weekStartDate, weekEndDate).then((res) => {
      setData(res.data);
    });
    setPending(false);
  };

  const getWeekStart = (currentDay) => {
    let startDate = currentDay;
    let i = 0;
    while (startDate.format("dddd") !== "Sunday") {
      startDate = startDate.subtract(1, "d");
      i++;
      // setWeekStartDate(startDate);
    }
    setWeekStartDate(
      moment(selectedDate).subtract(i, "d").format("YYYY-MM-DD")
    );
    setWeekEndDate(startDate.add(6, "d").format("YYYY-MM-DD"));
  };
  const buildDiv = (
    td,
    state,
    value,
    sch_id,
    sch_start_date,
    sch_end_date,
    sch_for_zoom_pw = 0,
    sch_for_zoom_link
  ) => {
    let div = document.createElement("div");
    switch (state) {
      case STATE_PENDING:
        div.className = "blue";
        div.addEventListener("click", () => {
          setModal(
            <ShowList
              handleClose={handleClose}
              sch_id={sch_id}
              sch_start_date={sch_start_date}
              sch_end_date={sch_end_date}
              reRender={reRender}
              sch_for_zoom_pw={sch_for_zoom_pw}
              sch_for_zoom_link={sch_for_zoom_link}
            />
          );
          handleOpen();
        });
        div.style.cursor = "pointer";
        break;
      case STATE_RESERVED:
        div.className = "mint";
        div.addEventListener("click", () => {
          setModal(
            <ShowList
              handleClose={handleClose}
              sch_id={sch_id}
              sch_start_date={sch_start_date}
              sch_end_date={sch_end_date}
              reRender={reRender}
              sch_for_zoom_pw={sch_for_zoom_pw}
              sch_for_zoom_link={sch_for_zoom_link}
            />
          );
          handleOpen();
        });
        break;
      case STATE_DONE:
        div.className = "yellow";
        div.addEventListener("click", () => {
          setModal(
            <InsertResult
              handleClose={handleClose}
              sch_id={sch_id}
              sch_start_date={sch_start_date}
              sch_end_date={sch_end_date}
              reRender={reRender}
            />
          );
          handleOpen();
        });
        div.style.cursor = "pointer";
        break;
      case STATE_CONFIRM:
        div.className = "puple";
        div.addEventListener("click", () => {
          setModal(
            <ShowListDone
              handleClose={handleClose}
              sch_id={sch_id}
              sch_start_date={sch_start_date}
              sch_end_date={sch_end_date}
              reRender={reRender}
            />
          );
          handleOpen();
        });
        div.style.cursor = "pointer";
        break;
      case STATE_NOTHING:
        div.className = "gray";

        break;
    }
    if (typeof value === "object") {
      let p = document.createElement("p");
      p.innerText = LANGUAGE[
        window.localStorage.getItem("global-zone-lang")
      ].numberReservationsCount(
        value[0],
        parseInt(value[0]) - parseInt(value[1])
      );

      div.appendChild(p);
    } else {
      let p = document.createElement("p");
      switch (state) {
        case STATE_RESERVED:
          p.innerText =
            LANGUAGE[
              window.localStorage.getItem("global-zone-lang")
            ].numberReservationsComplete(value);
          break;
        case STATE_DONE:
          p.innerText =
            LANGUAGE[
              window.localStorage.getItem("global-zone-lang")
            ].numberPresentStudents(value);
          break;
        case STATE_CONFIRM:
          p.innerText =
            LANGUAGE[
              window.localStorage.getItem("global-zone-lang")
            ].resultInputComplete;
          break;
        case STATE_NOTHING:
          Date.now() > new Date(sch_end_date)
            ? (p.innerText =
                LANGUAGE[
                  window.localStorage.getItem("global-zone-lang")
                ].shutDown)
            : (p.innerText =
                LANGUAGE[
                  window.localStorage.getItem("global-zone-lang")
                ].noReservations);
          break;
      }
      div.appendChild(p);
    }
    td.appendChild(div);
  };
  const buildTable = (scheduleData) => {
    const { monday, tuesday, wednesday, thursday, friday } = scheduleData;
    const tbody = document.getElementById("tbody");
    tbody.innerText = "";
    for (let i = 0; i < 2; i++) {
      let tr = document.createElement("tr");
      for (let j = 0; j < 7; j++) {
        tr.appendChild(document.createElement("td"));
      }
      tbody.appendChild(tr);
    }
    for (let i = 0; i < 9; i++) {
      let tr = document.createElement("tr");
      for (let j = 0; j < 7; j++) {
        let td = document.createElement("td");
        switch (j) {
          case 1:
            td.id = `monday${i}`;
            monday.forEach((v) => {
              if (v.index[0] === i) {
                if (v.index[1] === 1) {
                  if (v.state === STATE_PENDING) {
                    buildDiv(
                      td,
                      v.state,
                      [
                        v.reservated_count.toString(),
                        v.un_permission_count.toString(),
                      ],
                      v.sch_id,
                      v.sch_start_date,
                      v.sch_end_date,
                      v.sch_for_zoom_pw,
                      v.sch_for_zoom_link
                    );
                  } else {
                    buildDiv(
                      td,
                      v.state,
                      v.reservated_count.toString(),
                      v.sch_id,
                      v.sch_start_date,
                      v.sch_end_date,
                      v.sch_for_zoom_pw,
                      v.sch_for_zoom_link
                    );
                  }
                } else {
                  if (v.state === STATE_PENDING) {
                    buildDiv(
                      td,
                      v.state,
                      [
                        v.reservated_count.toString(),
                        v.un_permission_count.toString(),
                      ],
                      v.sch_id,
                      v.sch_start_date,
                      v.sch_end_date,
                      v.sch_for_zoom_pw,
                      v.sch_for_zoom_link
                    );
                  } else {
                    buildDiv(
                      td,
                      v.state,
                      v.reservated_count.toString(),
                      v.sch_id,
                      v.sch_start_date,
                      v.sch_end_date,
                      v.sch_for_zoom_pw,
                      v.sch_for_zoom_link
                    );
                  }
                }
              }
            });
            break;
          case 2:
            td.id = `tuesday${i}`;
            tuesday.forEach((v) => {
              if (v.index[0] === i) {
                if (v.index[1] === 1) {
                  if (v.state === STATE_PENDING) {
                    buildDiv(
                      td,
                      v.state,
                      [
                        v.reservated_count.toString(),
                        v.un_permission_count.toString(),
                      ],
                      v.sch_id,
                      v.sch_start_date,
                      v.sch_end_date,
                      v.sch_for_zoom_pw,
                      v.sch_for_zoom_link
                    );
                  } else {
                    buildDiv(
                      td,
                      v.state,
                      v.reservated_count.toString(),
                      v.sch_id,
                      v.sch_start_date,
                      v.sch_end_date,
                      v.sch_for_zoom_pw,
                      v.sch_for_zoom_link
                    );
                  }
                } else {
                  if (v.state === STATE_PENDING) {
                    buildDiv(
                      td,
                      v.state,
                      [
                        v.reservated_count.toString(),
                        v.un_permission_count.toString(),
                      ],
                      v.sch_id,
                      v.sch_start_date,
                      v.sch_end_date,
                      v.sch_for_zoom_pw,
                      v.sch_for_zoom_link
                    );
                  } else {
                    buildDiv(
                      td,
                      v.state,
                      v.reservated_count.toString(),
                      v.sch_id,
                      v.sch_start_date,
                      v.sch_end_date,
                      v.sch_for_zoom_pw,
                      v.sch_for_zoom_link
                    );
                  }
                }
              }
            });
            break;
          case 3:
            td.id = `wednesday${i}`;
            wednesday.forEach((v) => {
              if (v.index[0] === i) {
                if (v.index[1] === 1) {
                  if (v.state === STATE_PENDING) {
                    buildDiv(
                      td,
                      v.state,
                      [
                        v.reservated_count.toString(),
                        v.un_permission_count.toString(),
                      ],
                      v.sch_id,
                      v.sch_start_date,
                      v.sch_end_date,
                      v.sch_for_zoom_pw,
                      v.sch_for_zoom_link
                    );
                  } else {
                    buildDiv(
                      td,
                      v.state,
                      v.reservated_count.toString(),
                      v.sch_id,
                      v.sch_start_date,
                      v.sch_end_date,
                      v.sch_for_zoom_pw,
                      v.sch_for_zoom_link
                    );
                  }
                } else {
                  if (v.state === STATE_PENDING) {
                    buildDiv(
                      td,
                      v.state,
                      [
                        v.reservated_count.toString(),
                        v.un_permission_count.toString(),
                      ],
                      v.sch_id,
                      v.sch_start_date,
                      v.sch_end_date,
                      v.sch_for_zoom_pw,
                      v.sch_for_zoom_link
                    );
                  } else {
                    buildDiv(
                      td,
                      v.state,
                      v.reservated_count.toString(),
                      v.sch_id,
                      v.sch_start_date,
                      v.sch_end_date,
                      v.sch_for_zoom_pw,
                      v.sch_for_zoom_link
                    );
                  }
                }
              }
            });
            break;
          case 4:
            td.id = `thursday${i}`;
            thursday.forEach((v) => {
              if (v.index[0] === i) {
                if (v.index[1] === 1) {
                  if (v.state === STATE_PENDING) {
                    buildDiv(
                      td,
                      v.state,
                      [
                        v.reservated_count.toString(),
                        v.un_permission_count.toString(),
                      ],
                      v.sch_id,
                      v.sch_start_date,
                      v.sch_end_date,
                      v.sch_for_zoom_pw,
                      v.sch_for_zoom_link
                    );
                  } else {
                    buildDiv(
                      td,
                      v.state,
                      v.reservated_count.toString(),
                      v.sch_id,
                      v.sch_start_date,
                      v.sch_end_date,
                      v.sch_for_zoom_pw,
                      v.sch_for_zoom_link
                    );
                  }
                } else {
                  if (v.state === STATE_PENDING) {
                    buildDiv(
                      td,
                      v.state,
                      [
                        v.reservated_count.toString(),
                        v.un_permission_count.toString(),
                      ],
                      v.sch_id,
                      v.sch_start_date,
                      v.sch_end_date,
                      v.sch_for_zoom_pw,
                      v.sch_for_zoom_link
                    );
                  } else {
                    buildDiv(
                      td,
                      v.state,
                      v.reservated_count.toString(),
                      v.sch_id,
                      v.sch_start_date,
                      v.sch_end_date,
                      v.sch_for_zoom_pw,
                      v.sch_for_zoom_link
                    );
                  }
                }
              }
            });
            break;
          case 5:
            td.id = `friday${i}`;
            friday.forEach((v) => {
              if (v.index[0] === i) {
                if (v.index[1] === 1) {
                  if (v.state === STATE_PENDING) {
                    buildDiv(
                      td,
                      v.state,
                      [
                        v.reservated_count.toString(),
                        v.un_permission_count.toString(),
                      ],
                      v.sch_id,
                      v.sch_start_date,
                      v.sch_end_date,
                      v.sch_for_zoom_pw,
                      v.sch_for_zoom_link
                    );
                  } else {
                    buildDiv(
                      td,
                      v.state,
                      v.reservated_count.toString(),
                      v.sch_id,
                      v.sch_start_date,
                      v.sch_end_date,
                      v.sch_for_zoom_pw,
                      v.sch_for_zoom_link
                    );
                  }
                } else {
                  if (v.state === STATE_PENDING) {
                    buildDiv(
                      td,
                      v.state,
                      [
                        v.reservated_count.toString(),
                        v.un_permission_count.toString(),
                      ],
                      v.sch_id,
                      v.sch_start_date,
                      v.sch_end_date,
                      v.sch_for_zoom_pw,
                      v.sch_for_zoom_link
                    );
                  } else {
                    buildDiv(
                      td,
                      v.state,
                      v.reservated_count.toString(),
                      v.sch_id,
                      v.sch_start_date,
                      v.sch_end_date,
                      v.sch_for_zoom_pw,
                      v.sch_for_zoom_link
                    );
                  }
                }
              }
            });
            break;
        }
        tr.appendChild(td);
      }
      tbody.appendChild(tr);
    }
  };

  useEffect(() => {
    window.easydropdown.all();
    setPending(true);
    getWeekStart(moment(today));
  }, []);
  useEffect(() => {
    // setPending(true);
    getWeekStart(moment(selectedDate));
    setPending(true);
  }, [selectedDate]);
  useEffect(() => {
    if (weekStartDate !== undefined) {
      setPending(true);
      setWeek(makeWeek(weekStartDate));
    }
  }, [weekStartDate]);

  useEffect(() => {
    pending && reRender();
  }, [pending]);

  useEffect(() => {
    if (data) {
      setScheduleData(new WeekData(data.data, today));
    }
  }, [data]);
  useEffect(() => {
    console.log(scheduleData);
    if (scheduleData) buildTable(scheduleData);
  }, [scheduleData]);

  return (
    <div className="wrapper">
      <div className="content">
        <div className="sub_title">
          <p className="tit">
            {
              LANGUAGE[window.localStorage.getItem("global-zone-lang")]
                .scheduleAndReservationManagement
            }
          </p>
        </div>
        <div className="status_wrap">
          <div className="mt50 mr20">
            <Calendar />
          </div>
          <div className="status_box">
            <div
              className="gray"
              style={{
                fontSize:
                  window.localStorage.getItem("global-zone-lang") === "eng"
                    ? "10px"
                    : "",
              }}
            >
              {
                LANGUAGE[window.localStorage.getItem("global-zone-lang")]
                  .thisWeeksSchedule
              }
              <p>
                <span>{scheduleData ? scheduleData.countOfWeek : 0}</span>
              </p>
            </div>
            <div
              className="blue"
              style={{
                fontSize:
                  window.localStorage.getItem("global-zone-lang") === "eng"
                    ? "10px"
                    : "",
              }}
            >
              {
                LANGUAGE[window.localStorage.getItem("global-zone-lang")]
                  .waitingForReservationConfirmation
              }
              <p>
                <span>{scheduleData ? scheduleData.countOfPending : 0}</span>
              </p>
            </div>
            <div
              className="mint"
              style={{
                fontSize:
                  window.localStorage.getItem("global-zone-lang") === "eng"
                    ? "10px"
                    : "",
              }}
            >
              {
                LANGUAGE[window.localStorage.getItem("global-zone-lang")]
                  .reservationConfirmationComplete
              }
              <p>
                <span>{scheduleData ? scheduleData.countOfReserved : 0}</span>
              </p>
            </div>
            <div
              className="yellow"
              style={{
                fontSize:
                  window.localStorage.getItem("global-zone-lang") === "eng"
                    ? "10px"
                    : "",
              }}
            >
              {
                LANGUAGE[window.localStorage.getItem("global-zone-lang")]
                  .attendanceWasNotRecorded
              }
              <p>
                <span>{scheduleData ? scheduleData.countOfDone : 0}</span>
              </p>
            </div>
            <div
              className="puple"
              style={{
                fontSize:
                  window.localStorage.getItem("global-zone-lang") === "eng"
                    ? "10px"
                    : "",
              }}
            >
              {
                LANGUAGE[window.localStorage.getItem("global-zone-lang")]
                  .noReservations
              }
              <p>
                <span>{scheduleData ? scheduleData.countOfConfirm : 0}</span>
              </p>
            </div>
          </div>
        </div>

        <div className="week_wrap">
          <ul className="day_week">
            {!pending ? (
              <>
                <li>
                  {
                    LANGUAGE[window.localStorage.getItem("global-zone-lang")]
                      .sunday
                  }
                  <span
                    className={
                      moment(selectedDate).diff(week[0], "days") === 0
                        ? `today`
                        : ``
                    }
                  >
                    {week[0].format("DD")}
                  </span>
                </li>
                <li>
                  {
                    LANGUAGE[window.localStorage.getItem("global-zone-lang")]
                      .monday
                  }
                  <span
                    className={
                      moment(selectedDate).diff(week[1], "days") === 0
                        ? "today"
                        : ``
                    }
                  >
                    {week[1].format("DD")}
                  </span>
                </li>
                <li>
                  {
                    LANGUAGE[window.localStorage.getItem("global-zone-lang")]
                      .tuesday
                  }
                  <span
                    className={
                      moment(selectedDate).diff(week[2], "days") === 0
                        ? `today`
                        : ``
                    }
                  >
                    {week[2].format("DD")}
                  </span>
                </li>
                <li>
                  {
                    LANGUAGE[window.localStorage.getItem("global-zone-lang")]
                      .wednesday
                  }
                  <span
                    className={
                      moment(selectedDate).diff(week[3], "days") === 0
                        ? `today`
                        : ``
                    }
                  >
                    {week[3].format("DD")}
                  </span>
                </li>
                <li>
                  {
                    LANGUAGE[window.localStorage.getItem("global-zone-lang")]
                      .thursday
                  }
                  <span
                    className={
                      moment(selectedDate).diff(week[4], "days") === 0
                        ? `today`
                        : ``
                    }
                  >
                    {week[4].format("DD")}
                  </span>
                </li>
                <li>
                  {
                    LANGUAGE[window.localStorage.getItem("global-zone-lang")]
                      .friday
                  }
                  <span
                    className={
                      moment(selectedDate).diff(week[5], "days") === 0
                        ? `today`
                        : ``
                    }
                  >
                    {week[5].format("DD")}
                  </span>
                </li>
                <li>
                  {
                    LANGUAGE[window.localStorage.getItem("global-zone-lang")]
                      .saturday
                  }
                  <span
                    className={
                      moment(selectedDate).diff(week[6], "days") === 0
                        ? `today`
                        : ``
                    }
                  >
                    {week[6].format("DD")}
                  </span>
                </li>
              </>
            ) : (
              <>
                <Loader />
              </>
            )}
          </ul>
          <div className="week_table">
            <div className="scroll_area">
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
                  <col width="14.2%" span="7" />
                </colgroup>
                <tbody id="tbody"></tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <Modal isOpen={isOpen} handleClose={handleClose}>
        {modal}
      </Modal>
    </div>
  );
}
