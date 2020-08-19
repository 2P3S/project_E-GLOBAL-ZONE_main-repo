import React from "react";

export default ({setScheduleList}) => {

    return <div className="check_box_area">
        <div className="check_box" onClick={()=>setScheduleList([""])}>
            <div className="check_box_input all">
                <input type="checkbox" id="allCheck" name="" />
                <label htmlFor="allCheck"></label>
            </div>
        </div>
        <div className="check_box">
            <div className="check_box_input">
                <input type="checkbox" id="no_app_reservation" name="" />
                <label htmlFor="no_app_reservation">
					<span>
						예약 미승인 <span className="blue">10</span>건
					</span>
                </label>
            </div>
        </div>
        <div className="check_box">
            <div className="check_box_input">
                <input type="checkbox" id="not_result" name="" />
                <label htmlFor="not_result">
					<span>
						결과 미입력 <span className="mint">2</span>건
					</span>
                </label>
            </div>
        </div>
        <div className="check_box">
            <div className="check_box_input">
                <input type="checkbox" id="no_app_result" name="" />
                <label htmlFor="no_app_result">
					<span>
						결과 미승인 <span className="yellow">3</span>건
					</span>
                </label>
            </div>
        </div>
        <div className="check_box">
            <div className="check_box_input">
                <input type="checkbox" id="ok_result" name="" />
                <label htmlFor="ok_result">
					<span>
						결과 입력완료 <span className="puple">2</span>건
					</span>
                </label>
            </div>
        </div>
    </div>
}