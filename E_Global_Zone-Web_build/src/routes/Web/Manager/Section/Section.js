import React, { useEffect, useState, useRef } from "react";
import { useParams, useHistory } from "react-router-dom";
import moment from "moment";
import {
  getAdminForeigner,
  getAdminForeignerWork,
} from "../../../../api/admin/foreigner";
import {
  postAdminSchedule,
  deleteAdminSchedule,
  getAdminHoliday,
} from "../../../../api/admin/schedule";
import {
  getAdminSection,
  getAdminSectionLastday,
} from "../../../../api/admin/section";

import deepmerge from "deepmerge";
import useModal from "../../../../modules/hooks/useModal";
import Modal from "../../../../components/common/modal/Modal";
import Loader from "../../../../components/common/Loader";

export default function Section(props) {
  const params = useParams();
  const history = useHistory();
  const [eceptDate, setEceptDate] = useState([]);
  const [forList, setForList] = useState();
  const [sectName, setSectName] = useState();
  const [isDone, setIsDone] = useState(false);
  const [forName, setForName] = useState();
  const [time, setTime] = useState();
  const [sch_type, setSchType] = useState("online");
  const [sch_location, setSchLocation] = useState("미정");

  const { isOpen, handleOpen, handleClose } = useModal();
  const {
    isOpen: isOpenForLoader,
    handleOpen: handleOpenForLoader,
    handleClose: handleCloseForLoader,
  } = useModal();

  const timeArray = [9, 10, 11, 12, 13, 14, 15, 16, 17];
  const dayArray = ["월", "화", "수", "목", "금"];

  // useRef를 사용하여 클로저 상태를 유지
  const dragState = useRef({
    toggle: false,
    startDay: 0,
    endDay: 0,
    startTime: 0,
    endTime: 0,
    currentSchType: "online",
  });

  const dragStart = (e) => {
    dragState.current.startDay = parseInt(e.target.id.split("-")[0]);
    dragState.current.startTime = parseInt(e.target.id.split("-")[1]);
  };

  const dragEnd = (e) => {
    dragState.current.endDay = parseInt(e.target.id.split("-")[0]);
    dragState.current.endTime = parseInt(e.target.id.split("-")[1]);

    for (
      let i = dragState.current.startDay;
      i <= dragState.current.endDay;
      i++
    ) {
      let lastTime =
        i === dragState.current.endDay ? dragState.current.endTime : 17;
      for (
        let j =
          i === dragState.current.startDay ? dragState.current.startTime : 9;
        j <= lastTime;
        j++
      ) {
        let schedule = document.createElement("div");
        schedule.className = "time_area";
        schedule.style.zIndex = -9999;
        // 현재 저장된 sch_type에 따른 색상 설정
        schedule.style.backgroundColor =
          dragState.current.currentSchType === "online" ? "#007bff" : "#9370db";
        schedule.style.opacity = "0.7";
        let parent = document.getElementById(`${i}-${j}`);
        parent.childNodes.length !== 0
          ? parent.removeChild(parent.childNodes[0])
          : parent.appendChild(schedule);
      }
    }
  };

  const buildTable = () => {
    let tbody = document.getElementById("tbody");
    tbody.innerHTML = "";
    // buildTable 호출 시 현재 선택된 sch_type으로 dragState 업데이트
    dragState.current.currentSchType = sch_type;
    dayArray.forEach((day, index) => {
      let tr = document.createElement("tr");
      let td = document.createElement("td");
      td.innerText = day;
      tr.appendChild(td);
      timeArray.forEach((time) => {
        let td = document.createElement("td");
        td.addEventListener("mousedown", dragStart);
        td.addEventListener("mouseup", dragEnd);
        td.id = `${index}-${time}`;
        tr.appendChild(td);
      });
      tbody.appendChild(tr);
    });
  };

  function handleOnClick() {
    if (!window.confirm("저장하시겠습니까?")) return;

    // 온라인과 오프라인 스케줄을 분리해서 수집
    let onlineSchedule = { 월: [], 화: [], 수: [], 목: [], 금: [] };
    let offlineSchedule = { 월: [], 화: [], 수: [], 목: [], 금: [] };

    Object.keys(onlineSchedule).forEach((v, i) => {
      for (let j = 9; j <= 17; j++) {
        let day = document.getElementById(`${i}-${j}`);
        if (day.hasChildNodes()) {
          // time_area의 배경색으로 온라인/오프라인 구분
          let timeArea = day.querySelector(".time_area");
          if (timeArea) {
            let bgColor = timeArea.style.backgroundColor;
            if (bgColor === "rgb(0, 123, 255)" || bgColor === "#007bff") {
              // 온라인 (파란색)
              onlineSchedule[v].push(j);
            } else if (
              bgColor === "rgb(147, 112, 219)" ||
              bgColor === "#9370db"
            ) {
              // 오프라인 (연보라색)
              offlineSchedule[v].push(j);
            }
          }
        }
      }
    });

    // 온라인과 오프라인 스케줄이 각각 있는지 확인
    let hasOnlineSchedule = Object.values(onlineSchedule).some(
      (day) => day.length > 0
    );
    let hasOfflineSchedule = Object.values(offlineSchedule).some(
      (day) => day.length > 0
    );

    // 온라인 스케줄이 있으면 먼저 저장
    if (hasOnlineSchedule) {
      let onlineData = {
        sect_id: params["sect_id"],
        std_for_id: params["std_for_id"],
        schedule: onlineSchedule,
        ecept_date: eceptDate,
        sch_start_date: time.sch_start_date,
        sch_end_date: time.sch_end_date,
        exception_mode: 0,
        sch_type: "online",
      };

      postAdminSchedule(onlineData)
        .then((res) => {
          console.log("온라인 스케줄 저장 완료");
          console.log("온라인 스케줄 데이터:", onlineData);

          // 오프라인 스케줄이 있으면 그 다음에 저장
          if (hasOfflineSchedule) {
            let offlineData = {
              sect_id: params["sect_id"],
              std_for_id: params["std_for_id"],
              schedule: offlineSchedule,
              ecept_date: eceptDate,
              sch_start_date: time.sch_start_date,
              sch_end_date: time.sch_end_date,
              exception_mode: 0,
              sch_type: "offline",
              sch_location: sch_location || "",
            };

            postAdminSchedule(offlineData)
              .then((res) => {
                console.log("오프라인 스케줄 저장 완료");
                console.log("오프라인 스케줄 데이터:", offlineData);
                // 모든 저장이 완료된 후 리스트 업데이트 및 alert 표시
                getAdminForeignerWork(params["sect_id"]).then((res) => {
                  setForList(res.data);
                  redirectToFirst(res.data.data);
                  handleOpen(); // 마지막에 한 번만 호출
                });
              })
              .catch((error) => {
                console.error("오프라인 스케줄 저장 실패:", error);
                alert("오프라인 스케줄 저장에 실패했습니다.");
              });
          } else {
            // 온라인만 있는 경우
            getAdminForeignerWork(params["sect_id"]).then((res) => {
              setForList(res.data);
              redirectToFirst(res.data.data);
              handleOpen(); // 온라인만 저장된 경우에도 호출
            });
          }
        })
        .catch((error) => {
          console.error("온라인 스케줄 저장 실패:", error);
          alert("온라인 스케줄 저장에 실패했습니다.");
        });
    } else if (hasOfflineSchedule) {
      // 오프라인만 있는 경우
      let offlineData = {
        sect_id: params["sect_id"],
        std_for_id: params["std_for_id"],
        schedule: offlineSchedule,
        ecept_date: eceptDate,
        sch_start_date: time.sch_start_date,
        sch_end_date: time.sch_end_date,
        exception_mode: 0,
        sch_type: "offline",
        sch_location: sch_location || "",
      };

      postAdminSchedule(offlineData)
        .then((res) => {
          console.log("오프라인 스케줄 저장 완료");
          console.log("오프라인 스케줄 데이터:", offlineData);
          getAdminForeignerWork(params["sect_id"]).then((res) => {
            setForList(res.data);
            redirectToFirst(res.data.data);
            handleOpen(); // 오프라인만 저장된 경우에도 호출
          });
        })
        .catch((error) => {
          console.error("오프라인 스케줄 저장 실패:", error);
          alert("오프라인 스케줄 저장에 실패했습니다.");
        });
    } else {
      // 스케줄이 없는 경우
      alert("저장할 스케줄이 없습니다.");
      return;
    }
  }
  const redirectToFirst = (data) => {
    let first = true;
    data.forEach((v) => {
      if (!v.is_schedules_inputed && first) {
        first = false;
        history.push(`/section/${params["sect_id"]}/${v.std_for_id}`);
      }
    });
    first &&
      history.push(`/section/${params["sect_id"]}/${data[0].std_for_id}`);
    window.location.reload();
  };

  const setHoliday = (date) => {
    getAdminHoliday({ year: moment(date).format("YYYY") })
      .then((res) => {
        console.log(res.data.data);
        for (const key in res.data.data) {
          if (res.data.data.hasOwnProperty(key)) {
            const element = res.data.data[key];
            eceptDate.push(moment(element, "YYYYMMDD").format("YYYY-MM-DD"));
          }
        }
      })
      .catch((error) => {
        console.warn("공휴일 정보를 가져오는데 실패했습니다:", error);
        // 공휴일 정보가 없어도 계속 진행
      });
  };

  const rendering = (std_for_id = params["std_for_id"]) => {
    handleOpenForLoader();
    if (std_for_id !== params["std_for_id"]) {
      history.push(`/section/${params["sect_id"]}/${std_for_id}`);
    }
    !forList &&
      getAdminForeignerWork(params["sect_id"]).then((res) => {
        setForList(res.data);
        setTime(res.data.time);
        if (params["std_for_id"] === "0") {
          redirectToFirst(res.data.data);
        }
      });
    !sectName &&
      getAdminSection({ sect_id: params["sect_id"] }).then((res) => {
        const { sect_start_date, sect_end_date } = res.data.data;
        setHoliday(sect_start_date);
        setHoliday(sect_end_date);
        setSectName(res.data);
      });
    if (std_for_id !== "0") {
      getAdminForeigner({
        foreigners: [std_for_id],
      }).then((res) => {
        setForName(res.data.data[0].std_for_name);
        handleCloseForLoader();
      });
      buildTable();
    } else {
      // window.location.reload();
    }
  };
  useEffect(() => {
    rendering();
  }, []);
  useEffect(() => {
    document
      .getElementsByName("stdList")
      .forEach(
        (v) =>
          v.classList.contains("selected") && v.classList.remove("selected")
      );

    forName &&
      document.getElementById(forName) &&
      document.getElementById(forName).classList.add("selected");
  }, [forName]);
  useEffect(() => {
    if (forList && forList.data) {
      setForList(forList.data);
    }
  }, [forList]);

  return (
    <div className="content">
      <div className="sub_title">
        <p className="tit">
          {sectName && sectName.data && sectName.data.sect_name} 근무 시간표
          편성
        </p>
      </div>

      <div className="search_student">
        <div className="left_wrap">
          <div className="tsearch" style={{ visibility: "hidden" }}>
            <input type="text" disabled />
            <input type="submit" value="검색" />
            {/* <input
							type="submit"
							value="공휴일 및 학교행사 등록"
							style={{ cursor: "pointer" }}
						/> */}
          </div>
          <div className="not_enter">
            <p className="tit">
              <span>미입력 리스트</span>
            </p>
            <div className="scroll_area">
              <table>
                <thead>
                  <tr>
                    <th scope="col">학번</th>
                    <th scope="col">이름</th>
                    {/* <th scope="col">근무시간</th> */}
                  </tr>
                </thead>
                <tbody>
                  {forList &&
                    forList.length > 0 &&
                    forList.map((v) => {
                      if (!v.is_schedules_inputed) {
                        return (
                          <tr
                            name="stdList"
                            onClick={() => {
                              rendering(v.std_for_id);
                            }}
                            id={v.std_for_name}
                          >
                            <td>{v.std_for_id}</td>
                            <td className="name">{v.std_for_name}</td>
                            {/* <td></td> */}
                          </tr>
                        );
                      }
                    })}
                </tbody>
              </table>
            </div>
          </div>

          <div className="enter">
            <p className="tit">
              <span>입력 완료 리스트</span>
            </p>
            <div className="scroll_area">
              <table>
                <thead>
                  <tr>
                    <th scope="col">학번</th>
                    <th scope="col">이름</th>
                    <th scope="col">삭제</th>
                  </tr>
                </thead>
                <tbody>
                  {forList &&
                    forList.length > 0 &&
                    forList.map((v, index) => {
                      if (v.is_schedules_inputed) {
                        return (
                          <tr id={v.std_for_name}>
                            <td>{v.std_for_id}</td>
                            <td>{v.std_for_name}</td>
                            <td>
                              <button
                                onClick={() => {
                                  handleOpen();
                                  deleteAdminSchedule({
                                    sect_id: params["sect_id"],
                                    std_for_id: v.std_for_id,
                                  }).then((res) => {
                                    getAdminForeignerWork(
                                      params["sect_id"]
                                    ).then((res) => {
                                      setForList(res.data);
                                      redirectToFirst(res.data.data);
                                    });
                                  });
                                }}
                              >
                                삭제
                              </button>
                            </td>
                          </tr>
                        );
                      }
                    })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="right_wrap">
          <p className="tit">[{forName}] 스케줄 등록</p>

          <div
            className="section_btn"
            style={{ display: "flex", alignItems: "center", gap: "15px" }}
          >
            {/* 오프라인일 경우 장소 입력 */}
            {sch_type === "offline" && (
              <div
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                <span style={{ fontSize: "14px", fontWeight: "bold" }}>
                  장소:
                </span>
                <input
                  type="text"
                  placeholder="장소를 입력하세요"
                  value={sch_location}
                  onChange={(e) => setSchLocation(e.target.value)}
                  style={{
                    width: "100px",
                    padding: "6px 8px",
                    border: "1px solid #ddd",
                    borderRadius: "4px",
                    fontSize: "14px",
                  }}
                />
              </div>
            )}

            {/* 온라인/오프라인 선택 */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <button
                type="button"
                style={{
                  background: sch_type === "online" ? "#007bff" : "#fff",
                  color: sch_type === "online" ? "#fff" : "#333",
                  border: "1px solid #ddd",
                  padding: "8px 16px",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontSize: "14px",
                }}
                onClick={() => {
                  setSchType("online");
                  dragState.current.currentSchType = "online";
                }}
              >
                온라인
              </button>
              <button
                type="button"
                style={{
                  background: sch_type === "offline" ? "#9370db" : "#fff",
                  color: sch_type === "offline" ? "#fff" : "#333",
                  border: "1px solid #ddd",
                  padding: "8px 16px",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontSize: "14px",
                }}
                onClick={() => {
                  setSchType("offline");
                  dragState.current.currentSchType = "offline";
                }}
              >
                오프라인
              </button>
            </div>

            <div className="reset btn" onClick={buildTable}>
              초기화
            </div>
            <div className="save btn" onClick={handleOnClick}>
              저장
            </div>
          </div>
          <table className="work_time">
            <colgroup>
              <col width="9%" span="10" />
            </colgroup>
            <thead>
              <tr>
                <th rowspan="2" scope="col"></th>
                <th colspan="3" scope="col">
                  AM
                </th>
                <th colspan="7" scope="col">
                  PM
                </th>
              </tr>
              <tr>
                <th scope="col">9</th>
                <th scope="col">10</th>
                <th scope="col">11</th>
                <th scope="col">12</th>
                <th scope="col">1</th>
                <th scope="col">2</th>
                <th scope="col">3</th>
                <th scope="col">4</th>
                <th scope="col">5</th>
              </tr>
            </thead>
            <tbody id="tbody"></tbody>
          </table>
        </div>
      </div>
      <Modal isOpen={isOpenForLoader}>
        <Loader />
      </Modal>
      <Modal isOpen={isOpen}>
        <Loader />
      </Modal>
    </div>
  );
}
