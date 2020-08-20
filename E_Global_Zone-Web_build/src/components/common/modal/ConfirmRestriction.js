import React from "react";
import useClick from "../../../modules/hooks/useClick";

export default function ConfirmRestriction({handleClose}) {
    return (
        <div className="popup restriction">
            <p className="tit">이용 제한 등록</p>
            <p className="txt">
                {`studentName`} 학생의 <span>{`Reason`}</span>를 입력해주세요.
            </p>
            <textarea name="" id="" cols="20" rows="4"/>

            <div className="btn_area">
                <div className="bbtn mint">
                    등록
                </div>
                <div className="bbtn white" ref={useClick(handleClose)}>
                    닫기
                </div>
            </div>
        </div>
    );
}
