import React, { useEffect, useState } from "react";
import { group } from "d3-array";
import moment from "moment";
import { getKoreanSchedule } from "../../../../api/korean";
import Loader from "../../../../components/common/Loader";
import Calendar from "../../../../components/mobile/CalendarMark";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { selectSelectDate, setSelectDate } from "../../../../redux/confSlice/confSlice";

export default function Schedules() {
	const selectedDate = useSelector(selectSelectDate);
	const dispatch = useDispatch();
	const [data, setData] = useState();
	const [defaultData, setDefaultData] = useState();
	const [dates, setDates] = useState();
	const [calset, setCalset] = useState(false);
	const [pending, setPending] = useState(true);
	const history = useHistory();
	useEffect(() => {
		getKoreanSchedule().then((res) => {
			const { data } = res.data;
			if (data.length === 0) {
				alert("조회가능한 스케줄이 없습니다.");
			} else {
				dispatch(setSelectDate(moment(data[0].sch_start_date).format("YYYY-MM-DD")));
			}
			setData(
				group(data, (v) => moment(v.sch_start_date).format("YYYY-MM-DD")).get(
					moment(data[0].sch_start_date).format("YYYY-MM-DD")
				)
			);
			setDefaultData(data);
			let dateSet = group(data, (v) => moment(v.sch_start_date).format("YYYY-MM-DD"));
			let dateObj = {};
			Array.from(dateSet.keys()).forEach((v) => {
				dateObj = { ...dateObj };
				Object.defineProperty(dateObj, v, {
					value: [],
					configurable: true,
					enumerable: true,
				});
				Array.from(group(dateSet.get(`${v}`), (v) => v.std_for_lang).keys()).forEach(
					(value) => {
						dateObj[`${v}`].push(value);
					}
				);
			});

			setDates(dateObj);
			setPending(false);
		});
	}, []);

	useEffect(() => {
		if (defaultData) {
			setData(
				group(defaultData, (v) => moment(v.sch_start_date).format("YYYY-MM-DD")).get(
					selectedDate
				)
			);
			document.getElementsByName("tabview").forEach((v) => v.classList.remove("on"));
			document.getElementById("allView").className = "on";
		}
	}, [selectedDate]);

	const handleClick = (e) => {
		document.getElementsByName("tabview").forEach((v) => v.classList.remove("on"));
		e.target.classList.add("on");
		if (e.target.innerText !== "전체") {
			setData(
				group(
					group(defaultData, (v) => moment(v.sch_start_date).format("YYYY-MM-DD")).get(
						selectedDate
					),
					(v) => v.std_for_lang
				).get(e.target.innerText)
			);
		} else {
			setData(
				group(defaultData, (v) => moment(v.sch_start_date).format("YYYY-MM-DD")).get(
					selectedDate
				)
			);
		}
	};

	return (
		<>
			{!pending ? (
				<div className="wrap">
					{calset ? <Loader /> : <Calendar dates={dates} selectedDate={selectedDate} />}
					<ul className="sch_tab" style={{ cursor: "pointer" }}>
						<li>
							<div id="allView" name="tabview" className="on" onClick={handleClick}>
								전체
							</div>
						</li>
						<li>
							<div name="tabview" className="eng" onClick={handleClick}>
								영어
							</div>
						</li>
						<li>
							<div name="tabview" className="jp" onClick={handleClick}>
								일본어
							</div>
						</li>
						<li>
							<div name="tabview" className="ch" onClick={handleClick}>
								중국어
							</div>
						</li>
					</ul>
					<div className="reservation_boxs tab_wrap">
						{data && data.length > 0 ? (
							data.map((v) => (
								<div
									className={
										"box" +
										(v.std_for_lang === "영어"
											? " puple"
											: v.std_for_lang === "중국어"
											? " pink"
											: " blue")
									}
									onClick={() => {
										v.sch_res_available && history.push(`schedule/${v.sch_id}`);
									}}
									style={v.sch_res_available && { cursor: "pointer" }}
								>
									<ul>
										<li>
											[{v.std_for_lang}] {v.std_for_name}
										</li>
										<li
											className={
												v.std_for_lang === "영어"
													? "eng"
													: v.std_for_lang === "중국어"
													? "cn"
													: "jp"
											}
										>
											{`${
												moment(v.sch_start_date).format("m") === "0"
													? moment(v.sch_start_date).format("M월 D일 h시")
													: moment(v.sch_start_date).format(
															"M월 D일 h시 m분"
													  )
											} ~ ${
												moment(v.sch_end_date).format("m") === "0"
													? moment(v.sch_end_date).format("M월 D일 h시")
													: moment(v.sch_end_date).format(
															"M월 D일 h시 m분"
													  )
											}`}
										</li>
									</ul>
									<div>
										{v.sch_res_available ? "예약 가능" : "예약 불가"}{" "}
										<span>{v.std_res_count}</span>
									</div>
								</div>
							))
						) : (
							<div className="box">
								<p className="no_data">데이터가 없습니다.</p>
							</div>
						)}
					</div>
				</div>
			) : (
				<Loader />
			)}
		</>
	);
}
