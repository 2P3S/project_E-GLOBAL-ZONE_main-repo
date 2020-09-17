import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectUser } from "../../../../redux/userSlice/userSlice";
import { selectToday } from "../../../../redux/confSlice/confSlice";
import Loader from "../../../../components/common/Loader";
import moment from "moment";
import { getKoreanSection, getKoreanSectionRank } from "../../../../api/korean";
import { getKoreanReservationResult } from "../../../../api/korean/reservation";
import { useHistory } from "react-router-dom";

/**
 * Korean :: 결과 조회
 * @returns {JSX.Element}
 * @constructor
 * @todo 섹션 아이디 받아와야함
 */
export default function Results() {
	const user = useSelector(selectUser);
	const today = useSelector(selectToday);
	const history = useHistory();
	const [data, setData] = useState();
	const [sect, setSect] = useState();
	const [pending, setPending] = useState(false);
	const [selectSect, setSelectSect] = useState();
	const [selectSectId, setSelectSectId] = useState();
	const [sectRank, setSectRank] = useState(0);
	const [selectMonth, setSelectMonth] = useState(moment(today));

	useEffect(() => {
		// getKoreanReservationResult(5,8,1321704, setData);
		// getKoreanSection(user.id, setSect);
		getKoreanSection().then((res) => {
			setSect(res.data.data);
			typeof res.data.data === "object" && setSelectSect(res.data.data[0]);
			if (res.status === 202) {
				alert(res.data.message);
				// history.push("/");
			} else {
				setPending(true);
			}
			// window.easydropdown.all();
		});
		// window.easydropdown.all();
	}, []);

	useEffect(() => {
		pending &&
			selectSect &&
			getKoreanReservationResult(selectSect.sect_id, selectMonth.format("M")).then((res) => {
				setData(res.data);
				setPending(false);
			});
	}, [pending]);

	useEffect(() => {
		selectSect &&
			getKoreanSectionRank(selectSect.sect_id).then((res) => {
				setSectRank(res.data.data);
			});
	}, [selectSect]);

	const handleChange = (e) => {
		setSelectSect(e.target.value);
		setPending(true);
	};

	return (
		<div>
			<div className="wrap mobile_result bg">
				{/* <p className="tit">{selectSect && selectSect.sect_name}</p> */}
				<div className="point_info">
					<p>
						<div>
							<span className="name">{user.name}</span> 학생의{" "}
							{selectSect ? selectSect.sect_name : "학기별"}
						</div>
						글로벌 존 이용 횟수
						<div>{selectSect ? selectSect.sect_name : ""}</div>
					</p>
					<div className="result">
						<span className="rank">상위 {sectRank}%</span>
						<span>{selectSect && selectSect.res_count ? selectSect.res_count : 0}</span>
						<span className="times">회</span>
					</div>
				</div>

				<select name="" id="" className="resultSelect" onChange={handleChange}>
					{sect && sect ? (
						sect.map((v) => {
							return <option value={v.sect_id}>{v.sect_name}</option>;
						})
					) : (
						<option>참여한 학기가 없습니다.</option>
					)}
				</select>

				<div className="history_wrap">
					<div className="month_move">
						<p>{selectMonth.format("YYYY년 MM월")}</p>
						<div className="arrow">
							<div
								onClick={() => {
									setSelectMonth(moment(selectMonth).subtract(1, "M"));
									setPending(true);
								}}
							>
								<img src="/global/mobile/img/month_move_prev.gif" alt="이전 달" />
							</div>
							<div
								onClick={() => {
									setSelectMonth(moment(selectMonth).add(1, "M"));
									setPending(true);
								}}
							>
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
							{!pending ? (
								typeof data === "object" && data.data.length > 0 ? (
									data.data.map((v) => {
										return (
											<tr>
												<td>
													{moment(v.sch_start_date).format("MM-DD hh:mm")}
												</td>
												<td>{v.std_for_name}</td>
											</tr>
										);
									})
								) : (
									<tr>
										<td>-</td>
										<td>진행 일정이 없습니다.</td>
									</tr>
								)
							) : (
								<tr>
									<td colSpan="2">
										<Loader></Loader>
									</td>
								</tr>
							)}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
}
