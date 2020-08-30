import React, { useEffect, useState } from "react";
import conf from "conf/conf";

import useModal from "../../../../modules/hooks/useModal";
import Modal from "../../../../components/common/modal/Modal";
import ForeignerContact from "../../../../components/common/modal/ForeignerContact";
import InsertForeignerStudent from "../../../../components/common/modal/InsertForeignerStudent";
// import {
// 	getAdminForeignerWork,
// 	getAdminSection,
// 	getAdminForeignerAccountFavorite,
// 	patchAdminForeignerAccount,
// } from "../../../../modules/hooks/useAxios";

import {
	getAdminForeignerAccountFavorite,
	getAdminForeignerWork,
	patchAdminForeignerAccount,
} from "../../../../api/admin/foreigner";
import { getAdminSection } from "../../../../api/admin/section";
import { useSelector } from "react-redux";
import { selectDept } from "../../../../redux/confSlice/confSlice";
import moment from "moment";
import SetSectForeigner from "../../../../components/common/modal/SetSectForeigner";
import { useHistory, useParams } from "react-router-dom";

let i = 1601214;
let j = 0;

/**
 * Manager :: 유학생 관리
 * @returns {JSX.Element}
 * @constructor
 * @todo sorting
 */
export default function Foreigner() {
	let mockup = {
		sort: null,
		data: [
			{
				std_for_lang: conf.language.ENGLISH,
				country: "미국",
				favorite: false,
				std_id: i++,
				name: "Emma Stone",
				dept: conf.shortDepartment[1],
				curruntMonth: 120,
				lastMonth: 150,
				thePastMonth: 560,
				count: j++,
				delay: 0,
				check: false,
			},
		],
	};
	const history = useHistory();
	const params = useParams();

	const [loading, setLoading] = useState(true);
	const [dataSet, setDataSet] = useState();
	const [data, setData] = useState(mockup.data);
	const [sectOfYear, setSectOfYear] = useState();
	const [selectSect, setSelectSect] = useState();
	const [monthArray, setMonthArray] = useState();
	const [pending, setPending] = useState(false);
	const {
		isOpen: contactIsOpen,
		handleOpen: handleOpenForContact,
		handleClose: handleCloseForContact,
	} = useModal();
	const {
		isOpen: addIsOpen,
		handleOpen: handleOpenForAdd,
		handleClose: handleCloseForAdd,
	} = useModal();
	const {
		isOpen: resetIsOpen,
		handleOpen: handleOpenForReset,
		handleClose: handleCloseForReset,
	} = useModal();
	const deptList = useSelector(selectDept);

	function handleCheckAll() {
		let flag = true;
		return function () {
			data.forEach((v) => {
				document.getElementById(v.std_id).checked = flag;
				v.check = flag;
			});
			flag = !flag;
		};
	}
	const reRender = () => {
		getAdminSection(`${moment().format("YYYY")}`).then((res) => setSectOfYear(res.data));
	};
	const handleChange = (e) => {
		setSelectSect(e.target.value);
	};

	useEffect(() => {
		getAdminSection(`${moment().format("YYYY")}`).then((res) => setSectOfYear(res.data));
	}, []);
	useEffect(() => {
		if (sectOfYear) {
			getAdminForeignerWork(sectOfYear.data[0].sect_id).then((res) => setDataSet(res.data));
			setSelectSect(sectOfYear.data[0].sect_id);
		}
	}, [sectOfYear]);

	/** @todo 7-8-9 월 표시 하다 말았슴 */
	useEffect(() => {
		setLoading(true);
		getAdminForeignerWork(selectSect).then((res) => setDataSet(res.data));
	}, [selectSect]);

	useEffect(() => {
		if (dataSet && dataSet.hasOwnProperty("data")) {
			setLoading(false);
			setData({ ...dataSet });
		}
	}, [dataSet]);
	useEffect(() => {
		if (!setLoading) {
			console.log(dataSet);
			if (dataSet && dataSet.time) {
				let array = [];
				let i = moment(dataSet.time.sect_start_date);
				console.log(
					selectSect,
					moment(dataSet.time.sect_start_date).format("YYYY-MM-DD"),
					moment(dataSet.time.sect_ent_date).format("YYYY-MM-DD")
				);
				while (i.diff(moment(dataSet.time.sect_ent_data), "M") !== 0) {
					console.log(i.add(1, "m"), moment(dataSet.time.sect_ent_data));
					moment(dataSet.time.sect_end_date).diff(i);
					i.add(1, "M");

					console.log(i);
					array.push(`${i.format("MM")}월`);
				}

				setMonthArray(array);
			}
		}
	});
	useEffect(() => {
		window.easydropdown.all();
		console.log(dataSet);
	});

	const returnDept = (deptId, deptList) => {
		let returnValue = "";
		if (Array.isArray(deptList)) {
			deptList.forEach((v) => {
				if (v.dept_id === deptId) {
					returnValue = v.dept_name[0];
				}
			});
		}
		return returnValue;
	};

	const sort = (sortBy) => {
		setData([]); // reset
		if (mockup.sort === sortBy) {
			setData(mockup.data.sort((a, b) => (a[sortBy] > b[sortBy] ? -1 : 1)));
			mockup.sort = null;
		} else {
			setData(mockup.data.sort((a, b) => (a[sortBy] < b[sortBy] ? -1 : 1)));
			mockup.sort = sortBy;
		}
	};

	return sectOfYear ? (
		<div>
			<div className="content">
				<div className="sub_title">
					<div className="top_semester">
						<p className="tit">유학생 관리</p>
						<select name="catgo" className="dropdown" onChange={handleChange}>
							{sectOfYear &&
								sectOfYear.data &&
								sectOfYear.data.map((v) => {
									return <option value={v.sect_id}>{v.sect_name}</option>;
								})}
						</select>
					</div>

					<div className="top_search">
						<select name="catgo" className="dropdown">
							<option>이름</option>
							<option>학번</option>
							<option>연락처</option>
						</select>
						<input type="text" />
						<input type="submit" value="검색" />
					</div>
				</div>
				<div className="wrap">
					{!loading ? (
						dataSet &&
						dataSet.data &&
						dataSet.data.length > 0 && (
							<div className="scroll_area">
								<table className="student_manage_table">
									<colgroup>
										<col width="5%" />
										<col width="7%" span="3" />
										<col width="7%" />
										<col width="13%" />
										<col width="7%" />
									</colgroup>
									<thead>
										<tr>
											<th rowSpan="2">
												<div className="table_check">
													<input
														type="checkbox"
														id="a1"
														name=""
														onClick={handleCheckAll()}
													/>
													<label htmlFor="a1"></label>
												</div>
											</th>
											<th
												rowSpan="2"
												className="align"
												onClick={() => {
													sort("language");
												}}
											>
												언어{" "}
												<img
													src="/global/img/table_align_arrow.gif"
													alt="언어 기준 정렬"
												/>
											</th>
											<th
												rowSpan="2"
												className="align"
												onClick={() => {
													sort("country");
												}}
											>
												국가명{" "}
												<img
													src="/global/img/table_align_arrow.gif"
													alt="국가명 기준 정렬"
												/>
											</th>
											<th
												rowSpan="2"
												className="align"
												onClick={() => {
													sort("favorite");
												}}
											>
												즐겨찾기{" "}
												<img
													src="/global/img/table_align_arrow.gif"
													alt="즐겨찾기 기준 정렬"
												/>
											</th>
											<th colSpan="3">유학생 정보</th>
											<th
												colSpan={
													dataSet && dataSet.data
														? Object.keys(dataSet.data[0].work_time)
																.length + 1
														: 5
												}
											>
												활동시간
											</th>
											<th rowSpan="2" className="align">
												예약 미승인
												<br />
												횟수
												<img
													src="/global/img/table_align_arrow.gif"
													alt="예약 미승인 횟수 기준 정렬"
												/>
											</th>
											<th rowSpan="2" className="align">
												결과 지연
												<br />
												입력 횟수
												<img
													src="/global/img/table_align_arrow.gif"
													alt="결과 지연 입력 횟수 기준 정렬"
												/>
											</th>
										</tr>
										<tr>
											<th>학번</th>
											<th>이름</th>
											<th
												rowSpan="2"
												className="align"
												onClick={() => {
													sort("dept");
												}}
											>
												계열학과
												<img
													src="/global/img/table_align_arrow.gif"
													alt="계열학과 기준 정렬"
												/>
											</th>
											<th rowSpan="2" className="align">
												합계
												<img
													src="/global/img/table_align_arrow.gif"
													alt="합계 기준 정렬"
												/>
											</th>

											{!loading &&
												dataSet &&
												dataSet.data &&
												dataSet.data.length > 0 &&
												dataSet.data[0].work_time &&
												Object.keys(dataSet.data[0].work_time).map((v) => (
													<th rowSpan="2" className="align">
														{v}
														<img
															src="/global/img/table_align_arrow.gif"
															alt={`${v} 기준 정렬`}
														/>
													</th>
												))}
										</tr>
									</thead>
									<tbody>
										{dataSet.data.map((value, index) => {
											let toggle = value.std_for_state_of_favorite
												? true
												: false;
											return (function () {
												return (
													<tr
														className={
															value.std_for_lang ===
															conf.language.ENGLISH
																? "eng"
																: value.std_for_lang ===
																  conf.language.JAPANESE
																? "jp"
																: "ch"
														}
														key={value.std_for_id}
													>
														<td>
															<div className="table_check">
																<input
																	type="checkbox"
																	id={value.std_for_id}
																	name=""
																	ref={value.ref}
																	onClick={() => {
																		if (value.check) {
																			value.check = false;
																		} else {
																			value.check = true;
																		}
																	}}
																/>
																<label
																	htmlFor={value.std_for_id}
																></label>
															</div>
														</td>
														<td>{value.std_for_lang}</td>
														<td>{value.std_for_country}</td>
														<td>
															<div
																id={`parent_fav_${value.std_for_id}`}
																className="favor"
																onClick={(e) => {
																	getAdminForeignerAccountFavorite(
																		value.std_for_id,
																		toggle ? 0 : 1
																	);
																	toggle = !toggle;
																	let parent = document.getElementById(
																		`parent_fav_${value.std_for_id}`
																	);
																	let item = document.getElementById(
																		`fav_${value.std_for_id}`
																	);
																	item.parentNode.removeChild(
																		item
																	);
																	let btn = document.createElement(
																		"img"
																	);
																	btn.id = `fav_${value.std_for_id}`;
																	btn.src = toggle
																		? "/global/img/favor_on.png"
																		: "/global/img/favor_off.png";
																	parent.appendChild(btn);
																}}
															>
																{toggle ? (
																	<img
																		id={`fav_${value.std_for_id}`}
																		src="/global/img/favor_on.png"
																		alt="즐겨찾기 on"
																	/>
																) : (
																	<img
																		id={`fav_${value.std_for_id}`}
																		src="/global/img/favor_off.png"
																		alt="즐겨찾기 off"
																	/>
																)}
															</div>
														</td>
														<td>{value.std_for_id}</td>
														<td
															onMouseOver={() => {
																document.getElementById(
																	`hover_btn_${index}`
																).className = "hover_btn";
															}}
															onMouseOut={() => {
																document.getElementById(
																	`hover_btn_${index}`
																).className = "hover_off";
															}}
														>
															{value.std_for_name}
															<div
																id={`hover_btn_${index}`}
																className="hover_btn hover_off"
															>
																<div className="area">
																	<div
																		className="navy"
																		onClick={() => {
																			patchAdminForeignerAccount(
																				value.std_for_id
																			).then((res) =>
																				setPending(true)
																			);
																			handleOpenForReset();
																		}}
																	>
																		비밀번호 초기화
																	</div>
																	<div className="lightGray">
																		삭제
																	</div>
																</div>
															</div>
														</td>
														<td>
															{returnDept(
																value.std_for_dept,
																deptList
															)}
														</td>
														<td>
															{(() => {
																let sum = 0;
																Object.values(value.work_time).map(
																	(v) => (sum += v)
																);
																return sum;
															})()}
															분
														</td>
														{Object.values(value.work_time).map((v) => {
															return <td>{v}분</td>;
														})}
														<td>
															{value.std_for_num_of_delay_permission}
														</td>
														<td>
															{value.std_for_num_of_delay_input}회
														</td>
													</tr>
												);
											})();
										})}
									</tbody>
								</table>
							</div>
						)
					) : (
						<>데이터가 없습니다.</>
					)}

					<div className="table_btn">
						<div onClick={handleOpenForContact}>연락처 정보</div>
						<Modal isOpen={contactIsOpen} handleClose={handleCloseForContact}>
							<ForeignerContact list={{}} handleClose={handleCloseForContact} />
						</Modal>
						<div onClick={handleOpenForAdd}>등록</div>
						<div
							onClick={() => {
								if (dataSet.data && dataSet.data.length > 0) {
									history.push(
										`/section/${selectSect}/${dataSet.data[0].std_for_id}`,
										{ ...setData }
									);
								} else {
									alert("해당 학기에 등록 된 학생이 없습니다.");
								}
							}}
						>
							학기 스케줄 등록
						</div>
					</div>
					<Modal isOpen={addIsOpen} handleClose={handleCloseForAdd}>
						{/* <InsertForeignerStudent handleClose={handleCloseForAdd} /> */}
						<SetSectForeigner sect_id={selectSect} handleClose={handleCloseForAdd} />
					</Modal>
					<Modal isOpen={resetIsOpen} handleClose={handleCloseForReset}>
						{pending && (
							<Reset
								handleCloseForReset={handleCloseForReset}
								setPending={setPending}
								reRender={reRender}
							/>
						)}
					</Modal>
				</div>
			</div>
		</div>
	) : (
		<></>
	);
}

function Reset({ handleCloseForReset, reRender, setPending }) {
	useEffect(() => {
		return reRender;
	}, []);
	return (
		<>
			<h1>비밀번호 초기화가 완료되었습니다.</h1>
			<button
				onClick={() => {
					handleCloseForReset();
					setPending(false);
				}}
			>
				확인
			</button>
		</>
	);
}
