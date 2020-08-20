import React from "react";

/**
 * Modal - 유학생 연락처
 * @param list
 * @param handleClose
 * @returns {JSX.Element}
 * @constructor
 */
export default function ForeignerContact({list, handleClose}){

    return <div className="popup contact">
        <p className="tit">유학생 연락처 정보</p>
        <div className="scroll_area">
            <table className="pop_table">
                <thead>
                <tr>
                    <th scope="col">이름</th>
                    <th scope="col">연락처</th>
                    <th scope="col">이메일</th>
                    <th scope="col">ZoomID</th>
                    <th scope="col">ZoomPW</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td>바라트벡 울잔</td>
                    <td>010-0000-0000</td>
                    <td>zxc1234@naver.com</td>
                    <td>211 233 1546</td>
                    <td>7209</td>
                </tr>
                <tr>
                    <td>바라트벡 울잔</td>
                    <td>010-0000-0000</td>
                    <td>zxc1234@naver.com</td>
                    <td>211 233 1546</td>
                    <td>7209</td>
                </tr>
                <tr>
                    <td>바라트벡 울잔</td>
                    <td>010-0000-0000</td>
                    <td>zxc1234@naver.com</td>
                    <td>211 233 1546</td>
                    <td>7209</td>
                </tr>
                <tr>
                    <td>바라트벡 울잔</td>
                    <td>010-0000-0000</td>
                    <td>zxc1234@naver.com</td>
                    <td>211 233 1546</td>
                    <td>7209</td>
                </tr>
                <tr>
                    <td>바라트벡 울잔</td>
                    <td>010-0000-0000</td>
                    <td>zxc1234@naver.com</td>
                    <td>211 233 1546</td>
                    <td>7209</td>
                </tr>
                <tr>
                    <td>바라트벡 울잔</td>
                    <td>010-0000-0000</td>
                    <td>zxc1234@naver.com</td>
                    <td>211 233 1546</td>
                    <td>7209</td>
                </tr>
                <tr>
                    <td>바라트벡 울잔</td>
                    <td>010-0000-0000</td>
                    <td>zxc1234@naver.com</td>
                    <td>211 233 1546</td>
                    <td>7209</td>
                </tr>
                <tr>
                    <td>바라트벡 울잔</td>
                    <td>010-0000-0000</td>
                    <td>zxc1234@naver.com</td>
                    <td>211 233 1546</td>
                    <td>7209</td>
                </tr>
                </tbody>
            </table>
        </div>

        <div className="btn_area right">
            <div className="bbtn mint">등록</div>
            <div className="bbtn darkGray" onClick={handleClose}>닫기</div>
        </div>
    </div>
}
