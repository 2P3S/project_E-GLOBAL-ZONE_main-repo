import React, {useEffect, useState, useRef} from "react";
import Modal from "components/common/modal/Modal";
import ConfirmStudent from "components/common/modal/ConfirmStudent";
import useClick from "modules/hooks/useClick";
import conf from "conf/conf";
import ConfirmRestriction from "../../../../components/common/modal/ConfirmRestriction";
import ConfirmUnrestriction from "../../../../components/common/modal/ConfirmUnrestriction";
import useModal from "../../../../modules/hooks/useModal";


let i = 2001200;
let j = 0;

/**
 * Manager :: 학생관리
 * @returns {JSX.Element}
 * @constructor
 */
export default function Students() {
    let mockup = {
        sort: null,
        data: [
            {
                dept: conf.department.COMINFO,
                std_id: i++,
                name: "name",
                status: false,
                ph: "010-0000-0000",
                e_mail: "nea4182@g.yju.ac.kr",
                count: j++,
                absent: 0,
            },
            {
                dept: conf.department.DESIGN,
                std_id: i++,
                name: "name",
                status: true,
                ph: "010-0000-0000",
                e_mail: "nea4182@g.yju.ac.kr",
                count: j++,
                absent: 0,
            },
            {
                dept: conf.department.COMINFO,
                std_id: i++,
                name: "name",
                status: false,
                ph: "010-0000-0000",
                e_mail: "nea4182@g.yju.ac.kr",
                count: j++,
                absent: 0,
            },
            {
                dept: conf.department.COMINFO,
                std_id: i++,
                name: "name",
                status: false,
                ph: "010-0000-0000",
                e_mail: "nea4182@g.yju.ac.kr",
                count: j++,
                absent: 0,
            },
            {
                dept: conf.department.COMINFO,
                std_id: i++,
                name: "name",
                status: false,
                ph: "010-0000-0000",
                e_mail: "nea4182@g.yju.ac.kr",
                count: j++,
                absent: 0,
            },
            {
                dept: conf.department.COMINFO,
                std_id: i++,
                name: "name",
                status: false,
                ph: "010-0000-0000",
                e_mail: "nea4182@g.yju.ac.kr",
                count: j++,
                absent: 0,
            },
            {
                dept: conf.department.COMINFO,
                std_id: i++,
                name: "name",
                status: false,
                ph: "010-0000-0000",
                e_mail: "nea4182@g.yju.ac.kr",
                count: j++,
                absent: 0,
            },
            {
                dept: conf.department.COMINFO,
                std_id: i++,
                name: "name",
                status: false,
                ph: "010-0000-0000",
                e_mail: "nea4182@g.yju.ac.kr",
                count: j++,
                absent: 0,
            },
            {
                dept: conf.department.COMINFO,
                std_id: i++,
                name: "name",
                status: false,
                ph: "010-0000-0000",
                e_mail: "nea4182@g.yju.ac.kr",
                count: j++,
                absent: 0,
            },
            {
                dept: conf.department.COMINFO,
                std_id: i++,
                name: "name",
                status: false,
                ph: "010-0000-0000",
                e_mail: "nea4182@g.yju.ac.kr",
                count: j++,
                absent: 0,
            },
        ],
    };
    const [data, setData] = useState(mockup.data);
    const [isOpen, setIsOpen] = useState(false);
    const [isRestrict, setIsRestrict] = useState(false);
    const {isOpen: isUnrestrict, handleOpen: handleOpenForUnrestrict, handleClose: handleCloseForUnrestrict} = useModal();

    function handleOpen() {
        setIsRestrict(true);
    }

    function handleClose() {
        setIsRestrict(false);
    }

    const ref = useClick(() => {
        handleOpen();
    });

    useEffect(() => {
        window.easydropdown.all();
    }, []);
    const sort = (sortBy) => {
        if (mockup.sort === sortBy) {
            setData(mockup.data.sort((a, b) => (a[sortBy] > b[sortBy] ? -1 : 1)));
            mockup.sort = null;
        } else {
            setData(mockup.data.sort((a, b) => (a[sortBy] < b[sortBy] ? -1 : 1)));
            mockup.sort = sortBy;
        }
    };
    return (
        <div className="content">
            <div className="sub_title">
                <div className="top_semester">
                    <p className="tit">한국인 학생 관리</p>
                    <select name="catgo" className="dropdown">
                        <option>2020학년도 1학기</option>
                        <option>2020학년도 여름학기</option>
                        <option>2020학년도 2학기</option>
                        <option>2020학년도 겨울학기</option>
                    </select>
                </div>

                <div className="top_search">
                    <select name="catgo" className="dropdown">
                        <option>이름</option>
                        <option>학번</option>
                        <option>연락처</option>
                    </select>
                    <input type="text"/>
                    <input type="submit" value="검색"/>
                </div>
            </div>

            <div className="wrap">
                <div className="scroll_area">
                    <table className="student_manage_table">
                        <colgroup>
                            <col width="10%"/>
                            <col width="12%"/>
                            <col width="15%"/>
                        </colgroup>
                        <thead>
                        <tr>
                            <th
                                scope="col"
                                className="bg align"
                                ref={useClick(() => {
                                    setData([]);
                                    sort("dept");
                                })}
                            >
                                계열학과
                                <img
                                    src="/global/img/table_align_arrow.gif"
                                    alt="언어 기준 정렬"
                                />
                            </th>
                            <th scope="col" className="bg">
                                학번
                            </th>
                            <th scope="col" className="bg">
                                이름
                            </th>
                            <th
                                scope="col"
                                className="bg align"
                                ref={useClick(() => {
                                    setData([]);
                                    sort("status");
                                })}
                            >
                                이용제한
                                <img
                                    src="/global/img/table_align_arrow.gif"
                                    alt="언어 기준 정렬"
                                />
                            </th>
                            <th scope="col" className="bg">
                                연락처
                            </th>
                            <th scope="col" className="bg">
                                G Suite 계정
                            </th>
                            <th
                                scope="col"
                                className="bg align"
                                ref={useClick(() => {
                                    setData([]);
                                    sort("count");
                                })}
                            >
                                활동 횟수
                                <img
                                    src="/global/img/table_align_arrow.gif"
                                    alt="언어 기준 정렬"
                                />
                            </th>
                            <th
                                scope="col"
                                className="bg align"
                                ref={useClick(() => {
                                    setData([]);
                                    sort("absent");
                                })}
                            >
                                미참석 횟수
                                <img
                                    src="/global/img/table_align_arrow.gif"
                                    alt="언어 기준 정렬"
                                />
                            </th>
                        </tr>
                        </thead>
                        <tbody>
                        {data.map((v, index) => (
                            <tr key={v.std_id} className={v.status ? "restriction_on" : ""}>
                                <td>{v.dept}</td>
                                <td>{v.std_id}</td>
                                <td
                                    className="name"
                                    onMouseOver={() => {
                                        document.getElementById(`hover_btn_${index}`).className = "hover_btn kor"
                                    }}
                                    onMouseOut={() => {
                                        document.getElementById(`hover_btn_${index}`).className = "off"
                                    }}
                                >{v.name}
                                    <div className="off" id={`hover_btn_${index}`}>
                                        <div className="area">
                                            <div className="navy">비밀번호 초기화</div>
                                            <div className="mint">이용제한 해제</div>
                                            <div className="lightGray">삭제</div>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    {v.status ? (
                                        <div className="restriction"
                                             onClick={
                                                 handleOpenForUnrestrict
                                             }>
                                            <img
                                                src="/global/img/restriction_on.png"
                                                alt="이용제한"
                                            />
                                            <Modal
                                                isOpen={isUnrestrict}
                                                onRequestClose={handleCloseForUnrestrict}
                                            >
                                                <ConfirmUnrestriction handleClose={handleCloseForUnrestrict}/>
                                            </Modal>
                                        </div>
                                    ) : (
                                        <div
                                            className="restriction"
                                            onClick={() => {
                                                setIsRestrict(true);
                                            }}
                                        >
                                            <img
                                                src="/global/img/restriction_off.png"
                                                alt="이용제한 해제"
                                            />
                                            <Modal
                                                isOpen={isRestrict}
                                                onRequestClose={handleClose}
                                            >
                                                <ConfirmRestriction handleClose={handleClose}/>
                                            </Modal>
                                        </div>
                                    )}
                                </td>
                                <td>{v.ph}</td>
                                <td>{v.e_mail}</td>
                                <td>{v.count}회</td>
                                <td>{v.absent}회</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>

                <div className="table_btn">
                    <div
                        ref={useClick(() => {
                            setIsOpen(true);
                        })}
                    >
                        신청 승인
                    </div>
                    <div
                        ref={useClick(function () {
                            alert("엑셀 다운");
                        })}
                    >
                        CSV 다운
                    </div>
                </div>
            </div>
            <Modal
                isOpen={isOpen}
                hadleClose={() => {
                    setIsOpen(false);
                }}
            >
                <ConfirmStudent
                    handleClose={() => {
                        setIsOpen(false);
                    }}
                />
            </Modal>
        </div>
    );
}
