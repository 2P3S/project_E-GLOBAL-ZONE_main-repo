import React from 'react';
import useClick from "../../../modules/hooks/useClick";

/**
 * Modal - 이용 제한 헤제
 * @param handleClose
 * @returns {JSX.Element}
 * @constructor
 */
const ConfirmUnrestriction = ({handleClose}) => {
    return <div className="popup restriction">
        <p className="tit">이용 제한 해제</p>
        <p className="txt">{`studentName`} 학생의 <span>{`reason`}</span>을 해제하시겠습니까?</p>
        <textarea name="" id="" cols="20" rows="4" readOnly defaultValue={`사유 : 뭐가 문제야 세이 섬띵`} />

        <div className="btn_area">
            <div className="bbtn mint">해제</div>
            <div className="bbtn darkGray" ref={useClick(handleClose)}>닫기</div>
        </div>
    </div>;
}

export default ConfirmUnrestriction;