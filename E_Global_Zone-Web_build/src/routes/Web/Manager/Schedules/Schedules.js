import React, { useEffect, useState, useMemo } from "react";
import moment from "moment";
import { useSelector, useDispatch } from "react-redux";
import {
  selectSelectDate,
  selectToday,
  setSelectDate as _setSelectDate,
} from "../../../../redux/confSlice/confSlice";

import useModal from "../../../../modules/hooks/useModal";
import Modal from "../../../../components/common/modal/Modal";

import {
  deleteAdminScheduleDate,
  getAdminSchedule,
  getAdminScheduleOnline,
  getAdminScheduleOffline,
} from "../../../../api/admin/schedule";

import ModalCalendar from "../../../../components/common/modal/ModalCalendar";

import ShowList from "../../../../components/common/modal/ShowList";
import ShowListDone from "../../../../components/common/modal/ShowListDone";
import { useHistory, useParams } from "react-router-dom";
import InsertResult from "../../../../components/common/modal/InsertResult";
import DeleteSchedule from "../../../../components/common/modal/DeleteSchedule";
import PermissionScheduleResult from "../../../../components/common/modal/PermissionScheduleResult";
import Loader from "../../../../components/common/Loader";
import ShowResult from "../../../../components/common/modal/ShowResult";
import ScheduleDownload from "../../../../components/common/modal/ScheduleDownload";

/**
 * Manager :: 스케줄 조회
 * @returns {JSX.Element}
 * @constructor
 */
