import React from "react";

export default function AddScheduleStudent({ handleClose }) {
	return (
		<>
			<input type="text" placeholder="학생 이름 으로 검색 하기"></input>
			<input type="text" placeholder="학번 으로 검색 하기"></input>
			<button>검색</button>
			<div>
				<div>
					학생이름 <button>추가</button>
				</div>
				<div>
					학생이름 <button>추가</button>
				</div>
				<div>
					학생이름 <button>추가</button>
				</div>
				<div>
					학생이름 <button>추가</button>
				</div>
				<div>
					학생이름 <button>추가</button>
				</div>
			</div>
			<button onClick={handleClose}>취소</button>
		</>
	);
}
