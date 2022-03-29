/**
 * 스케줄 객체 생성을 위한 클래스
 * @class
 *
 * @property {int}  sch_id	스케줄 번호
 * @property {int}  sch_sect 스케줄 세션 번호
 * @property {int}  sch_std_for 스케줄 담당 유학생
 * @property {Date}  sch_start_date 스케줄 시작 시간
 * @property {Date}  sch_end_date 스케줄 종료 시간
 * @property {int}  sch_res_count 스케줄 예약 학생 수
 * @property {int}  sch_state_of_result_input 스캐ㅔ줄 결과 입력 상태
 * @property {int}  sch_state_of_permission 스케줄 결과 승인 상태
 * @property {string}  sch_for_zoom_pw 스케줄 zoom pw
 *
 */
class Schedule {
	sch_id;
	sch_sect;
	sch_std_for;
	sch_start_date;
	sch_end_date;
	sch_res_count;
	sch_state_of_result_input;
	sch_state_of_permission;
	sch_for_zoom_pw;

	constructor(sch_id, sch_sect, sch_std_for, sch_start_date, sch_end_date, sch_res_count, sch_state_of_result_input, sch_state_of_permission, sch_for_zoom_pw) {
		this.sch_id = sch_id;
		this.sch_sect = sch_sect;
		this.sch_std_for = sch_std_for;
		this.sch_start_date = sch_start_date;
		this.sch_end_date = sch_end_date;
		this.sch_res_count = sch_res_count;
		this.sch_state_of_result_input = sch_state_of_result_input;
		this.sch_state_of_permission = sch_state_of_permission;
		this.sch_for_zoom_pw = sch_for_zoom_pw;
	}
}
export default Schedule;
