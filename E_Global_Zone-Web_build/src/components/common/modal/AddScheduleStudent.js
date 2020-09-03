import React, {useState, useEffect} from "react";
// import { postAdminKorean, postAdminScheduleAdd } from "../../../modules/hooks/useAxios";
import {postAdminKorean} from "../../../api/admin/korean";
import {postAdminScheduleAdd} from "../../../api/admin/schedule";
import {getAdminReservation} from "../../../api/admin/foreigner";
import {getForeignerReservation} from "../../../api/foreigner/reservation";
import {useSelector} from "react-redux";
import {selectUser} from "../../../redux/userSlice/userSlice";
import conf from "../../../conf/conf";

export default function AddScheduleStudent({
                                               handleClose,
                                               sch_id,
                                               _setData,
                                               std_for_id,
                                               reRender,
                                           }) {
    const [data, setData] = useState();
    const [result, setResult] = useState();
    const user = useSelector(selectUser);
    const [notReRendering, setNotReRendering] = useState(false);

    const handleSearch = () => {
        const column_data = document.getElementById("term").value;
        let column = "std_kor_id";
        if (isNaN(parseInt(column_data))) {
            column = "std_kor_name";
        }
        postAdminKorean({column, column_data}).then((res) => setData(res.data));
    };

    const handleAdd = (e) => {
        const std_kor_id = e.target.children[0].value;
        postAdminScheduleAdd(sch_id, {std_kor_id}).then((res) => setResult(res));
    };
    useEffect(() => {
        return () => {
            user.userClass === conf.userClass.MANAGER
                ? getAdminReservation(sch_id).then((res) => _setData(res.data))
                : getForeignerReservation(sch_id, std_for_id, _setData);
        };
    }, []);

    useEffect(() => {
        console.log(data);
    }, [data]);
    useEffect(() => {
        console.log(result);
        if (result && result.status === 201) {
            alert(result.data.message);
            handleClose();
        } else if (result && result.status !== 201) {
            alert("[에러] 이미 추가한 학생입니다.");
        }
    }, [result]);
    return (
        <>
            <div className="popup student_plus">
                <div className="top_tit">
                    <p className="tit">학생추가</p>
                    <div className="tsearch_box">
                        <input type="text" placeholder="학생 이름 으로 검색 하기" id="term"/>
                        <button onClick={handleSearch}>검색</button>
                    </div>
                </div>
                <div className="student_plus_list">
                    {data &&
                    data.data &&
                    data.data.map((v) => {
                        return (
                            <div>
                                <span>{v.std_kor_id} </span>
                                <span>{v.std_kor_name} </span>
                                <span>
										<button onClick={handleAdd}>
											추가하기
											<input type="hidden" value={v.std_kor_id}/>
										</button>
									</span>
                            </div>
                        );
                    })}
                </div>
                <button
                    className="del_btn"
                    onClick={() => {
                        setNotReRendering(true);
                        handleClose();
                    }}
                >
                    취소
                </button>
            </div>
        </>
    );
}
