import React, { useEffect, useState } from "react";
// import { getKoreanReservationResult } from "../../../../modules/hooks/useAxios";
import { useSelector } from "react-redux";
import { selectUser } from "../../../../redux/userSlice/userSlice";
import { selectToday } from "../../../../redux/confSlice/confSlice";
import moment from "moment";
import { getKoreanSection } from "../../../../api/korean";
import { getKoreanReservationResult } from "../../../../api/korean/reservation";

/**
 * Korean :: 결과 조회
 * @returns {JSX.Element}
 * @constructor
 * @todo 섹션 아이디 받아와야함
 */
export default function Results() {
	const user = useSelector(selectUser);
	const today = useSelector(selectToday);
	const [data, setData] = useState();
	const [sect, setSect] = useState();
	const [selectSect, setSelectSect] = useState();
	const [selectSectId, setSelectSectId] = useState();
	useEffect(() => {
		// getKoreanReservationResult(5,8,1321704, setData);
		// getKoreanSection(user.id, setSect);
		getKoreanSection().then((res) => setSect(res.data));
	}, []);
	useEffect(() => {
		console.log(sect);
		if (typeof sect === "object") {
			setSelectSect(sect[0]);
		}
	}, [sect]);
	useEffect(() => {
		console.log(selectSect);
		if (selectSect) {
			getKoreanReservationResult(selectSect.sect_id, moment(today).format("M")).then((res) =>
				setData(res.data)
			);
		}
	}, [selectSect]);
	useEffect(() => {
		console.log(data);
	});

	const handleChange = (e) => {
		// getKoreanReservationResult(e.target.value, moment(today).format("M"), user.id, setData);
		sect.map((v) => {
			console.log(v);
			if (e.target.value == v.sect_id) {
				setSelectSect(v);
			}
		});
		window.easydropdown.all();
	};

	return (
		<div>
			<div className="wrap mobile_result">
				<p className="tit">{selectSect && selectSect.sect_name}</p>
				<div className="point_info">
					<p>
						<span className="name">{user.name}</span> 학생의
						<br />
						글로벌 포인트 현황
					</p>
					<div className="result">
						{/*<span className="rank">상위 10%</span>*/}
						<span>{selectSect && selectSect.res_count}</span>
						<span className="times">회</span>
					</div>
				</div>

				<select name="" id="" className="mt50" onChange={handleChange}>
					{typeof sect === "object" && sect.length > 0 ? (
						sect.map((v) => {
							return <option value={v.sect_id}>{v.sect_name}</option>;
						})
					) : (
						<option>참여한 학기가 없습니다.</option>
					)}
				</select>

				<div className="history_wrap">
					<div className="month_move">
						<p>2020년 7월</p>
						<div className="arrow">
							<div>
								<img src="/global/mobile/img/month_move_prev.gif" alt="이전 달" />
							</div>
							<div>
								<img src="/global/mobile/img/month_move_next.gif" alt="다음 달" />
							</div>
						</div>
					</div>
					<div>{/* <a href=""></a> */}</div>
					<table>
						<colgroup>
							<col width="30%" />
							<col width="70%" />
						</colgroup>
						<thead>
							<tr>
								<th scope="col">일시</th>
								<th scope="col">유학생</th>
							</tr>
						</thead>
						<tbody>
							{typeof data === "object" &&
								data.data.map((v) => {
									return (
										<tr>
											<td>{v.sch_start_date.substr(5, 20)}</td>
											<td>{v.std_for_name}</td>
										</tr>
									);
								})}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
}
