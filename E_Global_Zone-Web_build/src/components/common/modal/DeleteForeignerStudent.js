import React, { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { getAdminForeignerAll, deleteAdminForeignerAccount, postAdminForeignerSearch } from "../../../api/admin/foreigner";
import { handleEnterKey } from "../../../modules/handleEnterKey";
import { selectDept } from "../../../redux/confSlice/confSlice";
import Loader from "../Loader";

const DeleteForeignerStudent = ({ reRender, handleClose }) => {
	const dept = useSelector(selectDept);
	const termRef = useRef(null);
	const observerRef = useRef(null);
	const [isLoading, setIsLoading] = useState(false);
	const [hasMore, setHasMore] = useState(false);
	const [pageNum, setPageNum] = useState(1);
	const [forList, setForList] = useState([]);
	const [currentInfo, setCurrentInfo] = useState();
	const [defaultList, setDefaultList] = useState([]);
	const [searchMode, setSearchMode] = useState("std_for_name");
	const [isSearching, setIsSearching] = useState(false);

	const handleSearch = (e) => {
		const column_data = termRef.current.value;
		if (column_data.trim() === '') {
			setIsSearching(false);
			setForList(defaultList);
		} else {
			setIsSearching(true);
			postAdminForeignerSearch({ column: searchMode, column_data }).then((res) => {
				setForList(res.data.data);
			});
		}
	};

	const handleChange = (e) => {
		setCurrentInfo(forList.find(v => v.std_for_id == e.target.value));
	}

	const handleDelete = () => {
		const idConfirmed = window.confirm(`[경고] ${currentInfo.std_for_name} 학생의 계정을 정말로 삭제하시겠습니까? 관련된 모든 정보가 삭제됩니다.`)

		if (idConfirmed) {
			deleteAdminForeignerAccount(currentInfo.std_for_id).then(() => {
				alert(`${currentInfo.std_for_name} 학생의 계정이 삭제되었습니다.`);
				handleClose();
			})
				.catch((err) => {
					console.error(err);
				});
		}
	}

	const getAllUsers = (page) => {
		setIsLoading(true)
		getAdminForeignerAll({ page }).then((res) => {
			const response = res.data.data
			setForList((prev) => [...prev, ...response.data]);
			setDefaultList((prev) => [...prev, ...response.data]);
			setHasMore(response.next_page_url);
			setIsLoading(false);
		});
	}

	const findDeptName = (std_for_dept) => {
		if (!dept) return;
		return dept.find(dept => dept.dept_id === std_for_dept)?.dept_name[1];
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
			<p className="tit">유학생 계정 삭제</p>
			{
				currentInfo && (
					<table className="pop_table">
						<colgroup>
							<col width="6%" span="2" />
							<col width="8%" span="1" />
							<col width="10%" span="1" />
							<col width="20%" span="1" />
						</colgroup>
						<thead>
							<tr>
								<th scope="col">언어</th>
								<th scope="col">국가</th>
								<th scope="col">학번</th>
								<th scope="col">이름</th>
								<th scope="col">계열학과</th>
								<th scope="col">연락처</th>
								<th scope="col">이메일</th>
								<th scope="col">ZoomID</th>
								<th scope='col'>삭제</th>
							</tr>
						</thead>
						<tbody>
							<tr>
								<td>{currentInfo.std_for_lang}</td>
								<td>{currentInfo.std_for_country}</td>
								<td>{currentInfo.std_for_id}</td>
								<td>{currentInfo.std_for_name}</td>
								<td>{findDeptName(currentInfo.std_for_dept)}</td>
								<td>{currentInfo.contact.std_for_phone}</td>
								<td>{currentInfo.contact.std_for_mail}</td>
								<td>{currentInfo.contact.std_for_zoom_id}</td>
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
						<option value="std_for_name">이름</option>
						<option value="std_for_id">학번</option>
					</select>
					<input onKeyUp={(e) => handleEnterKey(e, handleSearch)} type="text" ref={termRef} />
					<button onClick={handleSearch}>검색</button>
				</div>
			</div>

			<div className="scroll_area mt20">
				<table className="pop_table">
					<colgroup>
						<col width="5%" span="1" />
						<col width="6%" span="2" />
						<col width="8%" span="1" />
						<col width="10%" span="1" />
						<col width="20%" span="1" />
					</colgroup>
					<thead>
						<tr>
							<th scope="col"></th>
							<th scope="col">언어</th>
							<th scope="col">국가</th>
							<th scope="col">학번</th>
							<th scope="col">이름</th>
							<th scope="col">계열학과</th>
							<th scope="col">연락처</th>
							<th scope="col">이메일</th>
							<th scope="col">ZoomID</th>
						</tr>
					</thead>
					<tbody>
						{
							forList &&
							forList.map((v) => (
								<tr key={v.std_for_id}>
									<td>
										<div className="table_check">
											<input
												type="checkbox"
												id={v.std_for_id + "_delete"}
												value={v.std_for_id}
												key={v.std_for_id}
												onChange={handleChange}
												checked={currentInfo?.std_for_id === v.std_for_id}
											/>
											<label htmlFor={v.std_for_id + "_delete"}></label>
										</div>
									</td>
									<td>{v.std_for_lang}</td>
									<td>{v.std_for_country}</td>
									<td>{v.std_for_id}</td>
									<td>{v.std_for_name}</td>
									<td>{findDeptName(v.std_for_dept)}</td>
									<td>{v.contact.std_for_phone}</td>
									<td>{v.contact.std_for_mail}</td>
									<td>{v.contact.std_for_zoom_id}</td>
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

export default DeleteForeignerStudent