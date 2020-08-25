import React, {useEffect, useRef, useState} from "react";
import {
    getForeignerReservation,
    patchForeignerReservationPermission,
    postForeignerReservationResult
} from "../../../modules/hooks/useAxios";
import {useSelector} from "react-redux";
import {selectUser} from "../../../redux/userSlice/userSlice";
// import FormData from "form-data";


const InsertResult = ({sch_id, handleClose}) => {
    const user = useSelector(selectUser);
    const [imgStart, setImgStart] = useState();
    const [imgEnd, setImgEnd] = useState();
    const [data, setData] = useState(new FormData());
    const [stdData, setStdData] = useState()
    const handleInputImage = (e) => {
        let array = [];
        data.append('result_start_img', e.target.files[0]);
        data.append('result_end_img', e.target.files[0]);
        for (let key of data.entries()) {
            console.log(key[0] + ',' + key[1]);
        }
        setImgStart((e.target.files[0]));
        setImgEnd(e.target.files[0]);
    }

    const handleConfirm = () => {
        let attendance_std_kor_id_list = [];
        let absent_std_kor_id_list = [];
        stdData.data.map(v => {
            console.log(typeof document.getElementById(`${v.std_kor_id}`).value)
            if (document.getElementById(`${v.std_kor_id}`).value === "true") {
                attendance_std_kor_id_list.push((v.std_kor_id));
            } else {
                absent_std_kor_id_list.push((v.std_kor_id));
            }
        })

        attendance_std_kor_id_list.map((v, index) => {
            data.append(`attendance_std_kor_id_list[${index}]`, v);
        })


        absent_std_kor_id_list.map((v, index) => {
            data.append(`absent_std_kor_id_list[${index}]`, v);
        })


        console.log(data);
        postForeignerReservationResult(sch_id, data);
    }

    useEffect(() => {
        getForeignerReservation(sch_id, user.id, setStdData);
        window.easydropdown.all();
    }, [])
    useEffect(() => {
        console.log(data)
        console.log(typeof form);
        window.easydropdown.all();
    });
    return (
        <div className="popup list">
            <div className="top_tit">
                <div className="left">
                    <p className="tit">출석 결과 입력하기</p>
                    <p className="txt">7월 13일(월) <span>AM09:00 ~ PM12:00</span></p>
                </div>
                <p className="name">바라트벡 울잔</p>
            </div>

            <div className="student_list">
                <ul>
                    {/*<li>*/}
                    {/*    <div className="student">*/}
                    {/*        <p className="name">이구슬</p>*/}
                    {/*        <select name="catgo" className="dropdown">*/}
                    {/*            <option value="attendance">승인</option>*/}
                    {/*            <option value="absent">미승인</option>*/}
                    {/*        </select>*/}
                    {/*    </div>*/}
                    {/*</li>*/}
                    {/*<li>*/}
                    {/*    <div className="student">*/}
                    {/*        <p className="name">이구슬</p>*/}
                    {/*        <select name="catgo" className="dropdown">*/}
                    {/*            <option value="attendance">승인</option>*/}
                    {/*            <option value="absent">미승인</option>*/}
                    {/*        </select>*/}
                    {/*    </div>*/}
                    {/*</li>*/}
                    {stdData && stdData.data ? stdData.data.map((v, index) => {
                        let attendance = v.res_state_of_attendance;
                        return <li key={v.std_kor_id + "index"}>
                            <div className="student">
                                <p className="name">{v.std_kor_name}</p>
                                <select name={"catgo"} className={"dropdown"} id={v.std_kor_id} key={`${v.std_kor_id}`}>
                                    <option value={true} selected={attendance}>출석</option>
                                    <option value={false} selected={!attendance}>불참</option>
                                </select>
                            </div>
                        </li>
                    }) : <>Loading</>}

                </ul>
            </div>


            <ul className="img_file">
                {/*<li>*/}
                {/*    <p className="file_no">파일 첨부 1</p>*/}
                {/*    <p className="file_name">0713_zoom_승인 이미지 파일_1.jpg</p>*/}
                {/*    <div className="del"><img src="/global/img/img_list_del.gif" alt="첨부 이미지 파일 삭제"/></div>*/}
                {/*</li>*/}
                {/*<li>*/}
                {/*    <p className="file_no">파일 첨부 2</p>*/}
                {/*    <p className="file_name">0713_zoom_승인 이미지 파일_2.jpg</p>*/}
                {/*    <div className="del"><img src="/global/img/img_list_del.gif" alt="첨부 이미지 파일 삭제"/></div>*/}
                {/*</li>*/}
            </ul>

            {/*<p className="attend_rate">출석율 : <span>60%</span></p>*/}

            <div className="btn_area right">
                <input type="file" name="img" onChange={handleInputImage}/>
                {/*<div className="bbtn gray">사진 업로드</div>*/}
                <div className="bbtn mint" onClick={handleConfirm}>저장</div>
                <div className="bbtn darkGray" onClick={handleClose}>닫기</div>
            </div>
        </div>
    );
}

export default InsertResult;