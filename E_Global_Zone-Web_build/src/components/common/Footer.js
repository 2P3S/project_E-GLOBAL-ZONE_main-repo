import React from "react";

/**
 * Footer for Web
 * @returns {JSX.Element}
 * @constructor
 */
export default function Footer() {
	return (
		<div className="footer">
			<div className="footer_area">
				<p className="copyright">
					대표전화 053-940-511441527 대구광역시 북구 복현로 35 (복현2동 218)
					영진전문대학교
					<span>COPYRIGHT© YEUNGJIN UNIVERSITY. All RIGHTS RESERVED.</span>
					<span></span>
					CONTRIBUTORS : LEEGUSEUL, LEEJAEWON, JUNGJAESOON, CHOSEUNGHYUN
				</p>
				<div className="family_site">
					<select name="catgo" className="dropdown">
						<option value="/kr/index.do">관련사이트</option>
						<option value="https://www.yju.ac.kr">영진전문대학교 국문홈페이지</option>
						<option value="https://www.yju.ac.kr/en">
							영진전문대학교 영문홈페이지
						</option>
						<option value="https://www.yju.ac.kr/cn">
							영진전문대학교 중문홈페이지
						</option>
						<option value="https://www.yju.ac.kr/jp">
							영진전문대학교 일문홈페이지
						</option>
						<option value="https://ipsi.yju.ac.kr">영진전문대학교 입학홈페이지</option>
						<option value="http://iacf.yju.ac.kr">영진전문대학교 산학협력단</option>
						<option value="http://job.yju.ac.kr">
							영진전문대학교 종합인력개발센터
						</option>
						<option value="https://jobcenter.yju.ac.kr">대학일자리센터</option>
						<option value="https://welfare.yju.ac.kr">장애학생지원센터</option>
						<option value="https://counseling.yju.ac.kr/">학생상담실</option>
						<option value="http://iac.yju.ac.kr">국제교류원</option>
						<option value="https://ctl.yju.ac.kr">교수학습지원센터</option>
						<option value="http://www.yjservice.or.kr">
							영진전문대학교 사회봉사단
						</option>
						<option value="https://dguav.yju.ac.kr">대구경북무인항공전문교육원</option>
						<option value="http://www.ycc.ac.kr">영진사이버대학교</option>
						<option value="https://child.yju.ac.kr">영진전문대학교 부설 유치원</option>
						<option value="http://yel.yju.ac.kr">YEL</option>
						<option value="/kr/index.do">----- 부설기관 ------</option>
						<option value="https://www.dgev.ac.kr">대구경북영어마을</option>
						<option value="https://edu.yju.ac.kr">평생교육원</option>
						<option value="/kr/index.do">----- 부속기관 -----</option>
						<option value="https://itcenter.yju.ac.kr"> IT 지원센터</option>
						<option value="http://lib.yju.ac.kr">영진전문대학교 도서관</option>
						<option value="https://rntc.yju.ac.kr/">영진전문대학교 학군단</option>
						<option value="/kr/index.do">----- 계열/학과-----</option>
						<option value="http://computer.yju.ac.kr">컴퓨터정보계열</option>
						<option value="https://mech.yju.ac.kr">컴퓨터응용기계계열</option>
						<option value="https://infocom.yju.ac.kr">ICT반도체전자계열</option>
						<option value="https://elec.yju.ac.kr">신재생에너지전기계열</option>
						<option value="https://archi.yju.ac.kr">건축인테리어디자인계열</option>
						<option value="https://business.yju.ac.kr">경영회계서비스계열</option>
						<option value="https://tour.yju.ac.kr">글로벌호텔항공관광계열</option>
						<option value="https://nco.yju.ac.kr">부사관계열</option>
						<option value="https://design.yju.ac.kr">콘텐츠디자인과</option>
						<option value="http://drone.yju.ac.kr">드론항공전자과</option>
						<option value="http://bokji.yju.ac.kr">사회복지과</option>
						<option value="https://ece.yju.ac.kr">유아교육과</option>
						<option value="https://nursing.yju.ac.kr">간호학과</option>
					</select>
				</div>
			</div>
		</div>
	);
}
