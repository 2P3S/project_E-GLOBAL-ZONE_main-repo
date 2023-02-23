import React, { useEffect, useState } from "react";
import moment from "moment";

import Loader from "../../../../components/common/Loader";

import { useDispatch, useSelector } from "react-redux";
import {
  selectSelectDate,
  selectToday,
} from "../../../../redux/confSlice/confSlice";

import { selectUser } from "../../../../redux/userSlice/userSlice";
import {
  deleteKoreanReservation,
  getKoreanReservation,
} from "../../../../api/korean/reservation";
import { getKoreanSetting } from "../../../../api/korean";

/**
 * Korean :: 예약 조회
 * @returns {JSX.Element}
 * @constructor
 */
export default function Reservation() {
  const dispatch = useDispatch();
  const selectDate = useSelector(selectSelectDate);
  const user = useSelector(selectUser);
  const today = Date.now();

  const [data, setData] = useState();
  const [pending, setPending] = useState(false);
  const [setting, setSetting] = useState();
  const [dataSet, setDataSet] = useState({
    arrayOfWatingForPermission: [],
    arrayOfPermission: [],
    arrayOfWatingForResult: [],
  });

  useEffect(() => {
    setPending(true);
    getKoreanSetting().then((res) => setSetting(res.data.data));
  }, []);

  useEffect(() => console.log(setting));
  useEffect(() => {
    pending &&
      getKoreanReservation().then((res) => {
        setData(res.data);
      });
  }, [pending]);

  useEffect(() => {
    if (data && setting) {
      setPending(false);
    }
  }, [data, setting]);

  useEffect(() => {
    let arrayOfWatingForResult = [];
    let arrayOfWatingForPermission = [];
    let arrayOfPermission = [];
    if (data && data.data) {
      data.data.forEach((v) => {
        console.log(v);
        if (moment(today).isAfter(moment(v.sch_end_date))) {
          // 현재시간 이전의 스케줄
          if (v.res_state_of_permission) arrayOfWatingForResult.push(v);
        } else {
          // 현재시간 이후의 스케줄
          if (v.res_state_of_permission) {
            arrayOfPermission.push(v);
          } else {
            arrayOfWatingForPermission.push(v);
          }
        }
      });
      setDataSet({
        arrayOfWatingForPermission,
        arrayOfPermission,
        arrayOfWatingForResult,
      });
    }
  }, [data]);

  return (
    <>
      {pending ? (
        <Loader />
      ) : (
        <div className="wrap bg">
          <div className="reserv_status">
            <p className="tit">실시간 예약 현황</p>
            <ul>
              <li className="yellow">
                <span>
                  {dataSet && dataSet.arrayOfWatingForPermission.length}
                </span>
                예약 대기
              </li>
              <li>
                <span>{dataSet && dataSet.arrayOfPermission.length}</span>
                예약 완료
              </li>
              <li>
                <span>{dataSet && dataSet.arrayOfWatingForResult.length}</span>
                결과 대기
              </li>
            </ul>
          </div>
          <div className="reserv_list">
            <p className="tit">예약 관리</p>
            <ui className="mainMenu">
              <li className="item status01" id="wait_reservation">
                <a href="#wait_reservation" className="btn">
                  <span>예약 대기</span>
                </a>
                <div className="subMenu">
                  {dataSet &&
                    setting &&
                    dataSet.arrayOfWatingForPermission.map((v) => (
                      <div>
                        <p className="left">
                          [{v.std_for_lang}] {v.std_for_name}
                          <span>
                            {moment(v.sch_start_date).format(
                              "MM월 DD일 hh:mm "
                            )}
                            ~ {moment(v.sch_end_date).format("hh:mm")}
                          </span>
                        </p>
                        {moment(v.sch_start_date)
                          .subtract(setting.res_end_period, "day")
                          .isAfter(moment(Date.now()).format("YYYY-MM-DD")) ? (
                          <div className="reserv_del_btn">
                            <img
                              onClick={() => {
                                if (window)
                                  deleteKoreanReservation(v.res_id).then(
                                    (res) => {
                                      alert(res.data.message);
                                      window.location.reload();
                                    }
                                  );
                              }}
                              src="/global/img/reservation_del.gif"
                              alt="예약 삭제 버튼"
                            />
                          </div>
                        ) : (
                          <div></div>
                        )}
                        <p className="right">예약 대기</p>
                      </div>
                    ))}
                </div>
              </li>
              <li className="item status02" id="reservation_complete">
                <a href="#reservation_complete" className="btn">
                  <span>예약 완료</span>
                </a>
                <div className="subMenu">
                  {dataSet &&
                    dataSet.arrayOfPermission.map((v) => (
                      <div>
                        <p className="left">
                          [{v.std_for_lang}] {v.std_for_name}
                          <span>
                            {moment(v.sch_start_date).format(
                              "MM월 DD일 hh:mm "
                            )}
                            ~ {moment(v.sch_end_date).format("hh:mm")}
                          </span>
                        </p>

                        {moment(v.sch_start_date)
                          .subtract(setting.res_end_period, "day")
                          .isAfter(moment(Date.now()).format("YYYY-MM-DD")) ? (
                          <div className="reserv_del_btn">
                            <img
                              onClick={() => {
                                if (window)
                                  deleteKoreanReservation(v.res_id).then(
                                    (res) => {
                                      alert(res.data.message);
                                      window.location.reload();
                                    }
                                  );
                              }}
                              src="/global/img/reservation_del.gif"
                              alt="예약 삭제 버튼"
                            />
                          </div>
                        ) : (
                          <div></div>
                        )}
                        <p
                          className="right zoom_info"
                          onClick={() => {
                            v.sch_for_zoom_link.trim() !== ""
                              ? prompt(
                                  `Zoom ID : ${v.std_for_zoom_id
                                    .toString()
                                    .substr(0, 3)} ${v.std_for_zoom_id
                                    .toString()
                                    .substr(3, 3)} ${v.std_for_zoom_id
                                    .toString()
                                    .substr(6, 4)}\nZoom PW : ${
                                    v.sch_for_zoom_pw
                                  }\n\n링크를 복사하여 사용하세요!`,
                                  v.sch_for_zoom_link
                                )
                              : alert(
                                  `Zoom ID : ${v.std_for_zoom_id
                                    .toString()
                                    .substr(0, 3)} ${v.std_for_zoom_id
                                    .toString()
                                    .substr(3, 3)} ${v.std_for_zoom_id
                                    .toString()
                                    .substr(6, 4)}\nZoom PW : ${
                                    v.sch_for_zoom_pw
                                  }`
                                );
                          }}
                        >
                          접속 정보
                        </p>
                      </div>
                    ))}
                </div>
              </li>
              <li className="item status03" id="progress_complete">
                <a href="#progress_complete" className="btn">
                  <span>결과 대기</span>
                </a>
                <div className="subMenu">
                  {dataSet &&
                    dataSet.arrayOfWatingForResult.map((v) => (
                      <div>
                        <p className="left">
                          [{v.std_for_lang}] {v.std_for_name}
                          <span>
                            {moment(v.sch_start_date).format(
                              "MM월 DD일 hh:mm "
                            )}
                            ~ {moment(v.sch_end_date).format("hh:mm")}
                          </span>
                        </p>
                        <p className="right">결과 대기</p>
                      </div>
                    ))}
                </div>
              </li>
            </ui>
          </div>
        </div>
      )}
    </>
  );
}
