import React, { useEffect, useState } from "react";
import {
  deleteAdminScheduleAdd,
  deleteAdminScheduleSome,
  postAdminScheduleAdd,
  patchAdminScheduleLocation,
} from "../../../api/admin/schedule";
import {
  getForeignerReservation,
  patchForeignerReservationPermission,
} from "../../../api/foreigner/reservation";
import {
  getAdminReservation,
  patchAdminReservationPermission,
} from "../../../api/admin/foreigner";
import { useSelector } from "react-redux";
import { selectUser } from "../../../redux/userSlice/userSlice";
import { Link, useHistory } from "react-router-dom";
import conf from "../../../conf/conf";
import Modal from "./Modal";
import useModal from "../../../modules/hooks/useModal";
import AddScheduleStudent from "./AddScheduleStudent";
import DeleteModal from "./DeleteModal";
import { LANGUAGE } from "../../../conf/language";
import { updateScheduleZoomLink } from "../../../api/axios";

/**
 * Modal - 신청 학생 명단보기
 * @param handleClose
 * @returns {JSX.Element}
 * @constructor
 */
export default function ShowList({
  handleClose,
  sch_id,
  std_for_id,
  std_for_name,
  sch_start_date,
  sch_end_date,
  sch_for_zoom_pw,
  sch_for_zoom_link,
  sch_type,
  sch_location,
  reRender: thisReRender = () => {},
}) {
  const [updateMode, setUpdateMode] = useState(false);
  const [zoomLink, setZoomLink] = useState(sch_for_zoom_link);
  const [locationEditMode, setLocationEditMode] = useState(false);
  const [location, setLocation] = useState(sch_location);
  const [data, setData] = useState();
  const [selectedResId, setSelectedResId] = useState();
  const [studentList, setStudentList] = useState();
  const [permission, setPermission] = useState([]);
  const [pending, setPending] = useState(false);
  const user = useSelector(selectUser);
  const history = useHistory();
  const { isOpen, handleOpen, handleClose: thisHandleClose } = useModal();
  const {
    isOpen: isOpenForDelete,
    handleOpen: handleOpenForDelete,
    handleClose: handleCloseForDelete,
  } = useModal();

  useEffect(() => {
    console.log("ShowList props:", { sch_type, sch_location, sch_for_zoom_pw });
    console.log("sch_location raw:", sch_location);
    console.log("sch_location type:", typeof sch_location);
    window.easydropdown.all();
    user.userClass === conf.userClass.MANAGER
      ? getAdminReservation(sch_id).then((res) => setData(res.data))
      : getForeignerReservation(sch_id).then((res) => setData(res.data));
    return thisReRender;
  }, []);

  useEffect(() => {
    if (data && data.data) {
      let array = [];
      data.data.forEach((v) => {
        array.push(v.std_kor_id);
      });
      setStudentList(array);
      console.log(data);
    }
    window.easydropdown.all();
  }, [data]);

  useEffect(() => {
    pending && handleClose();
  }, [pending]);

  const handleDelete = () => {
    deleteAdminScheduleAdd(selectedResId).then((res) => {
      handleCloseForDelete();
      alert(res.data.message);
    });
  };
  const handlePermissionAll = () => {
    if (data && data.data) {
      data.data.forEach((v) => {
        document.getElementById(v.std_kor_id).value = true;
      });
    }
  };

  const handleLocationEdit = () => {
    setLocationEditMode(true);
  };

  const handleLocationSave = () => {
    if (location.trim() === "") {
      alert("장소를 입력해주세요.");
      return;
    }

    patchAdminScheduleLocation(sch_id, location)
      .then(() => {
        setLocationEditMode(false);
        // 부모 컴포넌트에 변경 알림
        thisReRender();
      })
      .catch((error) => {
        console.error("장소 업데이트 실패:", error);
        alert("장소 업데이트에 실패했습니다.");
      });
  };

  const handleLocationCancel = () => {
    setLocation(sch_location); // 원래 값으로 복원
    setLocationEditMode(false);
  };

  const saveZoomLink = () => {
    updateScheduleZoomLink(sch_id, { sch_for_zoom_link: zoomLink })
      .then((res) => {
        alert(res.data.message);
        handleClose();
      })
      .catch((error) => {
        alert("줌 접속 정보 등록에 실패하였습니다.");
      });
  };

  const reRender = () => {
    user.userClass === conf.userClass.MANAGER
      ? getAdminReservation(sch_id).then((res) => setData(res.data))
      : getForeignerReservation(sch_id, std_for_id, setData);
  };

  return (
    <div className="popup enrol">
      <div className="top_tit">
        <div className="left">
          <p className="tit">
            {
              LANGUAGE[window.localStorage.getItem("global-zone-lang")]
                .viewStudentApplicationRegistry
            }
          </p>
          <p className="txt">
            <span>
              {
                LANGUAGE[window.localStorage.getItem("global-zone-lang")]
                  .startTime
              }
            </span>{" "}
            {sch_start_date}
          </p>
          <p className="txt">
            <span>
              {
                LANGUAGE[window.localStorage.getItem("global-zone-lang")]
                  .endTime
              }
            </span>{" "}
            {sch_end_date}
          </p>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
          }}
        >
          <p className="name">
            {user.userClass === conf.userClass.MANAGER
              ? std_for_name
              : user.name}{" "}
            /{" "}
            {sch_type === "offline" ? (
              <span style={{ display: "inline-flex", alignItems: "center" }}>
                <span style={{ whiteSpace: "nowrap" }}>장소 :</span>
                <span
                  style={{
                    position: "relative",
                    display: "inline-flex",
                    alignItems: "center",
                    marginLeft: "4px",
                    minWidth: "40px",
                    maxWidth: "60px",
                  }}
                >
                  {locationEditMode ? (
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      style={{
                        border: "1px solid #ddd",
                        borderRadius: "4px",
                        padding: "1px 6px",
                        fontSize: "12px",
                        width: "100%",
                        outline: "none",
                        flexShrink: 0,
                      }}
                      onKeyPress={(e) => {
                        if (e.key === "Enter") handleLocationSave();
                      }}
                    />
                  ) : (
                    <span
                      style={{
                        minWidth: "60px",
                        display: "inline-block",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {location}
                    </span>
                  )}
                </span>
              </span>
            ) : (
              `PW : ${sch_for_zoom_pw}`
            )}
          </p>
          {sch_type === "offline" &&
            user.userClass === conf.userClass.MANAGER && (
              <div style={{ marginTop: "4px" }}>
                {locationEditMode ? (
                  <div
                    style={{
                      display: "flex",
                      gap: "4px",
                      justifyContent: "flex-end",
                    }}
                  >
                    <button
                      onClick={handleLocationSave}
                      style={{
                        background: "#007bff",
                        color: "white",
                        border: "none",
                        borderRadius: "3px",
                        padding: "4px 8px",
                        fontSize: "11px",
                        cursor: "pointer",
                        height: "24px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                      title="저장"
                    >
                      저장
                    </button>
                    <button
                      onClick={handleLocationCancel}
                      style={{
                        background: "#6c757d",
                        color: "white",
                        border: "none",
                        borderRadius: "3px",
                        padding: "4px 8px",
                        fontSize: "11px",
                        cursor: "pointer",
                        height: "24px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                      title="취소"
                    >
                      취소
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={handleLocationEdit}
                    style={{
                      background: "transparent",
                      border: "none",
                      color: "#007bff",
                      cursor: "pointer",
                      fontSize: "12px",
                      padding: "2px 6px",
                      borderRadius: "3px",
                      transition: "background-color 0.2s",
                      flexShrink: 0,
                    }}
                    onMouseOver={(e) =>
                      (e.target.style.backgroundColor = "#f8f9fa")
                    }
                    onMouseOut={(e) =>
                      (e.target.style.backgroundColor = "transparent")
                    }
                    title="편집"
                  >
                    변경
                  </button>
                )}
              </div>
            )}
        </div>
      </div>

      <div className="link_container">
        <div className="link_top_tit">
          <p className="tit">접속정보</p>
          {updateMode ? (
            <label
              htmlFor="link_input"
              className="link_bbtn save"
              onClick={saveZoomLink}
            >
              저장
            </label>
          ) : (
            <label
              htmlFor="link_input"
              className="link_bbtn"
              onClick={() => setUpdateMode(true)}
            >
              편집
            </label>
          )}
        </div>
        <input
          id="link_input"
          className="link_input"
          onChange={(e) => setZoomLink(e.target.value)}
          value={zoomLink}
          disabled={!updateMode}
        />
      </div>

      <div className="area">
        <ul>
          {data && data.data ? (
            <>
              {data.data.map((v, index) => {
                if (v === null || v === "null" || typeof v !== "object") {
                  return (
                    <li key={index + "null"}>
                      <div className="student">
                        <p className="name">삭제된 학생</p>
                        <select name={"catgo"} className={"dropdown"} disabled>
                          <option>---</option>
                        </select>
                      </div>
                    </li>
                  );
                }
                let permission = v.res_state_of_permission;
                return (
                  <li key={v.std_kor_id + "index"}>
                    <div className="student">
                      {user.userClass === conf.userClass.MANAGER && (
                        <div
                          class="del_btn"
                          onClick={() => {
                            handleOpenForDelete();
                            setSelectedResId(v.res_id);
                          }}
                        >
                          <img
                            src="/global/img/enrol_del_btn.gif"
                            alt="신청 학생 삭제"
                          />
                        </div>
                      )}
                      <p className="name">{v.std_kor_name}</p>
                      <select
                        name={"catgo"}
                        className={"dropdown"}
                        id={v.std_kor_id}
                        key={`${v.std_kor_id}`}
                      >
                        <option value={true} selected={permission}>
                          {
                            LANGUAGE[
                              window.localStorage.getItem("global-zone-lang")
                            ].agree
                          }
                        </option>

                        <option
                          value={false}
                          selected={!permission}
                          disabled={user.userClass !== conf.userClass.MANAGER}
                        >
                          {
                            LANGUAGE[
                              window.localStorage.getItem("global-zone-lang")
                            ].disagree
                          }
                        </option>
                      </select>
                    </div>
                  </li>
                );
              })}
              {user.userClass === conf.userClass.MANAGER && (
                <li>
                  {user.userClass === conf.userClass.MANAGER && (
                    <div onClick={handleOpen} class="add_student">
                      {
                        LANGUAGE[
                          window.localStorage.getItem("global-zone-lang")
                        ].addAStudent
                      }
                      <img
                        src="/global/img/add_student_ico.gif"
                        alt="학생 추가 아이콘"
                      />
                    </div>
                  )}
                </li>
              )}
            </>
          ) : (
            <>
              {user.userClass === conf.userClass.MANAGER && (
                <li>
                  <div onClick={handleOpen} class="add_student">
                    {
                      LANGUAGE[window.localStorage.getItem("global-zone-lang")]
                        .addAStudent
                    }
                    <img
                      src="/global/img/add_student_ico.gif"
                      alt="학생 추가 아이콘"
                    />
                  </div>
                </li>
              )}
            </>
          )}
        </ul>
      </div>

      <div className="btn_area">
        <div className="bbtn white left" onClick={handlePermissionAll}>
          {LANGUAGE[window.localStorage.getItem("global-zone-lang")].agreeToAll}
        </div>
        <div className="right">
          <div
            className="bbtn mint"
            onClick={() => {
              let permission_std_kor_id_list = [];
              let not_permission_std_kor_id_list = [];
              data.data.map((v) => {
                if (
                  document.getElementById(`${v.std_kor_id}`).value === "true"
                ) {
                  permission_std_kor_id_list.push(v.std_kor_id);
                } else {
                  not_permission_std_kor_id_list.push(v.std_kor_id);
                }
              });
              user.userClass === conf.userClass.MANAGER
                ? patchAdminReservationPermission(sch_id, {
                    permission_std_kor_id_list,
                    not_permission_std_kor_id_list,
                  }).then((res) => {
                    setPending(true);
                    alert(res.data.message);
                  })
                : patchForeignerReservationPermission(sch_id, {
                    permission_std_kor_id_list,
                    not_permission_std_kor_id_list,
                  }).then((res) => {
                    setPending(true);
                    alert(res.data.message);
                  });
            }}
          >
            {LANGUAGE[window.localStorage.getItem("global-zone-lang")].save}
          </div>
          {/* <div className="bbtn darkGray" onClick={handleClose}>
						닫기
					</div> */}
        </div>
      </div>
      <Modal isOpen={isOpen} handleClose={thisHandleClose}>
        <AddScheduleStudent
          handleClose={thisHandleClose}
          sch_id={sch_id}
          std_for_id={
            user.userClass === conf.userClass.MANAGER ? std_for_id : user.id
          }
          _setData={setData}
        />
      </Modal>
      <Modal isOpen={isOpenForDelete} handleClose={handleCloseForDelete}>
        <DeleteModal
          onSubmit={handleDelete}
          onCancel={handleCloseForDelete}
          handleReRender={reRender}
        />
      </Modal>
    </div>
  );
}
