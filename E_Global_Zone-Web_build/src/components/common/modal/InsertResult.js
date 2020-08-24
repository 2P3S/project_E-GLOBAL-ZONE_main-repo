import React, {useEffect, useRef, useState} from "react";
import {postForeignerReservationResult} from "../../../modules/hooks/useAxios";
// import FormData from "form-data";


const InsertResult = () => {
    const [imgStart, setImgStart] = useState();
    const [imgEnd, setImgEnd] = useState();
    const form = useRef();
    let data = new FormData(form.current);

    const [test, setTest] = useState();
    const handleInputImage = (e) => {
        // let array = [];
        // console.log(e.target.files);
        // data.append('result_start_img', e.target.files[0]);
        // data.append('result_end_img', e.target.files[0]);
        // for(let key of data.entries()){
        //     // console.log(key[0]+','+key[1]);
        //     array.push(key[1]);
        // }
        // setTest(array);
        // console.log(test);
        // setImgStart((e.target.files[0]));
        // setImgEnd(e.target.files[0]);
    }

    const handleConfirm = () => {
        // console.log(imgStart, imgEnd);
        console.log(data, form.current);
        postForeignerReservationResult(1397, data, data);
    }

    useEffect(() => {
        window.easydropdown.all();
    }, [])
    useEffect(() => {
        console.log(data)
        console.log(typeof form);
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
                    <li>
                        <div className="student">
                            <p className="name">이구슬</p>
                            <select name="catgo" className="dropdown">
                                <option value="attendance">승인</option>
                                <option value="absent">미승인</option>
                            </select>
                        </div>
                    </li>
                    <li>
                        <div className="student">
                            <p className="name">이구슬</p>
                            <select name="catgo" className="dropdown">
                                <option value="attendance">승인</option>
                                <option value="absent">미승인</option>
                            </select>
                        </div>
                    </li>
                    <li>
                        <div className="student">
                            <p className="name">이구슬</p>
                            <select name="catgo" className="dropdown">
                                <option value="attendance">승인</option>
                                <option value="absent">미승인</option>
                            </select>
                        </div>
                    </li>
                </ul>
            </div>


            <ul className="img_file">
                <li>
                    <p className="file_no">파일 첨부 1</p>
                    <p className="file_name">0713_zoom_승인 이미지 파일_1.jpg</p>
                    <div className="del"><img src="/global/img/img_list_del.gif" alt="첨부 이미지 파일 삭제"/></div>
                </li>
                <li>
                    <p className="file_no">파일 첨부 2</p>
                    <p className="file_name">0713_zoom_승인 이미지 파일_2.jpg</p>
                    <div className="del"><img src="/global/img/img_list_del.gif" alt="첨부 이미지 파일 삭제"/></div>
                </li>
            </ul>

            <p className="attend_rate">출석율 : <span>60%</span></p>

            <div className="btn_area right">
                <form ref={form}>
                <input type="file" name="img" onChange={handleInputImage}/>
                </form>
                <div className="bbtn gray">사진 업로드</div>
                <div className="bbtn mint" onClick={handleConfirm}>저장</div>
                <div className="bbtn darkGray">닫기</div>
            </div>
        </div>
    );
}

export default InsertResult;