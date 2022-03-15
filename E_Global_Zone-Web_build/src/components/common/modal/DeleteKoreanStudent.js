import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { getAdminKorean, deleteAdminKoreanAccount, postAdminKorean } from "../../../api/admin/korean";
import { handleEnterKey } from "../../../modules/handleEnterKey";
import { selectDept } from "../../../redux/confSlice/confSlice";
import Loader from "../Loader";

const DeleteKoreanStudent = ({ reRender, handleClose }) => {
	const dept = useSelector(selectDept);
	const termRef = useRef(null);
	const observerRef = useRef(null);
	const [isLoading, setIsLoading] = useState(false);
	const [hasMore, setHasMore] = useState(false);
	const [pageNum, setPageNum] = useState(1);
	const [korList, setKorList] = useState([]);
	const [currentInfo, setCurrentInfo] = useState();
	const [defaultList, setDefaultList] = useState([]);
	const [searchMode, setSearchMode] = useState("std_kor_name");
	const [isSearching, setIsSearching] = useState(false);

	const handleSearch = (e) => {
		const column_data = termRef.current.value;
		if (column_data.trim() === '') {
			setIsSearching(false)
			setKorList(defaultList);
		} else {
			setIsSearching(true);
			postAdminKorean({ column: searchMode, column_data }).then((res) => {
				setKorList(res.data.data)
			});
		}
	};

	const handleChange = (e) => {
		setCurrentInfo(korList.find(v => v.std_kor_id == e.target.value))
	}

	const handleDelete = () => {
		const idConfirmed = window.confirm(`[경고] ${currentInfo.std_kor_name} 학생의 계정을 정말로 삭제하시겠습니까? 관련된 모든 정보가 삭제됩니다.`)

		if (idConfirmed) {
			deleteAdminKoreanAccount(currentInfo.std_kor_id).then(() => {
				alert(`${currentInfo.std_kor_name} 학생의 계정이 삭제되었습니다.`)
				handleClose()
			})
				.catch((err) => {
					console.error(err)
				})
		}
	}

	const getAllUsers = (page) => {
		setIsLoading(true)
		getAdminKorean({ page, orderby: 'std_kor_dept' }).then((res) => {
			const response = res.data.data
			setKorList((prev) => [...prev, ...response.data]);
			setDefaultList((prev) => [...prev, ...response.data]);
			setHasMore(response.next_page_url)
			setIsLoading(false)
		});
	}

	const findDeptName = (std_kor_dept) => {
		if (!dept) return;
		return dept.find(dept => dept.dept_id === std_kor_dept)?.dept_name[1];
	}

	const observer = (node) => {
		if (isLoading || isSearching) return;
		if (observerRef.current) observerRef.current.disconnect();
		observerRef.current = new IntersectionObserver(([entry]) => {
			if (entry.isIntersecting && hasMore) {
				getAllUsers(pageNum + 1)
				setPageNum((page) => page + 1)
			}
		})

		node && observerRef.current.observe(node)
	}

	useEffect(() => {
		window.easydropdown.all();
		getAllUsers(1)
		return reRender
	}, []);

	return (
		<div className="popup regist">
			<p className="tit">한국인 학생 계정 삭제</p>
			{
				currentInfo && (
					<table className="pop_table">
						<colgroup>
							<col width="20%" span="1" />
							<col width="10%" span="1" />
							<col width="8%" span="1" />
							<col width="17%" span="1" />
							<col width="20%" span="1" />
						</colgroup>
						<thead>
							<tr>
								<th scope="col">계열학과</th>
								<th scope="col">학번</th>
								<th scope="col">이름</th>
								<th scope="col">연락처</th>
								<th scope="col">G Suite 계정</th>
								<th scope="col">이용제한</th>
								<th scope="col">삭제</th>
							</tr>
						</thead>
						<tbody>
							<tr>
								<td>{findDeptName(currentInfo.std_kor_dept)}</td>
								<td>{currentInfo.std_kor_id}</td>
								<td>{currentInfo.std_kor_name}</td>
								<td>{currentInfo.std_kor_phone}</td>
								<td>{currentInfo.std_kor_mail}</td>
								<td>{
									currentInfo.std_kor_state_of_restriction
										?
										<img
											src="/global/img/restriction_on.png"
											alt="이용제한"
										/>
										:
										<img
											src="/global/img/restriction_off.png"
											alt="이용제한"
										/>
								}</td>
								<td>
									<img
										onClick={handleDelete}
										src="/global/img/delete_ico.gif"
										style={{ cursor: "pointer" }}
									/>
								</td>
							</tr>
						</tbody>
					</table>
				)
			}

			<div className="top_search">
				<div className="search_box">
					<select
						name="catgo"
						className="dropdown"
						onChange={(e) => {
							console.log(e.target.value);
							setSearchMode(e.target.value);
						}}
					>
						<option value="std_kor_name">이름</option>
						<option value="std_kor_id">학번</option>
					</select>
					<input onKeyUp={(e) => handleEnterKey(e, handleSearch)} type="text" ref={termRef} />
					{/* <input type="submit" value="검색" onClick={handleSearch} />
					<input type="text" id="term" /> */}
					<button onClick={handleSearch}>검색</button>
				</div>
			</div>

			<div className="scroll_area mt20">
				<table className="pop_table">
					<colgroup>
						<col width="5%" span="1" />
						<col width="25%" span="1" />
						<col width="10%" span="1" />
						<col width="8%" span="1" />
						<col width="17%" span="1" />
						<col width="20%" span="1" />
					</colgroup>
					<thead>
						<tr>
							<th scope="col"></th>
							<th scope="col">계열학과</th>
							<th scope="col">학번</th>
							<th scope="col">이름</th>
							<th scope="col">연락처</th>
							<th scope="col">G Suite 계정</th>
							<th scope="col">이용제한</th>
						</tr>
					</thead>
					<tbody>
						{
							korList &&
							korList.map((v) => (
								<tr key={v.std_kor_id}>
									<td>
										<div className="table_check">
											<input
												type="checkbox"
												id={v.std_kor_id + "_delete"}
												value={v.std_kor_id}
												key={v.std_kor_id}
												onChange={handleChange}
												checked={currentInfo?.std_kor_id === v.std_kor_id}
											/>
											<label htmlFor={v.std_kor_id + "_delete"}></label>
										</div>
									</td>
									<td>{findDeptName(v.std_kor_dept)}</td>
									<td>{v.std_kor_id}</td>
									<td>{v.std_kor_name}</td>
									<td>{v.std_kor_phone}</td>
									<td>{v.std_kor_mail}</td>
									<td>{
										v.std_kor_state_of_restriction
											?
											<img
												src="/global/img/restriction_on.png"
												alt="이용제한"
											/>
											:
											<img
												src="/global/img/restriction_off.png"
												alt="이용제한"
											/>
									}</td>
								</tr>
							))}
					</tbody>
				</table>
				<div ref={observer} />
				{isLoading && <Loader />}
			</div>
		</div>
	);
}

export default DeleteKoreanStudent