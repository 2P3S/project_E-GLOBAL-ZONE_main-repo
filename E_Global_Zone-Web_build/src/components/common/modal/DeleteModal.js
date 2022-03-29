import React, { useEffect } from "react";

export default function DeleteModal({ onSubmit, onCancel, handleReRender, message }) {
	useEffect(() => {
		return handleReRender;
	}, []);
	return (
		<div className="del_modal">
			{message ? <h1>{message}</h1> : <h1>[경고]삭제 하시겠습니까?</h1>}
			<button onClick={onSubmit} className="ok">
				확인
			</button>
			{/* <button onClick={onCancel} >취소</button> */}
		</div>
	);
}
