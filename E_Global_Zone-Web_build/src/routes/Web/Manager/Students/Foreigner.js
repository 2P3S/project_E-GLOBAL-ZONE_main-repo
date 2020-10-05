import React, { useEffect, useState } from "react";
import d3 from "d3-array";
import conf from "conf/conf";
import useModal from "../../../../modules/hooks/useModal";
import Modal from "../../../../components/common/modal/Modal";
import ForeignerContact from "../../../../components/common/modal/ForeignerContact";
import InsertForeignerStudent from "../../../../components/common/modal/InsertForeignerStudent";
import ModifyForeignerStudent from "../../../../components/common/modal/ModifyForeignerStudent";
import {
	getAdminForeigner,
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
import CreateSchedule from "../../../../components/common/modal/CreateSchedule";
import Loader from "../../../../components/common/Loader";
import { getAdminExportForeignerSect } from "../../../../api/admin/export";

let i = 1601214;
let j = 0;

/**
 * Manager :: 유학생 관리
 * @returns {JSX.Element}
 * @constructor
 * @todo sorting
 */
export default function Foreigner() {
	const history = useHistory();
	const params = useParams();

	const [loading, setLoading] = useState(true);
	const [dataSet, setDataSet] = useState();
	const [isSearchMode, setIsSearchMode] = useState(false);
	const [searchFor, setSearchFor] = useState("std_for_name");
	const [defaultData, setDefaultData] = useState();
	const [sectOfYear, setSectOfYear] = useState();
	const [selectYear, setSelectYear] = useState(moment().format("YYYY"));
	const [selectSect, setSelectSect] = useState();
	const [selectSectName, setSelectSectName] = useState();
	const [monthArray, setMonthArray] = useState();
	const [contactList, setContactList] = useState([]);
	const [pending, setPending] = useState(false);
	const [toggle, setToggle] = useState(true);
	const [index, setIndex] = useState();
	const [modifyInfo, setModifyInfo] = useState();
	const [yearChange, setYearChange] = useState(false);

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
	const {
		isOpen: createIsOpen,
		handleClose: handleCloseForCreate,
		handleOpen: handleOpenForCreate,
	} = useModal();
	const {
		isOpen: isOpenForModify,
		handleClose: handleCloseForModify,
		handleOpen: handleOpenForModify,
	} = useModal();

	const deptList = useSelector(selectDept);

	function handleCheckAll(e) {
		dataSet.data.forEach((v) => {
			document.getElementById(v.std_for_id).checked = e.target.checked;
		});
	}
	const reRender = () => {
		getAdminForeignerWork(selectSect).then((res) => {
			res.data.hasOwnProperty("data") &&
				res.data.data.forEach((v) => {
					let total = 0;
					Object.keys(v["work_time"]).forEach((m) => {
						total += v["work_time"][`${m}`];
					});
					Object.defineProperty(v["work_time"], "total", { value: total });
				});
			setDataSet(res.data);
			setDefaultData(res.data);
		});
	};
	const handleChange = (e) => {
		setSelectSect(e.target.value);
		Array.from(e.target.options).forEach((v) => {
			v.value === e.target.value && setSelectSectName(v.id);
		});
	};

	const handleSearch = (e) => {
		let term = document.getElementById("term").value;
		let searchData = [];
		setIsSearchMode(true);
		if (searchFor) {
			defaultData.data.forEach((v) => {
				switch (searchFor) {
					case "std_for_name":
						if (v.std_for_name.match(term)) {
							searchData.push(v);
						}
						break;
					case "std_for_id":
						if (v.std_for_id.toString().match(term)) {
							searchData.push(v);
						}
						break;

					default:
						break;
				}
			});
		}

		setDataSet({ ...dataSet, data: searchData });
	};

	useEffect(() => {
		getAdminSection({ year: `${moment().format("YYYY")}` }).then((res) => {
			setSectOfYear(res.data);
			let index = 0;
			res.data.data.forEach((v, i) => {
				if (
					moment(Date.now()).isBetween(moment(v.sect_start_date), moment(v.sect_end_date))
				) {
					index = i;
				}
			});

			history.push(`/students/${res.data.data[index].sect_id}/foreigner`);
			setIndex(index);
		});
	}, []);
	useEffect(() => {
		setYearChange(true);
		getAdminSection({
			year: `${moment(`${selectYear}-01-01`, "YYYY-MM-DD").format("YYYY")}`,
		}).then((res) => {
			const { data } = res;
			if (data.data.length === 0) {
				alert("해당년도에 학기가 없습니다.");
			} else {
				setSectOfYear(res.data);
				let index = 0;
				history.push(`/students/${res.data.data[index].sect_id}/foreigner`);
				setIndex(index);
			}
		});
	}, [selectYear]);

	useEffect(() => {
		if (index !== undefined && sectOfYear && sectOfYear.data) {
			setSelectSect(sectOfYear.data[index].sect_id);
			setSelectSectName(sectOfYear.data[index].sect_name);
		}
	}, [sectOfYear, index]);

	useEffect(() => {
		setYearChange(false);
		window.easydropdown.all();
		//easydropdown 에러 잡아야함
	}, [sectOfYear]);

	/** @todo 7-8-9 월 표시 하다 말았슴 */
	useEffect(() => {
		setLoading(true);
		selectSect &&
			getAdminForeignerWork(selectSect).then((res) => {
				res.data.hasOwnProperty("data") &&
					res.data.data.forEach((v) => {
						let total = 0;
						Object.keys(v["work_time"]).forEach((m) => {
							total += v["work_time"][`${m}`];
						});
						Object.defineProperty(v["work_time"], "total", { value: total });
					});
				setDataSet(res.data);
				setDefaultData(res.data);
			});

		// history.push(`/students/${selectSect}/foreigner`);
	}, [selectSect]);

	useEffect(() => {
		if (dataSet) {
			setLoading(false);
		}
	}, [dataSet]);

	useEffect(() => {
		if (!setLoading) {
			if (dataSet && dataSet.time) {
				let array = [];
				let i = moment(dataSet.time.sect_start_date);

				while (i.diff(moment(dataSet.time.sect_ent_data), "M") !== 0) {
					moment(dataSet.time.sect_end_date).diff(i);
					i.add(1, "M");

					array.push(`${i.format("MM")}월`);
				}

				setMonthArray(array);
			}
		}
	});
	useEffect(() => {
		window.easydropdown.all();
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

	const sort = (sortBy, isMonth = false) => {
		setDataSet({ ...dataSet, data: [] }); // reset
		if (isMonth) {
			if (toggle) {
				setDataSet({
					...dataSet,
					data: defaultData.data.sort((a, b) =>
						a["work_time"][sortBy] > b["work_time"][sortBy] ? -1 : 1
					),
				});
				// mockup.sort = null;
			} else {
				setDataSet({
					...dataSet,
					data: defaultData.data.sort((a, b) =>
						a["work_time"][sortBy] > b["work_time"][sortBy] ? 1 : -1
					),
				});
			}
		} else {
			if (toggle) {
				setDataSet({
					...dataSet,
					data: defaultData.data.sort((a, b) => (a[sortBy] > b[sortBy] ? -1 : 1)),
				});
				// mockup.sort = null;
			} else {
				setDataSet({
					...dataSet,
					data: defaultData.data.sort((a, b) => (a[sortBy] > b[sortBy] ? 1 : -1)),
				});
			}
		}
		setToggle(!toggle);
	};

	const handleYearChange = () => {
		const year = document.getElementById("year").value;
		try {
			moment(year + "-01-01", "YYYY-MM-DD");
		} catch (error) {
			alert("error");
		}
		// setSelectYear("2021");
	};
	return sectOfYear ? (
		<div>
			<div className="content">
				<div className="sub_title">
					<div className="top_semester">
						<p className="tit">교수진 관리</p>
						<p
							className="tit"
							style={{ marginLeft: "40px", cursor: "pointer" }}
							onClick={() => {
								setSelectYear(parseInt(selectYear) - 1);
							}}
						>
							<img src="/global/img/calender_arrow_prev.gif" />
						</p>
						<p
							className="tit"
							style={{ marginLeft: "10px", marginTop: "3px", fontSize: "14px" }}
						>
							{selectYear}학년도
						</p>
						<p
							className="tit"
							style={{ marginLeft: "10px", cursor: "pointer" }}
							onClick={() => {
								setSelectYear(parseInt(selectYear) + 1);
							}}
						>
							<img src="/global/img/calender_arrow_next.gif" />
						</p>
						{yearChange ? (
							<></>
						) : (
							<div>
								<select name="" className="" onChange={handleChange}>
									{sectOfYear &&
										sectOfYear.data &&
										sectOfYear.data.map((v, i) => {
											console.log(sectOfYear.data);
											return (
												<option
													value={v.sect_id}
													id={v.sect_name}
													selected={index === i || i === 0}
												>
													{v.sect_name}
												</option>
											);
										})}
								</select>
							</div>
						)}
					</div>

					<div className="top_search">
						<select
							name="catgo"
							className="dropdown"
							onChange={(e) => {
								setSearchFor(e.target.value);
							}}
						>
							<option value="std_for_name">이름</option>
							<option value="std_for_id">학번</option>
						</select>
						<input type="text" id="term" onChange={handleSearch} />
						<input type="submit" value="검색" onClick={handleSearch} />
					</div>
				</div>
				<div className="wrap">
					{!loading ? (
						dataSet && dataSet.data && dataSet.data.length > 0 ? (
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
										{/* 총원:{dataSet.data.length} */}
										<tr>
											<th rowSpan="2">
												<div className="table_check">
													<input
														type="checkbox"
														id="a1"
														name=""
														onClick={handleCheckAll}
													/>
													<label htmlFor="a1"></label>
												</div>
											</th>
											<th
												rowSpan="2"
												className="align"
												onClick={() => {
													sort("std_for_lang");
												}}
											>
												<input
													type="hidden"
													id="std_for_lang"
													value={false}
												/>
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
													sort("std_for_country");
												}}
											>
												<input
													type="hidden"
													id="std_for_country"
													value={false}
												/>
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
													sort("std_for_state_of_favorite");
												}}
											>
												<input
													type="hidden"
													id="std_for_state_of_favorite"
													value={false}
												/>
												즐겨찾기{" "}
												<img
													src="/global/img/table_align_arrow.gif"
													alt="즐겨찾기 기준 정렬"
												/>
											</th>
											<th colSpan="3">교수진 정보</th>
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
											<th
												rowSpan="2"
												className="align"
												onClick={() =>
													sort("std_for_num_of_delay_permission")
												}
											>
												<input
													type="hidden"
													id="std_for_num_of_delay_permission"
													value={false}
												/>
												예약 미승인
												<br />
												횟수
												<img
													src="/global/img/table_align_arrow.gif"
													alt="예약 미승인 횟수 기준 정렬"
												/>
											</th>
											<th
												rowSpan="2"
												className="align"
												onClick={() => sort("std_for_num_of_delay_input")}
											>
												<input
													type="hidden"
													id="std_for_num_of_delay_input"
													value={false}
												/>
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
											<th>ID</th>
											<th>이름</th>
											<th
												rowSpan="2"
												className="align"
												onClick={() => {
													sort("std_for_dept");
												}}
											>
												<input
													type="hidden"
													id="std_for_dept"
													value={false}
												/>
												계열학과
												<img
													src="/global/img/table_align_arrow.gif"
													alt="계열학과 기준 정렬"
												/>
											</th>
											<th
												rowSpan="2"
												className="align"
												onClick={() => {
													sort("total", true);
												}}
											>
												{/* <input type="hidden" id="" value={false}/> */}
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
													<th
														rowSpan="2"
														className="align"
														onClick={() => {
															sort(`${v}`, true);
														}}
													>
														<input
															type="hidden"
															id={`${v}`}
															value={false}
														/>
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
										{dataSet &&
											dataSet.data &&
											dataSet.data.map((value, index) => {
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
																className="name"
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
																				if (
																					window.confirm(
																						"비밀번호를 초기화 시키겠습니까?"
																					) === true
																				) {
																					patchAdminForeignerAccount(
																						value.std_for_id
																					).then(
																						(res) => {
																							setPending(
																								true
																							);
																							alert(
																								res
																									.data
																									.message
																							);
																						}
																					);
																				}
																				// handleOpenForReset();
																			}}
																		>
																			비밀번호 초기화
																		</div>
																		<div
																			className="lightGray"
																			onClick={() => {
																				getAdminForeigner({
																					foreigners: [
																						value.std_for_id,
																					],
																				}).then((res) => {
																					let obj = {
																						...value,
																						...res.data
																							.data[0],
																					};
																					setModifyInfo(
																						obj
																					);
																					handleOpenForModify();
																				});
																			}}
																		>
																			수정
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
															<td>{value.work_time.total * 60}분</td>
															{Object.values(value.work_time).map(
																(v) => {
																	return <td>{v * 60}분</td>;
																}
															)}
															<td>
																{
																	value.std_for_num_of_delay_permission
																}
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
						) : (
							<>해당 학기에 등록 된 교수가 없습니다.</>
						)
					) : (
						<Loader />
					)}

					<div className="table_btn">
						<div
							onClick={() => {
								let arrayOfContact = [];
								dataSet.data.forEach((v) => {
									// if(isSearchMode){
									// 	document.getElementById(v.std_for_id).checked
									// }else{
									if (document.getElementById(v.std_for_id).checked) {
										arrayOfContact.push(v.std_for_id);
									}
									// }
								});
								setContactList(arrayOfContact);
								handleOpenForContact();
							}}
						>
							연락처 정보
						</div>
						<div onClick={handleOpenForAdd}>학기 교수 등록</div>
						{dataSet && moment(Date.now()).isAfter(dataSet.time.sect_start_date) ? (
							<></>
						) : (
							<div
								onClick={() => {
									if (dataSet.data && dataSet.data.length > 0) {
										history.push(`/section/${selectSect}/${0}`);
									} else {
										alert("해당 학기에 등록 된 학생이 없습니다.");
									}
								}}
							>
								학기 스케줄 등록
							</div>
						)}
						<div onClick={handleOpenForCreate}>스케줄 개별 입력</div>
						<div
							onClick={() => {
								getAdminExportForeignerSect(selectSect, selectSectName);
							}}
						>
							학기 교수진 목록 저장
						</div>
					</div>
					<Modal isOpen={addIsOpen} handleClose={handleCloseForAdd}>
						{/* <InsertForeignerStudent handleClose={handleCloseForAdd} /> */}
						<SetSectForeigner
							sect_id={selectSect}
							sect_name={selectSectName}
							handleClose={handleCloseForAdd}
							reRender={reRender}
						/>
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
					<Modal isOpen={createIsOpen} handleClose={handleCloseForCreate}>
						<CreateSchedule
							reRender={reRender}
							sect_id={selectSect}
							handleClose={handleCloseForCreate}
							std_for_list={dataSet && dataSet.data && dataSet.data}
						/>
					</Modal>
					<Modal isOpen={contactIsOpen} handleClose={handleCloseForContact}>
						<ForeignerContact list={contactList} handleClose={handleCloseForContact} />
					</Modal>
					<Modal isOpen={isOpenForModify} handleClose={handleCloseForModify}>
						<ModifyForeignerStudent currentInfo={modifyInfo} reRender={reRender} />
					</Modal>
				</div>
			</div>
		</div>
	) : (
		<Loader />
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
