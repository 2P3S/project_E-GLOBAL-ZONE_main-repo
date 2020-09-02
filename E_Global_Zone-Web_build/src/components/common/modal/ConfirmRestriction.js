import React, {useEffect, useState} from "react";
import useClick from "../../../modules/hooks/useClick";
import {postAdminKoreanRestrict} from "../../../api/admin/korean";

/**
 * Modal - 이용 제한 등록
 * @param handleClose
 * @returns {JSX.Element}
 * @constructor
 */
export default function ConfirmRestriction({std_kor_id, std_kor_name, handleClose, reRender}) {
    const [select, setSelect] = useState(true);
    const [date, setDate] = useState(3);
    const [pending, setPending] = useState(false);
    const handleClick = () => {
        if (select) {
            setDate(999);
        } else {
            setDate(0);
        }
        setSelect(!select);
    };
    const handleChange = (e) => {
        e.preventDefault();
        if (isNaN(parseInt(e.target.value))) {
            e.target.value = "";
        } else {
            if (e.target.value > 0) {
                setDate(parseInt(e.target.value));
            }
        }
    };

    const handleConfirm = () => {
        postAdminKoreanRestrict({
            std_kor_id,
            restrict_reason: document.getElementById("restrict_reason").value,
            restrict_period: date,
        }).then((res) => {
            alert(res.data.message);
            setPending(true);
        });
    };

    useEffect(() => {
        if (pending) {
            handleClose();
        }
    }, [pending]);

    useEffect(() => {
        return reRender;
    }, []);
    return (
        <div className="popup restriction">
            <p className="tit">이용 제한 등록</p>
            <div className="btn_area">
                <div className={`bbtn ${select ? "mint" : "gray"}`} onClick={handleClick}>
                    날짜로 제한 하기
                </div>
                <div className={`bbtn ${select ? "gray" : "mint"}`} onClick={handleClick}>
                    현재 학기 제한하기
                </div>
            </div>
            {select ? <input type="text" defaultValue={date} onChange={handleChange}/> : <></>}

            <p className="txt">
                {std_kor_name} 학생의 <span>이용 제한 사유</span>를 입력해주세요.
            </p>
            <textarea name="" id="restrict_reason" cols="20" rows="4"/>

            <div className="btn_area">
                <div className="bbtn mint" onClick={handleConfirm}>
                    등록
                </div>
                <div className="bbtn white" ref={useClick(handleClose)}>
                    닫기
                </div>
            </div>
        </div>
    );
}