export default function Schedules() {
  const params = useParams();

  const dispatch = useDispatch();
  const history = useHistory();
  const today = useSelector(selectToday);
  const _selectDate = useSelector(selectSelectDate);
  const [selectDate, setSelectDate] = useState(params.date);
  const [calIsOpen, setCalIsOpen] = useState(false);
  const [kindOfData, setKindOfData] = useState(false);
  const [firstRendering, setFirstRendering] = useState(true);
  const [reservationType, setReservationType] = useState("online"); // 'online' 또는 'offline'
  const {
    isOpen: scheduleIsOpen,
    handleClose: scheduleClose,
    handleOpen: scheduleOpen,
  } = useModal();
  const {
    isOpen: downloadIsOpen,
    handleClose: handleCloseForDownload,
    handleOpen: handleOpenForDownload,
  } = useModal();
  const [selectedSchedule, setSelectedSchedule] = useState({});
  const [pending, setPending] = useState(false);
  const [schedules, setSchedules] = useState();
  const [countOfEng, setCountOfEng] = useState();
  const [countOfJp, setCountOfJp] = useState();
  const [countOfCh, setCountOfCh] = useState();
  const [countOfstate, setCountOfState] = useState({
    state1: 0,
    state2: 0,
    state3: 0,
    state4: 0,
    state5: 0,
    state6: 0,
    state7: 0,
  });

  const handleOpenForCalendar = () => {
    setCalIsOpen(!calIsOpen);
  };

  const handleCheck = (className) => {
    if (className === "checkAll") {
      for (const key in document.getElementsByClassName("state_box")) {
        if (document.getElementsByClassName("state_box").hasOwnProperty(key)) {
          const element = document.getElementsByClassName("state_box")[key];
          element.classList.remove("off");
        }
      }
    } else {
      for (const key in document.getElementsByClassName("state_box")) {
        if (document.getElementsByClassName("state_box").hasOwnProperty(key)) {
          const element = document.getElementsByClassName("state_box")[key];
          element.classList.add("off");
        }
      }
      for (const key in document.getElementsByClassName(
        `state_box ${className}`
      )) {
        if (
          document
            .getElementsByClassName(`state_box ${className}`)
            .hasOwnProperty(key)
        ) {
          const element = document.getElementsByClassName(
            `state_box ${className}`
          )[key];
          element.classList.remove("off");
        }
      }
    }
  };
  const handleChange = (e) => {
    console.log(e.target);
    handleCheck(e.target.value);
  };

  const handleClick = (e) => {
    // 온라인/오프라인 예약 토글은 별도 처리
    if (e.target.name === "reservationType") {
      setReservationType(e.target.value);
      return;
    }

    // 기존 상태 체크박스 처리
    document
      .getElementsByName("checkBox")
      .forEach((v) => v.value !== e.target.value && (v.checked = false));
    e.target.checked = true;
  };
  useMemo(() => {
    if (moment(params.date).format("YYYY-MM-DD") !== _selectDate) {
      setSelectDate(moment(params.date).format("YYYY-MM-DD"));
    }
    if (params.date.length > 10 || params.date.length < 9) {
      history.push("/");
    }
  }, [params]);

  useEffect(() => {
    document.getElementsByName("checkBox").forEach((v) => {
      // v.checked = false;
      v.addEventListener("click", handleClick);
      v.addEventListener("change", handleChange);
    });

    // 온라인/오프라인 예약 토글 버튼 이벤트 리스너 추가
    document.getElementsByName("reservationType").forEach((v) => {
      v.addEventListener("click", handleClick);
    });
  }, []);

  useEffect(() => {
    if (!firstRendering) {
      history.push(`/schedules/${moment(_selectDate).format("YYYY-MM-DD")}`);
      setSelectDate(_selectDate);
    } else {
      if (params.date !== _selectDate) {
        let { date } = params;
        dispatch(_setSelectDate(moment(date).format("YYYY-MM-DD")));
      }
    }
  }, [_selectDate]);
  useEffect(() => {
    setPending(true);
    document.getElementsByName("checkBox").forEach((v) => {
      v.checked = false;
    });
    document.getElementById("allCheck").checked = true;
  }, [selectDate]);

  useEffect(() => {
    if (pending) {
      setCountOfState({
        state1: 0,
        state2: 0,
        state3: 0,
        state4: 0,
        state5: 0,
        state6: 0,
        state7: 0,
      });
    }
    pending &&
      (() => {
        // 예약 유형에 따라 다른 API 호출
        let apiCall;
        switch (reservationType) {
          case "online":
            apiCall = getAdminScheduleOnline({ search_date: params.date });
            break;
          case "offline":
            apiCall = getAdminScheduleOffline({ search_date: params.date });
            break;
          default:
            apiCall = getAdminSchedule({ search_date: params.date });
            break;
        }

        apiCall
          .then((res) => {
            console.log("API Response:", res.data);
            console.log("Reservation Type:", reservationType);
            setSchedules(res.data);
            setFirstRendering(false);
          })
          .catch((error) => {
            console.error("API Error:", error);
            console.error("Error Response:", error.response);
          });
      })();
  }, [pending, reservationType]);

  useEffect(() => {
    if (
      schedules &&
      schedules.message === "스케줄 목록 조회에 성공하였습니다."
    ) {
      setPending(false);
    }
    if (schedules && schedules.data) {
      setCountOfEng(schedules.data.English.length);
      setCountOfJp(schedules.data.Japanese.length);
      setCountOfCh(schedules.data.Chinese.length);
    }
  }, [schedules]);

  // 예약 유형이 변경될 때마다 스케줄 다시 조회
  useEffect(() => {
    if (!firstRendering) {
      setPending(true);
    }
  }, [reservationType]);

  const reRender = () => {
    setPending(true);
  };

  useEffect(() => {
    if (schedules && schedules.data) {
      if (!pending && schedules.data) {
        let noData = true;
        Object.values(schedules.data).forEach((v) => {
          v.length > 0 && (noData = false);
        });
        if (!noData) {
          let tag = true;
          for (const key in schedules.data) {
            if (schedules.data.hasOwnProperty(key)) {
              const element = schedules.data[key];
              element.forEach((v) => {
                v.schedules.forEach((schedule) => {
                  if (tag) {
                    document.getElementById("date").innerText =
                      moment(selectDate).format("YYYY년 MM월 DD일");
                    tag = false;
                  }
                  let td = document.getElementById(
                    `${v.std_for_id}_${moment(schedule.sch_start_date).format(
                      "h"
                    )}`
                  );

                  // td가 null인 경우 처리
                  if (!td) {
                    console.warn(
                      `TD element not found for schedule: ${schedule.sch_id}`
                    );
                    return;
                  }

                  let div = document.createElement("div");
                  // if(moment(schedule.sch_start_date))
                  if (
                    moment(schedule.sch_start_date).minute() !== 0 &&
                    td.childNodes.length === 0
                  ) {
                    // td.style.backgroundColor = "red";
                    let blank = document.createElement("div");
                    blank.className = "state_box";
                    td.appendChild(blank);
                  }
                  div.classList.add("state_box");
                  if (
                    schedule.un_permission_count === 0 &&
                    schedule.reservated_count === 0
                  ) {
                    if (moment(schedule.sch_start_date) > moment(Date.now())) {
                      div.classList.add("state7");
                      setCountOfState({
                        ...countOfstate,
                        state7: ++countOfstate.state7,
                      });
                    } else {
                      div.classList.add("state7");
                      setCountOfState({
                        ...countOfstate,
                        state7: ++countOfstate.state7,
                      });
                      let close = document.createElement("div");
                      close.className = "close";
                      div.appendChild(close);
                    }
                  } else {
                    if (
                      new Date(schedule.sch_end_date) > new Date(Date.now())
                    ) {
                      // 스케줄 시작 전
                      if (
                        schedule.reservated_count > 0 &&
                        schedule.un_permission_count === 0
                      ) {
                        div.classList.add("state2");
                        setCountOfState({
                          ...countOfstate,
                          state2: ++countOfstate.state2,
                        });
                        let p = document.createElement("p");
                        p.innerText = `${schedule.reservated_count}`;
                        div.appendChild(p);
                      } else if (schedule.reservated_count > 0) {
                        div.classList.add("state1");
                        setCountOfState({
                          ...countOfstate,
                          state1: ++countOfstate.state1,
                        });
                        let p = document.createElement("p");
                        p.innerText = `${schedule.un_permission_count} / `;
                        let span = document.createElement("span");
                        span.innerText = `${schedule.reservated_count}`;
                        p.appendChild(span);
                        div.appendChild(p);
                      }
                    } else {
                      // 스케줄 완료 후
                      if (schedule.sch_state_of_permission) {
                        div.classList.add("state6");
                        setCountOfState({
                          ...countOfstate,
                          state6: ++countOfstate.state6,
                        });
                      } else if (schedule.sch_state_of_result_input) {
                        div.classList.add("state5");
                        setCountOfState({
                          ...countOfstate,
                          state5: ++countOfstate.state5,
                        });
                        let p = document.createElement("p");
                        p.innerText = `${schedule.reservated_count}`;
                        div.appendChild(p);
                      } else {
                        div.classList.add("state3");
                        setCountOfState({
                          ...countOfstate,
                          state3: ++countOfstate.state3,
                        });
                        let p = document.createElement("p");
                        p.innerText = `${schedule.reservated_count}`;
                        div.appendChild(p);
                      }
                    }
                  }
                  function clickListner() {
                    if (
                      div.classList.contains("state2") ||
                      div.classList.contains("state1")
                    ) {
                      setSelectedSchedule({
                        sch_for_zoom_pw: schedule.sch_for_zoom_pw,
                        sch_for_zoom_link: schedule.sch_for_zoom_link,
                        sch_id: schedule.sch_id,
                        component: "ShowList",
                        std_for_id: v.std_for_id,
                        std_for_name: v.std_for_name,
                        sch_end_date: schedule.sch_end_date,
                        sch_start_date: schedule.sch_start_date,
                        sch_type: schedule.sch_type,
                        sch_location: schedule.sch_location,
                      });
                      scheduleOpen();
                    } else if (div.classList.contains("state3")) {
                      setSelectedSchedule({
                        sch_for_zoom_pw: schedule.sch_for_zoom_pw,
                        sch_for_zoom_link: schedule.sch_for_zoom_link,
                        sch_id: schedule.sch_id,
                        component: "ShowListDone",
                        std_for_id: v.std_for_id,
                        std_for_name: v.std_for_name,
                        sch_end_date: schedule.sch_end_date,
                        sch_start_date: schedule.sch_start_date,
                      });
                      scheduleOpen();
                    } else if (div.classList.contains("state5")) {
                      setSelectedSchedule({
                        sch_for_zoom_pw: schedule.sch_for_zoom_pw,
                        sch_for_zoom_link: schedule.sch_for_zoom_link,
                        sch_id: schedule.sch_id,
                        component: "PermissionScheduleResult",
                        std_for_id: v.std_for_id,
                        std_for_name: v.std_for_name,
                        sch_end_date: schedule.sch_end_date,
                        sch_start_date: schedule.sch_start_date,
                      });
                      scheduleOpen();
                    } else if (div.classList.contains("state6")) {
                      setSelectedSchedule({
                        sch_for_zoom_pw: schedule.sch_for_zoom_pw,
                        sch_for_zoom_link: schedule.sch_for_zoom_link,
                        sch_id: schedule.sch_id,
                        component: "ShowResult",
                        std_for_id: v.std_for_id,
                        std_for_name: v.std_for_name,
                        sch_end_date: schedule.sch_end_date,
                        sch_start_date: schedule.sch_start_date,
                      });
                      scheduleOpen();
                    } else if (
                      div.classList.contains("state7") &&
                      !div.classList.contains("done")
                    ) {
                      setSelectedSchedule({
                        sch_for_zoom_pw: schedule.sch_for_zoom_pw,
                        sch_for_zoom_link: schedule.sch_for_zoom_link,
                        sch_id: schedule.sch_id,
                        component: "ShowList",
                        std_for_id: v.std_for_id,
                        std_for_name: v.std_for_name,
                        sch_end_date: schedule.sch_end_date,
                        sch_start_date: schedule.sch_start_date,
                        sch_type: schedule.sch_type,
                        sch_location: schedule.sch_location,
                      });
                      scheduleOpen();
                    }
                  }
                  function addListner(div) {
                    div.addEventListener("click", clickListner);
                  }
                  if (
                    moment(schedule.sch_end_date).isBefore(moment(Date.now()))
                  ) {
                    div.classList.add("done");
                  }
                  addListner(div);
                  // 삭제버튼
                  let deleteBtn = document.createElement("div");
                  let area = document.createElement("div");
                  let btn = document.createElement("div");
                  deleteBtn.className =
                    td &&
                    document.getElementById("tbody") &&
                    document.getElementById("tbody").children[1] ===
                      td.parentElement
                      ? "sch_hover_btn bottom hover_off"
                      : "sch_hover_btn top hover_off";
                  area.className = "area";
                  btn.className = "lightGray";
                  btn.innerText = "삭제";
                  area.appendChild(btn);
                  deleteBtn.appendChild(area);
                  if (!div.classList.contains("done")) {
                    div.addEventListener("mouseover", () => {
                      deleteBtn.classList.remove("hover_off");
                    });
                    div.addEventListener("mouseout", () => {
                      deleteBtn.classList.add("hover_off");
                    });
                    btn.addEventListener("mouseover", (e) => {
                      div.removeEventListener("click", clickListner);
                    });
                    btn.addEventListener("mouseout", () => {
                      addListner(div);
                    });
                    btn.addEventListener("click", (e) => {
                      if (e.target.innerText === "삭제") {
                        setSelectedSchedule({
                          sch_id: schedule.sch_id,
                          component: "Delete",
                          std_for_id: v.std_for_id,
                          std_for_name: v.std_for_name,
                          sch_end_date: schedule.sch_end_date,
                          sch_start_date: schedule.sch_start_date,
                        });
                      }
                      setTimeout(scheduleOpen, 500);
                      // scheduleOpen();
                    });
                    div.appendChild(deleteBtn);
                  }
                  td.appendChild(div);
                });
              });
            }
          }
        }
      } else {
        document.getElementById("date").innerText =
          moment(selectDate).format("YYYY년 MM월 DD일");
      }
    }
  }, [schedules, pending]);
  return (
    <div className="content">
      <div className="sub_title">
        <p className="tit" id="date"></p>
        <div className="select_date" onClick={handleOpenForCalendar}>
          <img src="/global/img/select_date_ico.gif" alt="날짜 선택" />
        </div>

        <div
          style={{ position: "absolute", zIndex: "9999" }}
          onMouseLeave={() => setCalIsOpen(false)}
        >
          {calIsOpen && (
            <ModalCalendar
              id="calendar"
              handleClose={() => {
                handleOpenForCalendar();
              }}
              setState={() => {}}
              selectDate={selectDate}
            />
          )}
        </div>

        <div className="check_box_area">
          <div className="check_box">
            <div className="check_box_input all">
              <input
                type="checkbox"
                id="allCheck"
                name="checkBox"
                value="checkAll"
              />
              <label htmlFor="allCheck"></label>
            </div>
          </div>

          <div className="check_box">
            <div className="check_box_input">
              <div className="toggle_buttons">
                <input
                  type="radio"
                  id="online_reservation"
                  name="reservationType"
                  value="online"
                  checked={reservationType === "online"}
                  onChange={(e) => setReservationType(e.target.value)}
                />
                <label
                  htmlFor="online_reservation"
                  className={`toggle_btn ${
                    reservationType === "online" ? "active" : ""
                  }`}
                >
                  <span>온라인</span>
                </label>

                <input
                  type="radio"
                  id="offline_reservation"
                  name="reservationType"
                  value="offline"
                  checked={reservationType === "offline"}
                  onChange={(e) => setReservationType(e.target.value)}
                />
                <label
                  htmlFor="offline_reservation"
                  className={`toggle_btn ${
                    reservationType === "offline" ? "active" : ""
                  }`}
                >
                  <span>오프라인</span>
                </label>
              </div>
            </div>
          </div>

          <div className="check_box">
            <div className="check_box_input">
              <input
                type="checkbox"
                id="no_app_reservation"
                name="checkBox"
                value="state1"
              />
              <label htmlFor="no_app_reservation">
                <span>
                  예약 미승인{" "}
                  <span className="blue">{countOfstate.state1}</span>건
                </span>
              </label>
            </div>
          </div>

          <div className="check_box">
            <div className="check_box_input">
              <input
                type="checkbox"
                id="not_result"
                name="checkBox"
                value="state3"
              />
              <label htmlFor="not_result">
                <span>
                  결과 미입력{" "}
                  <span className="mint">{countOfstate.state3}</span>건
                </span>
              </label>
            </div>
          </div>

          <div className="check_box">
            <div className="check_box_input">
              <input
                type="checkbox"
                id="no_app_result"
                name="checkBox"
                value="state5"
              />
              <label htmlFor="no_app_result">
                <span>
                  결과 미승인{" "}
                  <span className="yellow">{countOfstate.state5}</span>건
                </span>
              </label>
            </div>
          </div>

          <div className="check_box">
            <div className="check_box_input">
              <input
                type="checkbox"
                id="ok_result"
                name="checkBox"
                value="state6"
              />
              <label htmlFor="ok_result">
                <span>
                  결과 입력완료{" "}
                  <span className="puple">{countOfstate.state6}</span>건
                </span>
              </label>
            </div>
          </div>
        </div>
      </div>

      <div className="sch_info">
        <ul>
          <li className="ico01">[예약현황] 미승인 / 총 신청 학생</li>
          <li className="ico02">[예약 승인 완료]</li>
        </ul>
        <ul>
          {/* 여기에 미승인 목록 모달 달아야함 */}
          {/* 화이팅ㅋㅋ */}
          <li className="ico03">[결과 미입력] 출석 학생</li>
          {/* <li className="ico04">[결과 입력 완료]</li> 2020-09-09 삭제 */}
        </ul>
        <ul>
          <li className="ico05">[관리자 미승인] 출석 학생</li>
          <li className="ico06">[관리자 승인 완료]</li>
        </ul>
      </div>
      <div className="wrap">
        <ul className="sch_time">
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
        <div className="scroll_area">
          {!pending ? (
            <table className="sch_table">
              <colgroup>
                <col width="4%" />
                <col width="12%" />
                <col width="9%" span="9" />
              </colgroup>
              <tbody id="tbody">
                {/* <!--  
                                state1 :: [예약현황] 미승인 / 총 신청 학생
                                state2 :: [예약 승인 완료] 
                                state3 :: [결과 미입력] 출석 학생
                                state4 :: [결과 입력 완료]
                                state5 :: [관리자 미승인] 출석 학생
                                state6 :: [관리자 승인 완료]
                                state7 :: 예약없음 
                            --> */}
                {countOfCh === 0 && countOfEng === 0 && countOfJp === 0 && (
                  <tr>
                    <td
                      colSpan="10"
                      style={{
                        height: "50px",
                        backgroundColor: "#888",
                        textAlign: "center",
                      }}
                    >
                      데이터가 없습니다.
                    </td>
                  </tr>
                )}
                {/* {schedules &&
                  schedules.data &&
                  schedules.data.English.length > 0 && (
                    <tr>
                      <td
                        scope="row"
                        rowSpan={countOfEng + 1}
                        style={{
                          backgroundColor: "#f5f5f5",
                          fontWeight: "bold",
                        }}
                      >
                        // rowSpan = 해당 언어 학생 수
                        영어
                      </td>
                    </tr>
                  )}
                {schedules &&
                  schedules.data &&
                  schedules.data.English.map((v) => {
                    return (
                      <tr key={`${v.std_for_id}`}>
                        <td>{v.std_for_name}</td>
                        <td id={`${v.std_for_id}_9`}></td>
                        <td id={`${v.std_for_id}_10`}></td>
                        <td id={`${v.std_for_id}_11`}></td>
                        <td id={`${v.std_for_id}_12`}></td>
                        <td id={`${v.std_for_id}_1`}></td>
                        <td id={`${v.std_for_id}_2`}></td>
                        <td id={`${v.std_for_id}_3`}></td>
                        <td id={`${v.std_for_id}_4`}></td>
                        <td id={`${v.std_for_id}_5`}></td>
                      </tr>
                    );
                  })} */}
                {schedules &&
                  schedules.data &&
                  schedules.data.Japanese.length > 0 && (
                    <tr>
                      <td
                        scope="row"
                        rowSpan={countOfJp + 1}
                        style={{
                          backgroundColor: "#f5f5f5",
                          fontWeight: "bold",
                        }}
                      >
                        {/* rowSpan = 해당 언어 학생 수 */}
                        일본어
                      </td>
                    </tr>
                  )}

                {schedules &&
                  schedules.data &&
                  schedules.data.Japanese.map((v) => {
                    return (
                      <tr key={`${v.std_for_id}`}>
                        <td>{v.std_for_name}</td>
                        <td id={`${v.std_for_id}_9`}></td>
                        <td id={`${v.std_for_id}_10`}></td>
                        <td id={`${v.std_for_id}_11`}></td>
                        <td id={`${v.std_for_id}_12`}></td>
                        <td id={`${v.std_for_id}_1`}></td>
                        <td id={`${v.std_for_id}_2`}></td>
                        <td id={`${v.std_for_id}_3`}></td>
                        <td id={`${v.std_for_id}_4`}></td>
                        <td id={`${v.std_for_id}_5`}></td>
                      </tr>
                    );
                  })}
                {/* {schedules &&
                  schedules.data &&
                  schedules.data.Chinese.length > 0 && (
                    <tr>
                      <td
                        scope="row"
                        rowSpan={countOfCh + 1}
                        style={{
                          backgroundColor: "#f5f5f5",
                          fontWeight: "bold",
                        }}
                      >
                        // rowSpan = 해당 언어 학생 수
                        중국어
                      </td>
                    </tr>
                  )}
                {schedules &&
                  schedules.data &&
                  schedules.data.Chinese.map((v) => {
                    return (
                      <tr key={`${v.std_for_id}`}>
                        <td>{v.std_for_name}</td>
                        <td id={`${v.std_for_id}_9`}></td>
                        <td id={`${v.std_for_id}_10`}></td>
                        <td id={`${v.std_for_id}_11`}></td>
                        <td id={`${v.std_for_id}_12`}></td>
                        <td id={`${v.std_for_id}_1`}></td>
                        <td id={`${v.std_for_id}_2`}></td>
                        <td id={`${v.std_for_id}_3`}></td>
                        <td id={`${v.std_for_id}_4`}></td>
                        <td id={`${v.std_for_id}_5`}></td>
                      </tr>
                    );
                  })} */}
              </tbody>
            </table>
          ) : (
            <div>
              <Loader />
            </div>
          )}
        </div>

        <div className="table_btn">
          {moment(selectDate).isAfter(Date.now()) && (
            <div
              onClick={() => {
                if (
                  window.confirm(
                    moment(selectDate).format("YYYY년 MM월 DD일") +
                      "의 스케줄을 삭제하시겠습니까?"
                  )
                ) {
                  deleteAdminScheduleDate({
                    date: moment(selectDate).format("YYYY-MM-DD"),
                  }).then((res) => {
                    reRender();
                  });
                }
              }}
            >
              스케줄 삭제
            </div>
          )}
          <div
            onClick={() => {
              handleOpenForDownload();
              setKindOfData("schedule");
            }}
          >
            스케줄 목록 저장
          </div>
          <div
            onClick={() => {
              handleOpenForDownload();
              setKindOfData("reservation");
            }}
          >
            예약 목록 저장
          </div>
        </div>
      </div>
      <Modal isOpen={downloadIsOpen} handleClose={handleCloseForDownload}>
        <ScheduleDownload kindOfData={kindOfData}></ScheduleDownload>
      </Modal>
      <Modal isOpen={scheduleIsOpen} handleClose={scheduleClose}>
        {selectedSchedule && selectedSchedule.component === "ShowList" ? (
          <ShowList
            sch_for_zoom_pw={
              selectedSchedule && selectedSchedule.sch_for_zoom_pw
            }
            sch_for_zoom_link={
              selectedSchedule && selectedSchedule.sch_for_zoom_link
            }
            sch_id={selectedSchedule && selectedSchedule.sch_id}
            handleClose={scheduleClose}
            std_for_id={selectedSchedule && selectedSchedule.std_for_id}
            std_for_name={selectedSchedule && selectedSchedule.std_for_name}
            sch_start_date={selectedSchedule && selectedSchedule.sch_start_date}
            sch_end_date={selectedSchedule && selectedSchedule.sch_end_date}
            sch_type={selectedSchedule && selectedSchedule.sch_type}
            sch_location={selectedSchedule && selectedSchedule.sch_location}
            reRender={reRender}
          />
        ) : selectedSchedule.component === "InsertResult" ? (
          <InsertResult
            sch_id={selectedSchedule && selectedSchedule.sch_id}
            std_for_name={selectedSchedule && selectedSchedule.std_for_name}
            std_for_id={selectedSchedule && selectedSchedule.std_for_id}
            sch_start_date={selectedSchedule && selectedSchedule.sch_start_date}
            sch_end_date={selectedSchedule && selectedSchedule.sch_end_date}
            handleClose={scheduleClose}
            reRender={reRender}
          />
        ) : selectedSchedule.component === "PermissionScheduleResult" ? (
          <PermissionScheduleResult
            handleClose={scheduleClose}
            date={params.date}
            sch_id={selectedSchedule && selectedSchedule.sch_id}
            reRender={reRender}
          />
        ) : selectedSchedule.component === "ShowResult" ? (
          <ShowResult
            handleClose={scheduleClose}
            date={params.date}
            sch_id={selectedSchedule && selectedSchedule.sch_id}
            reRender={reRender}
          />
        ) : selectedSchedule.component === "ShowListDone" ? (
          <ShowListDone
            sch_id={selectedSchedule && selectedSchedule.sch_id}
            handleClose={scheduleClose}
            std_for_id={selectedSchedule && selectedSchedule.std_for_id}
            std_for_name={selectedSchedule && selectedSchedule.std_for_name}
            sch_start_date={selectedSchedule && selectedSchedule.sch_start_date}
            sch_end_date={selectedSchedule && selectedSchedule.sch_end_date}
            reRender={reRender}
          />
        ) : (
          <DeleteSchedule
            sch_id={selectedSchedule && selectedSchedule.sch_id}
            std_for_name={selectedSchedule && selectedSchedule.std_for_name}
            sch_start_date={selectedSchedule && selectedSchedule.sch_start_date}
            handleClose={scheduleClose}
            reRender={reRender}
          />
        )}
      </Modal>
    </div>
  );
}
