import React, { useEffect, useState } from "react";
import moment from "moment";

import {
  getAdminExportReservation,
  getAdminExportSchedule,
  getAdminExportScheduleOnline,
  getAdminExportScheduleOffline,
} from "../../../api/admin/export";

export default function ScheduleDownload({ kindOfData }) {
  /* const changeDate = (input) => {
    let output = moment(input, "YYYY-MM-DD").format("YYYY-MM-DD");
    if (input.length === 8) {
      input.substr(7, 1) === "-" && (output = "");
    }
    return output === "Invalid date" || input.length !== 8 ? input : output;
  };
  const handleDownload = () => {
    let dateObj = {
      start_date: document.getElementById("start_date").value,
      end_date: document.getElementById("end_date").value,
    };
    switch (kindOfData) {
      case "schedule":
        getAdminExportSchedule(dateObj);
        break;
      case "reservation":
        getAdminExportReservation(dateObj);
        break;
      default:
        break;
    }
  };
  return (
    <div className="popup semester">
      <p className="tit">저장 기간 입력</p>
      <div className="top_select">
        <div className="btn" onClick={handleDownload}>
          저장
        </div>
      </div>
      <div className="date_select">
        <div className="start_date">
          <input
            id="start_date"
            type="text"
            className="date"
            style={{ outline: "none", borderWidth: "1px" }}
            placeholder="YYYYMMDD"
            maxLength="8"
            onChange={(e) => {
              e.target.value = changeDate(e.target.value);
            }}
          />
        </div>
        <span>-</span>
        <div className="start_date">
          <input
            id="end_date"
            type="text"
            className="date"
            style={{ outline: "none", borderWidth: "1px" }}
            placeholder="YYYYMMDD"
            maxLength="10"
            onChange={(e) => {
              e.target.value = changeDate(e.target.value);
            }}
          />
        </div>
      </div>
      <p className="save_exInfo">8자리 숫자로 입력해주세요. ex) 20201020</p>
    </div>
  ); */
  const [scheduleType, setScheduleType] = useState("all"); // "all", "online", "offline"

  const changeDate = (input) => {
    let output = moment(input, "YYYY-MM-DD").format("YYYY-MM-DD");
    if (input.length === 8) {
      input.substr(7, 1) === "-" && (output = "");
    }
    return output === "Invalid date" || input.length !== 8 ? input : output;
  };

  const handleDownload = () => {
    let dateObj = {
      start_date: document.getElementById("start_date").value,
      end_date: document.getElementById("end_date").value,
    };

    switch (kindOfData) {
      case "schedule":
        // 스케줄 타입에 따라 다른 함수 호출
        switch (scheduleType) {
          case "online":
            getAdminExportScheduleOnline(dateObj);
            break;
          case "offline":
            getAdminExportScheduleOffline(dateObj);
            break;
          default:
            getAdminExportSchedule(dateObj);
            break;
        }
        break;
      case "reservation":
        getAdminExportReservation(dateObj);
        break;
      default:
        break;
    }
  };

  return (
    <div className="popup semester">
      <p className="tit">저장 기간 입력</p>

      {/* 스케줄 타입 선택 (스케줄 내보내기인 경우에만 표시) */}
      {kindOfData === "schedule" && (
        <div className="schedule_type_select" style={{ marginBottom: "15px" }}>
          <p
            style={{
              marginBottom: "8px",
              fontSize: "14px",
              fontWeight: "bold",
            }}
          >
            스케줄 유형 선택:
          </p>
          <div style={{ display: "flex", gap: "10px" }}>
            <label
              style={{ display: "flex", alignItems: "center", gap: "5px" }}
            >
              <input
                type="radio"
                name="scheduleType"
                value="all"
                checked={scheduleType === "all"}
                onChange={(e) => setScheduleType(e.target.value)}
              />
              전체 스케줄
            </label>
            <label
              style={{ display: "flex", alignItems: "center", gap: "5px" }}
            >
              <input
                type="radio"
                name="scheduleType"
                value="online"
                checked={scheduleType === "online"}
                onChange={(e) => setScheduleType(e.target.value)}
              />
              온라인 스케줄
            </label>
            <label
              style={{ display: "flex", alignItems: "center", gap: "5px" }}
            >
              <input
                type="radio"
                name="scheduleType"
                value="offline"
                checked={scheduleType === "offline"}
                onChange={(e) => setScheduleType(e.target.value)}
              />
              오프라인 스케줄
            </label>
          </div>
        </div>
      )}

      <div className="top_select">
        <div className="btn" onClick={handleDownload}>
          저장
        </div>
      </div>
      <div className="date_select">
        <div className="start_date">
          <input
            id="start_date"
            type="text"
            className="date"
            style={{ outline: "none", borderWidth: "1px" }}
            placeholder="YYYYMMDD"
            maxLength="8"
            onChange={(e) => {
              e.target.value = changeDate(e.target.value);
            }}
          />
        </div>
        <span>-</span>
        <div className="start_date">
          <input
            id="end_date"
            type="text"
            className="date"
            style={{ outline: "none", borderWidth: "1px" }}
            placeholder="YYYYMMDD"
            maxLength="10"
            onChange={(e) => {
              e.target.value = changeDate(e.target.value);
            }}
          />
        </div>
      </div>
      <p className="save_exInfo">8자리 숫자로 입력해주세요. ex) 20201020</p>
    </div>
  );
}
