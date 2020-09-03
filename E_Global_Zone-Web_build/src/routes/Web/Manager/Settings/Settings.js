import React, {useEffect, useState} from "react";
import {getAdminSetting, postAdminSetting} from "../../../../api/admin/setting";
import useModal from "../../../../modules/hooks/useModal";
import Modal from "../../../../components/common/modal/Modal";
import moment from "moment";
import CreateSection from "../../../../components/common/modal/CreateSection";
import GetSections from "../../../../components/common/modal/GetSections";

import InsertForeignerStudent from "../../../../components/common/modal/InsertForeignerStudent";

/**
 * Manager :: 시스템 환경설정
 * @returns {JSX.Element}
 * @constructor
 * @todo 추가바람
 */
export default function Settings() {
    const [settings, setSettings] = useState();
    const [postSettings, setPostSettings] = useState();
    const {
        isOpen: creatSectIsOpen,
        handleClose: handleCloseForCreatSectIsOpen,
        handleOpen: handleOpenForCreatSectIsOpen,
    } = useModal();
    const {
        isOpen: getSectIsOpen,
        handleClose: handleCloseForGetSectIsOpen,
        handleOpen: handleOpenForGetSectIsOpen,
    } = useModal();
    const {
        isOpen: isOpenForInsertForeignerStudent,
        handleOpen: handleOpenForInsertForeignerStudent,
        handleClose: handleCloseForInsertForeignerStudent,
    } = useModal();

    const handleChange = (key, value) => {
        setPostSettings({...postSettings, [key]: parseInt(value)});
    };

    const reRender = () => {
        getAdminSetting().then((res) => setSettings(res.data));
    };

    useEffect(() => {
        getAdminSetting().then((res) => setSettings(res.data));
    }, []);
    useEffect(() => {
        if (settings) {
            setPostSettings(settings.result);
        }
    }, [settings]);
    useEffect(() => {
        if (postSettings && postSettings.once_meet_time + postSettings.once_rest_time > 30) {
            document.getElementById("time_input1").value = 0;
            document.getElementById("time_input2").value = 0;
            setPostSettings({...postSettings, once_meet_time: 0, once_rest_time: 0})
        }
    }, [postSettings]);
    useEffect(() => {
        window.easydropdown.all();
    });

    let array = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    return settings && postSettings ? (
        <div className="content">
            <div className="sub_title">
                <p className="tit">시스템 환경설정</p>
            </div>

            <div className="set_wrap">
                <div className="setting">
                    <div className="set_box">
                        <p className="tit ico01">예약관리 설정</p>
                        <div className="input">
                            <div className="select_tit">
                                한국인 학생 <span className="bold">하루 예약</span>
                            </div>
                            <div className="select_input">
                                <select
                                    name="catgo1"
                                    className="dropdown"
                                    onChange={(e) => {
                                        handleChange(`max_res_per_day`, e.target.value);
                                    }}
                                >
                                    {array.map((v) => {
                                        return (
                                            <option
                                                id={`day-${v}`}
                                                selected={
                                                    settings &&
                                                    settings.result.max_res_per_day === v
                                                        ? true
                                                        : false
                                                }
                                            >
                                                {v}
                                            </option>
                                        );
                                    })}
                                </select>
                                <span>번</span>
                            </div>
                        </div>
                        <div className="input">
                            <div className="select_tit">
                                한 타임 <span className="bold">최대 예약</span>
                            </div>
                            <div className="select_input">
                                <select
                                    name="catgo1"
                                    className="dropdown"
                                    onChange={(e) => {
                                        handleChange(`max_std_once`, e.target.value);
                                    }}
                                >
                                    {array.map((v) => {
                                        return (
                                            <option
                                                id={`day-${v}`}
                                                selected={
                                                    settings && settings.result.max_std_once === v
                                                        ? true
                                                        : false
                                                }
                                            >
                                                {v}
                                            </option>
                                        );
                                    })}
                                </select>
                                <span>명</span>
                            </div>
                        </div>
                        <div className="input">
                            <div className="select_tit line2">
                                예약 <span className="bold">승인 및 취소</span>는{" "}
                                <span className="ex">
									현재 기준{" "}
                                    {moment(Date.now())
                                        .subtract(postSettings.res_end_period, "d")
                                        .format("MM.DD")}{" "}
                                    24:00까지 완료
								</span>
                            </div>
                            <div className="select_input">
                                <select
                                    name="catgo1"
                                    className="dropdown"
                                    onChange={(e) => {
                                        handleChange(`res_end_period`, e.target.value);
                                    }}
                                >
                                    {array.map((v) => {
                                        return (
                                            <option
                                                id={`day-${v}`}
                                                selected={
                                                    settings && settings.result.res_end_period === v
                                                        ? true
                                                        : false
                                                }
                                            >
                                                {v}
                                            </option>
                                        );
                                    })}
                                </select>
                                <span>일 전까지</span>
                            </div>
                        </div>
                        <div className="input">
                            <div className="select_tit line2">
                                예약 <span className="bold">신청 가능</span>한 기준일
                                <span className="ex">
									현재 기준{" "}
                                    {moment(Date.now())
                                        .subtract(postSettings.res_start_period, "d")
                                        .format("MM.DD")}{" "}
                                    24:00부터 가능
								</span>
                            </div>
                            <div className="select_input">
                                <select
                                    name="catgo1"
                                    className="dropdown"
                                    onChange={(e) => {
                                        handleChange(`res_start_period`, e.target.value);
                                    }}
                                >
                                    {array.map((v) => {
                                        return (
                                            <option
                                                id={`day-${v}`}
                                                selected={
                                                    settings &&
                                                    settings.result.res_start_period === v
                                                        ? true
                                                        : false
                                                }
                                            >
                                                {v}
                                            </option>
                                        );
                                    })}
                                </select>
                                <span>일 전부터</span>
                            </div>
                        </div>
                    </div>

                    <div className="sch_box">
                        <p className="tit ico02">스케줄관리 설정</p>
                        <p className="info">
                            스케줄 한 타임의 기준시간은
                            <br/>
                            <span>
								{postSettings.once_meet_time + postSettings.once_rest_time}분
							</span>
                            으로 자동계산됩니다.
                        </p>
                        <div className="input_area">
                            <div className="input">
                                <div className="select_tit">
                                    <span className="bold">미팅 시간</span>
                                </div>
                                <div className="select_input">
                                    {/*<select name="catgo1" className="dropdown">*/}
                                    {/*    */}
                                    {/*</select>*/}
                                    <input
                                        type="number"
                                        defaultValue={settings.result.once_meet_time}
                                        onChange={(e) => {
                                            if (e.target.value < 0) {
                                                alert("양의 정수 값을 입력해주세요.");
                                                e.target.value = 0;
                                                return;
                                            }
                                            handleChange(`once_meet_time`, e.target.value);
                                        }}
                                        id="time_input1"
                                    />
                                    <span>분</span>
                                </div>
                            </div>
                            <div className="input">
                                <div className="select_tit">
                                    <span className="bold">쉬는 시간</span>
                                </div>
                                <div className="select_input">
                                    <input
                                        type="number"
                                        defaultValue={settings.result.once_rest_time}
                                        onChange={(e) => {
                                            if (e.target.value < 0) {
                                                alert("양의 정수 값을 입력해주세요.");
                                                e.target.value = 0;
                                                return;
                                            }
                                            handleChange(`once_rest_time`, e.target.value);
                                        }}
                                        id="time_input2"
                                    />
                                    <span>분</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="regulation">
                    <p className="tit ico03">규정관리</p>
                    <div className="input">
                        <div className="select_tit">
                            <span className="bold">노쇼 최대</span>
                        </div>
                        <div className="select_input">
                            <select
                                name="catgo1"
                                className="dropdown"
                                onChange={(e) => {
                                    handleChange(`max_absent`, e.target.value);
                                }}
                            >
                                {array.map((v) => {
                                    return (
                                        <option
                                            id={`day-${v}`}
                                            selected={
                                                settings && settings.result.max_absent === v
                                                    ? true
                                                    : false
                                            }
                                        >
                                            {v}
                                        </option>
                                    );
                                })}
                            </select>
                            <span>까지</span>
                        </div>
                    </div>
                    <div className="input">
                        <div className="select_tit">
                            <span className="bold">패널티 부여</span>
                        </div>
                        <div className="select_input">
                            <select
                                name="catgo1"
                                className="dropdown"
                                onChange={(e) => {
                                    handleChange(`min_absent`, e.target.value);
                                }}
                            >
                                {array.map((v) => {
                                    return (
                                        <option
                                            id={`day-${v}`}
                                            selected={
                                                settings && settings.result.min_absent === v
                                                    ? true
                                                    : false
                                            }
                                        >
                                            {v}
                                        </option>
                                    );
                                })}
                            </select>
                            <span>번 부터</span>
                        </div>
                    </div>
                    <div className="input">
                        <div className="select_tit">
                            <span className="bold">패널티 기간</span>
                        </div>
                        <div className="select_input">
                            <select
                                name="catgo1"
                                className="dropdown"
                                onChange={(e) => {
                                    handleChange(`once_limit_period`, e.target.value);
                                }}
                            >
                                {array.map((v) => {
                                    return (
                                        <option
                                            id={`day-${v}`}
                                            selected={
                                                settings && settings.result.once_limit_period === v
                                                    ? true
                                                    : false
                                            }
                                        >
                                            {v}
                                        </option>
                                    );
                                })}
                            </select>
                            <span>일 동안</span>
                        </div>
                    </div>
                    <div className="setting_ex">
                        <p>[설정 예시]</p>
                        <span>결석 {postSettings.min_absent}회</span> 부터 결석 시,{" "}
                        <span>{postSettings.once_limit_period}일간</span> 이용제한 <br/>
                        <span>{postSettings.max_absent}회</span> 이상 결석 시, 해당 학기 이용 제한
                    </div>

<<<<<<< HEAD
					<div className="input">
						<div className="select_tit">
							<span className="bold">유학생 결과입력</span>
						</div>
						<div className="select_input">
							<select
								name="catgo1"
								className="dropdown"
								onChange={(e) => {
									handleChange(`result_input_deadline`, e.target.value);
								}}
							>
								{array.map((v) => {
									return (
										<option
											id={`day-${v}`}
											selected={
												settings &&
												settings.result.result_input_deadline === v
													? true
													: false
											}
										>
											{v}
										</option>
									);
								})}
							</select>
							<span>일 이내</span>
						</div>
					</div>
				</div>
			</div>
			<div className="table_btn left">
				<div
					className="darkGray"
					onClick={handleOpenForInsertForeignerStudent}
				>
					유학생 등록
				</div>
				<div className="darkGray" onClick={handleOpenForCreatSectIsOpen}>
					학기 기간 설정
				</div>
				<div className="darkGray" onClick={handleOpenForGetSectIsOpen}>
					학기 기간 조회
				</div>
				{/* LeeGuSeul GitHub ::
				pop_department_regist.php 학과등록*/}
				<div className="darkGray" onClick={handleOpenForGetSectIsOpen}>
					학과등록
				</div>
			</div>

			<div className="table_btn mb40">
				<div
					onClick={() => {
						postAdminSetting(postSettings).then((res) => alert(res.message));
					}}
				>
					저장
				</div>
			</div>
			<Modal isOpen={creatSectIsOpen} handleClose={handleCloseForCreatSectIsOpen}>
				<CreateSection isSetSectMode={true} handleClose={handleCloseForCreatSectIsOpen} />
			</Modal>
			<Modal isOpen={getSectIsOpen} handleClose={handleCloseForGetSectIsOpen}>
				<GetSections handleClose={handleCloseForGetSectIsOpen} />
			</Modal>
			<Modal
				isOpen={isOpenForInsertForeignerStudent}
				handleClose={handleCloseForInsertForeignerStudent}
			>
				<InsertForeignerStudent handleClose={handleCloseForInsertForeignerStudent} />
			</Modal>
		</div>
	) : (
		<>Loading</>
	);
=======
                    <div className="input">
                        <div className="select_tit">
                            <span className="bold">유학생 결과입력</span>
                        </div>
                        <div className="select_input">
                            <select
                                name="catgo1"
                                className="dropdown"
                                onChange={(e) => {
                                    handleChange(`result_input_deadline`, e.target.value);
                                }}
                            >
                                {array.map((v) => {
                                    return (
                                        <option
                                            id={`day-${v}`}
                                            selected={
                                                settings &&
                                                settings.result.result_input_deadline === v
                                                    ? true
                                                    : false
                                            }
                                        >
                                            {v}
                                        </option>
                                    );
                                })}
                            </select>
                            <span>일 이내</span>
                        </div>
                    </div>

                    <div className="btn_area right">
                        <div
                            className="bbtn darkGray"
                            onClick={handleOpenForInsertForeignerStudent}
                        >
                            유학생 등록
                        </div>
                        <div className="bbtn darkGray" onClick={handleOpenForCreatSectIsOpen}>
                            학기 기간 설정
                        </div>
                        <div className="bbtn darkGray" onClick={handleOpenForGetSectIsOpen}>
                            학기 기간 조회
                        </div>
                    </div>
                </div>
            </div>
            <div className="table_btn mb40">
                <div
                    onClick={() => {
                        postAdminSetting(postSettings);
                    }}
                >
                    저장
                </div>
            </div>
            <Modal isOpen={creatSectIsOpen} handleClose={handleCloseForCreatSectIsOpen}>
                <CreateSection isSetSectMode={true} handleClose={handleCloseForCreatSectIsOpen}/>
            </Modal>
            <Modal isOpen={getSectIsOpen} handleClose={handleCloseForGetSectIsOpen}>
                <GetSections handleClose={handleCloseForGetSectIsOpen}/>
            </Modal>
            <Modal
                isOpen={isOpenForInsertForeignerStudent}
                handleClose={handleCloseForInsertForeignerStudent}
            >
                <InsertForeignerStudent handleClose={handleCloseForInsertForeignerStudent}/>
            </Modal>
        </div>
    ) : (
        <>Loading</>
    );
>>>>>>> 09c2ce9b4741471357c2cc7209a3324cb4a884a5
}
