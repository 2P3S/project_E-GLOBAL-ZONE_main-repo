import React, { useEffect, useState } from "react";
import { deleteAdminScheduleSome } from "../../../api/admin/schedule";
// import { deleteAdminScheduleSome } from "../../../modules/hooks/useAxios";

export default function DeleteSchedule({
	sch_id,
	std_for_name,
	sch_start_date,
	handleClose,
	reRender,
}) {
	const [pending, setPending] = useState(false);
	useEffect(() => {
		return reRender;
	}, []);
	useEffect(() => {
		pending && handleClose();
	}, [pending]);
	return (
		<>
			<div className="modal_notice">
				<p>
					<span className="name">{std_for_name}</span>학생의
					<br />
					<span className="date">{sch_start_date}</span>
					일정을 삭제하시겠습니까?
				</p>
				{/* <button
					onClick={() => {
						// deleteAdminScheduleSome(sch_id, setPending);
						deleteAdminScheduleSome(sch_id).then((res) => {
							setPending(true);
						});
					}}
				>
					삭제
				</button> */}
			</div>
		</>
	);
}
