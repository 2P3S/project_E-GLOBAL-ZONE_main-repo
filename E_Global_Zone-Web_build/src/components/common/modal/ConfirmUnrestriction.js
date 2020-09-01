import React, { useEffect, useState } from "react";
import useClick from "../../../modules/hooks/useClick";
import { patchAdminKoreanRestrict } from "../../../api/admin/korean";

/**
 * Modal - 이용 제한 헤제
 * @param handleClose
 * @returns {JSX.Element}
 * @constructor
 */
const ConfirmUnrestriction = ({
	std_kor_id,
	std_kor_name,
	std_stricted_info,
	handleClose,
	reRender,
}) => {
	const [pending, setPending] = useState(false);
	useEffect(() => {
		return reRender;
	}, []);
	useEffect(() => {
		if (pending) {
			handleClose();
		}
	}, [pending]);

	const handleClick = () => {
		patchAdminKoreanRestrict(std_stricted_info.restrict_id).then((res) => {
			setPending(true);
			alert(res.message);
		});
	};

	return (
		<div className="popup restriction">
			<p className="tit">이용 제한 해제</p>
			<p className="txt">
				{std_kor_name} 학생의 <span>이용 제한</span>을 해제하시겠습니까?
			</p>
			<p>
				{std_stricted_info.restrict_start_date} ~ {std_stricted_info.restrict_end_date}
			</p>
			<textarea
				name=""
				id=""
				cols="20"
				rows="4"
				readOnly
				defaultValue={std_stricted_info.restrict_reason}
			/>

			<div className="btn_area">
				<div className="bbtn mint" onClick={handleClick}>
					해제
				</div>
				<div className="bbtn darkGray" ref={useClick(handleClose)}>
					닫기
				</div>
			</div>
		</div>
	);
};

export default ConfirmUnrestriction;
