import React, { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import conf from "../../../../conf/conf";
import { useSelector } from "react-redux";
import { selectUser } from "../../../../redux/userSlice/userSlice";
import useClick from "../../../../modules/hooks/useClick";
import { getKoreanSchedule } from "../../../../api/korean";
import { postKoreanReservation } from "../../../../api/korean/reservation";
import Loader from "../../../../components/common/Loader";

/**
 * Korean :: 신청 양식
 * @returns {JSX.Element}
 * @constructor
 * @todo setup
 */
export default function ApplicationForm() {
	const { id: sch_id } = useParams();
	const [data, setData] = useState();

	const user = useSelector(selectUser);
	const history = useHistory();

	useEffect(() => {
		getKoreanSchedule(sch_id).then((res) => setData(res.data.data));
	}, []);

	return data ? (
		<div className="wrap bg">
			<div className="apply_tit">
				<h3 className="tit">예약신청</h3>
				<p>
					신청인원 :<span> {data.sch_res_count} </span>/ {data.sch_ava_count}
				</p>
			</div>

			<div className="reservation_boxs mb30">
				<div className="box deepBlue form">
					<ul>
						<li>{`[${data.std_for_lang}] ${data.std_for_name}`}</li>
						<li className="eng">{data.sch_time}</li>
					</ul>
				</div>
			</div>

			<div className="input_box">
				<p>신청 날짜</p>
				<input type="text" value={data.sch_date} readOnly />
			</div>
			<div className="input_box">
				<p>신청 시간</p>
				<input type="text" value={data.sch_time} readOnly />
			</div>
			<div className="input_box">
				<p>유학생</p>
				<input type="text" value={data.std_for_name} readOnly />
			</div>
			<div className="input_box">
				<p>신청 학생</p>
				<input type="text" value={user.name} readOnly />
			</div>
			<div className="input_box">
				<p>e-글로벌 존 예약 방침</p>
				<textarea
					readOnly
					defaultValue={
						"[ 무단 예약 부도에 대한 동의 ] 예약 신청 후, 예약 취소 또는 관리자의 확인 없이\n" +
						"예약 부도(일명 No Show)시, 관련 규정에 따라, 불이익이 주어짐에 동의합니다."
					}
				/>
			</div>

			<div className="agree">
				<div className="all_agree">
					<input type="checkbox" id="a1" name="전체동의" />
					<label htmlFor="a1">
						<span>e - 글로벌 존 예약 방침에 동의합니다.</span>
					</label>
				</div>
			</div>

			<div
				className="btn_wrap"
				onClick={async () => {
					let agreement = document.getElementById("a1").checked;
					if (agreement) {
						postKoreanReservation(sch_id).then((res) => {
							history.push("/reservation");
							res.status !== 201 && alert(res.data.message);
						});
					} else {
						alert("e-글로벌 존 예약 방침에 동의하셔야 신청 할 수 있습니다.");
					}
				}}
				style={{ cursor: "pointer" }}
			>
				<div>신청하기</div>
			</div>
		</div>
	) : (
		<Loader />
	);
}
