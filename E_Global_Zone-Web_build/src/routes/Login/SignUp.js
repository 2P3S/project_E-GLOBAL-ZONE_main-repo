import React, {useEffect, useState} from "react";
import {useLocation, useHistory} from "react-router-dom";
import {postKoreanAccount} from "../../api/korean";
import {useSelector} from "react-redux";
import {selectDept} from "../../redux/confSlice/confSlice";

export default function SignUp() {
    const locaiton = useLocation();
    const history = useHistory();
    const dept = useSelector(selectDept);

    const [std_kor_dept, set_std_kor_dept] = useState(1);

    useEffect(() => {
        console.log(dept);
        if (!Array.isArray(dept) && window.localStorage.getItem("global-zone-korean-token")) {
            history.push("/");
        }
    }, []);

    const handleClick = () => {
        const std_kor_id = document.getElementById("std_kor_id").value;
        const std_kor_name = document.getElementById("std_kor_name").value;
        const std_kor_phone = document.getElementById("std_kor_phone").value;
        console.log(std_kor_id, std_kor_dept, std_kor_name, std_kor_phone);
        if (isNaN(parseInt(std_kor_id))) {
            alert("학번은 숫자를 입력하셔야 합니다.");
            return false;
        }
        /** @todo 유효성 검사 필요함 */
        postKoreanAccount({std_kor_id, std_kor_name, std_kor_dept, std_kor_phone})
            .then((res) => {
                res.status === 201 && window.location.reload();
            })
            .catch((e) => {
                alert(e);
                history.push("/");
            });
    };

    return (
        <div className="content">
            <div className="join_add_wrap">
                <div className="sub_title">
                    <p className="tit">회원정보 추가입력</p>
                </div>
                <div className="input_area">
                    <div className="box">
                        <label htmlFor="std_kor_id">학번</label>
                        <input id="std_kor_id" type="text" placeholder="학번 입력"/>
                    </div>
                    <div className="box">
                        <label htmlFor="">계열학과</label>
                        <select
                            name="catgo"
                            className="dropdown"
                            onChange={(e) => {
                                set_std_kor_dept(e.target.value);
                            }}
                        >
                            {/* <option value="">컴퓨터 정보계열</option> */}
                            {Array.isArray(dept) &&
                            dept.map((v) => (
                                <option value={v.dept_id}>{v.dept_name[1]}</option>
                            ))}
                        </select>
                    </div>
                    <div className="box">
                        <label htmlFor="std_kor_name">이름</label>
                        <input id="std_kor_name" type="text" placeholder="이름 입력"/>
                    </div>
                    <div className="box">
                        <label htmlFor="std_kor_phone">휴대전화</label>
                        <input id="std_kor_phone" type="text" placeholder="휴대전화 입력"/>
                    </div>
                    <div className="box">
                        <label htmlFor="std_kor_mail">이메일</label>
                        <input
                            id="std_kor_mail"
                            type="text"
                            value={locaiton.state && locaiton.state.email}
                            readonly
                        />
                    </div>

                    <button onClick={handleClick}>입력 완료</button>
                </div>
            </div>
        </div>
    );
}
