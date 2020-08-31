import React from "react";

export default function ResetPassword() {
	return (
		<div className="content">
			<div className="ch_passwd_wrap">
				<div className="sub_title">
					<p className="tit">비밀번호 변경</p>
				</div>
				<div className="input_area">
					<input type="text" placeholder="Password" />
					<input type="text" placeholder="Password 확인" />
					<p className="info">
						<span>8글자 이상, 대문자, 소문자, 숫자</span>를 반드시 포함해 주십시오.
					</p>

					<button>비밀번호 변경</button>
				</div>
			</div>
		</div>
	);
}
