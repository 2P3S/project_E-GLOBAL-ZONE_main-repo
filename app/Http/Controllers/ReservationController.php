<?php

namespace App\Http\Controllers;

use App\Library\Services\Preference;
use App\Reservation;
use App\Schedule;
use App\Section;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Config;

class ReservationController extends Controller
{
    private $schedule;
    private $reservation;

    public function __construct()
    {
        $this->schedule = new Schedule();
        $this->reservation = new Reservation();
    }

    /**
     * 한국인학생 - 내 예약 일정 삭제
     *
     * @param Reservation $res_id
     * @return JsonResponse
     * @throws Exception
     */
    public function std_kor_destroy_res(Request $request, Reservation $res_id, Preference $preference_instance): JsonResponse
    {

        // 해당 예약의 한국인 학생 인증.
        $std_kor_id = $request->input('std_kor_info')['std_kor_id'];

        $is_unauthenticated = $res_id['res_std_kor'] != $std_kor_id;

        if ($is_unauthenticated)
            return
                self::response_json_error(Config::get('constants.kor.reservation.destroy.failure'));

        // <<-- 환경변수 설정
        $setting_value = $preference_instance->getPreference();
        $res_start_period = $setting_value->res_start_period - 1;
        // -->>

        $schedule = $res_id->schedule;

        // <<-- 예약 취소 일자 비교
        $current_date_string = date("Y-m-d", time());
        $cancellable_date_string = date("Y-m-d", strtotime($schedule['sch_start_date']));

        $current_date = strtotime($current_date_string . "-{$res_start_period} day");
        $cancellable_date = strtotime($cancellable_date_string . "-{$res_start_period} day");

        $is_cancellable_date = $cancellable_date >= $current_date ? true : false;
        // -->>

        /**
         * 삭제 불가능한 조건.
         *
         * 1) 이미 진행중인 예약인 경우
         * 2) 종료된 예약인 경우
         * 3) 예약 취소 일자를 넘긴 경우
         */

        if (!$is_cancellable_date) {
            return
                self::response_json_error(Config::get('constants.kor.reservation.destroy.over_date'));
        } else {
            $res_id->delete();

            return self::response_json(Config::get('constants.kor.reservation.destroy.success'), 200);
        }
    }

    /**
     * 유학생 - 해당 스케줄 신청 학생 명단 조회
     *
     * @param Schedule $sch_id
     * @return JsonResponse
     */
    public function std_for_show_res_by_id(
        Schedule $sch_id,
        Request $request
    ): JsonResponse {
        $language = self::get_http_accept_language($request);

        $std_for_id = $sch_id['sch_std_for'];

        // <<-- 스케줄에 대한 예약 학생 명단 조회
        $res_std_kor_data = $this->schedule->get_sch_res_std_kor_list($sch_id, 'sch_std_for', (int)$std_for_id);

        $is_exist_sch_res = $res_std_kor_data->count();

        if (!$is_exist_sch_res) {
            return self::response_json(self::custom_msg($language, 'reservation.for_show_kor_list.failure'), 202);
        }

        return self::response_json(self::custom_msg($language, 'reservation.for_show_kor_list.success'), 200, $res_std_kor_data);
    }

    /**
     * 유학생 - 해당 스케줄 신청 학생 명단 승인
     *
     * @param Request $request
     * @param Schedule $sch_id
     * @return JsonResponse
     */
    public function std_for_update_res_permission(
        Request $request,
        Schedule $sch_id
    ): JsonResponse {
        $language = self::get_http_accept_language($request);

        $rules = [
            'permission_std_kor_id_list' => 'nullable|array',
            'permission_std_kor_id_list.*' => 'integer|distinct|min:1000000|max:9999999',
            'not_permission_std_kor_id_list' => 'nullable|array',
            'not_permission_std_kor_id_list.*' => 'integer|distinct|min:1000000|max:9999999'
        ];

        // <<-- Request 유효성 검사
        $validated_result = self::request_validator(
            $request,
            $rules,
            self::custom_msg($language, 'reservation.for_update_permission.failure')
        );

        if (is_object($validated_result)) {
            return $validated_result;
        }
        // -->>

        // <<-- 승인, 미승인 학생 업데이트
        $permission_std_kor_id_list = $request->input('permission_std_kor_id_list');
        $not_permission_std_kor_id_list = $request->input('not_permission_std_kor_id_list');

        $this->reservation->update_std_kor_res(
            $sch_id,
            $permission_std_kor_id_list,
            'res_state_of_permission',
            true
        );

        // 승인 -> 미승인 변경은 관리자만 가능.
        if ($request->input('guard') == "admin")
            $this->reservation->update_std_kor_res(
                $sch_id,
                $not_permission_std_kor_id_list,
                'res_state_of_permission',
                false
            );
        // -->>

        return self::response_json(
            self::custom_msg($language, 'reservation.for_update_permission.success'),
            200
        );
    }

    /**
     * 유학생 - 해당 스케줄 출석 결과 입력
     *
     * @param Request $request
     * @param Schedule $sch_id
     * @return JsonResponse
     */
    public function std_for_input_sch_result(
        Request $request,
        Schedule $sch_id
    ): JsonResponse {
        $language = self::get_http_accept_language($request);

        // <<-- 기존 결과 입력 여부 확인
        $sch_state_of_result_input = $sch_id['sch_state_of_result_input'];

        if ($sch_state_of_result_input) {
            return
                self::response_json(self::custom_msg($language, 'reservation.for_input_result.completed'), 202);
        }
        // -->>

        // <<-- 스케줄에 대한 예약 존재 여부 확인
        $is_sch_no_res = $this->schedule->get_sch_res_std_kor_list($sch_id) === null;
        if ($is_sch_no_res) {
            return
                self::response_json(self::custom_msg($language, 'reservation.for_index.failure'), 202);
        }
        // -->>

        $rules = [
            'result_start_img' => 'required|image|max:5000',
            'result_end_img' => 'required|image|max:5000',
            'attendance_std_kor_id_list' => 'nullable|array',
            'attendance_std_kor_id_list.*' => 'integer|distinct|min:1000000|max:9999999',
            'absent_std_kor_id_list' => 'nullable|array',
            'absent_std_kor_id_list.*' => 'integer|distinct|min:1000000|max:9999999'
        ];

        // <<-- Request 유효성 검사
        $validated_result = self::request_validator(
            $request,
            $rules,
            self::custom_msg($language, 'reservation.for_input_result.failure')
        );

        if (is_object($validated_result)) {
            return $validated_result;
        }
        // -->>

        // <<-- 출석, 결석 학생 업데이트
        if (!empty($attendance_std_kor_id_list = $request->input('attendance_std_kor_id_list'))) {
            $this->reservation->update_std_kor_res(
                $sch_id,
                $attendance_std_kor_id_list,
                'res_state_of_attendance',
                true
            );
        }

        if (!empty($absent_std_kor_id_list = $request->input('absent_std_kor_id_list'))) {
            $this->reservation->update_std_kor_res(
                $sch_id,
                $absent_std_kor_id_list,
                'res_state_of_attendance',
                false
            );
        }
        // -->>

        $sch_result_img = new SchedulesResultImgController($request);

        // 이미지 저장 후 결과 반환
        return
            $sch_result_img->store_result_img(
                $sch_id,
                $request->file('result_start_img'),
                $request->file('result_end_img'),
                $language
            );
    }

    /**
     * 한국인학생 - 예약 신청
     * /api/korean/reservation/{$sch_id}
     *
     * @param Request $request
     * @param Schedule $sch_id
     * @return JsonResponse
     */
    public function std_kor_store_res(
        Request $request,
        Schedule $sch_id,
        Preference $preference_instance
    ): JsonResponse {
        $setting_value = $preference_instance->getPreference();                         /* 환경설정 변수 */

        // <<-- 신청한 스케줄이 예약 신청 가능한지 확인(시작, 마감일 기준)
        $is_res_possibility = $this->schedule->check_res_possibility($sch_id);

        if (!$is_res_possibility) {
            return
                self::response_json(Config::get('constants.kor.reservation.kor_store.failure'), 202);
        }
        // -->>

        $std_kor_id = $request->input('std_kor_info')['std_kor_id'];

        // <<-- 해당 스케줄 정원 최대 예약 가능 횟수 비교
        $std_kor_res_count = Reservation::where('res_sch', $sch_id['sch_id'])->count();
        $is_over_max_std_once = $std_kor_res_count >= $setting_value->max_std_once;

        if ($is_over_max_std_once) {
            return
                self::response_json(Config::get('constants.kor.reservation.kor_store.over_people'), 202);
        }
        // -->>

        // <<-- 기존 예약 횟수 및 하루 최대 예약 횟수 비교
        $std_kor_res = $this->reservation->get_std_kor_res_by_today([$std_kor_id]);

        // 동시간대 예약등록 여부 파악.
        $res_start_time = strtotime($sch_id['sch_start_date']);

        foreach ($std_kor_res as $res) {
            if (strtotime($res['sch_start_date']) == $res_start_time) {
                return
                    self::response_json(Config::get('constants.kor.reservation.kor_store.same_time'), 202);
            }
        }

        // 최대 예약 횟수가 넘어간 경우
        $count_of_reservation = $this->reservation->get_std_kor_res_by_date($std_kor_id, $sch_id['sch_start_date'])->count();
        $is_over_max_res_per_day = $count_of_reservation >= $setting_value->max_res_per_day;

        if ($is_over_max_res_per_day) {
            return
                self::response_json(Config::get('constants.kor.reservation.kor_store.over_count'), 202);
        }
        // -->>

        // <<-- 예약 중복 여부 검사
        $is_already_res = $this->reservation->check_already_res(
            $sch_id['sch_id'],
            $std_kor_id
        );

        if ($is_already_res) return self::response_json(Config::get('constants.kor.reservation.kor_store.duplicate'), 202);
        // -->>

        // <<-- 예약 정보 저장
        $res_data = [
            'res_sch' => $sch_id['sch_id'],
            'res_std_kor' => $std_kor_id
        ];
        $created_res = $this->reservation->store_std_kor_res($res_data);
        // -->>

        $schedule_date = strtotime($sch_id['sch_start_date']);
        $schedule_date = date("Y-m-d", $schedule_date);

        return self::response_json($schedule_date . Config::get('constants.kor.reservation.kor_store.success'), 201, $created_res);
    }

    /**
     * 한국인학생 - 해당 일자에 대한 예약 조회 ( 미사용 )
     * api/korean/reservation
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function std_kor_show_res_by_date(Request $request): JsonResponse
    {
        $rules = [
            'search_date' => 'required|date'
        ];

        // <<-- Request 유효성 검사
        $validated_result = self::request_validator(
            $request,
            $rules,
            Config::get('constants.kor.reservation.kor_index.failure')
        );

        if (is_object($validated_result)) {
            return $validated_result;
        }
        // -->>

        // <<-- 날짜로 한국인 학생 예약 내역 조회, 반환
        $std_kor_id = $request->input('std_kor_info')['std_kor_id'];
        $search_date = $request->input('search_date');

        return $this->reservation->get_std_kor_res_by_date($std_kor_id, $search_date);
        // -->>
    }

    /**
     * 한국인학생 - 해당 날짜 기준 진행중인 예약 조회
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function std_kor_show_res_prgrs(Request $request): JsonResponse
    {
        $std_kor_id = $request->input('std_kor_info')['std_kor_id'];

        // 유학생 출석 결과 입력 여부가 안된 모든 예약 반환.
        return $this->reservation->get_std_kor_res_by_permission($std_kor_id);
    }

    /**
     * 한국인학생 - 해당 학기 랭킹 조회
     */
    public function std_kor_show_rank_by_sect(Section $sect_id, Request $request): JsonResponse
    {
        $std_kor_id = $request->input('std_kor_info')['std_kor_id'];

        $sect_by_reservations = Reservation::select('res_std_kor', DB::raw('count(*) as res_count'))
            ->join('schedules as sch', 'sch_id', 'res_sch')
            ->where('sch_sect', $sect_id['sect_id'])
            ->where('res_state_of_attendance', true)
            ->groupBy('res_std_kor')
            ->orderBy('res_count', 'DESC')
            ->get();

        $msg = $sect_id['sect_name'] . Config::get('constants.kor.reservation.kor_show_rank.success');
        $search_data = $sect_by_reservations->where('res_std_kor', $std_kor_id);

        $has_no_reservation = $search_data->count() == 0;

        if ($has_no_reservation)
            return response()->json([
                'message' => $msg,
                'data' => 0,
            ], 200);

        $number_of_student = $sect_by_reservations->count();
        $number_of_rank_by_sect = $search_data->keys()->first() + 1;

        $rank_by_percent_formula = (int)($number_of_rank_by_sect / $number_of_student * 100);


        return response()->json([
            'message' => $msg,
            'data' => $rank_by_percent_formula,
        ], 200);
    }

    /**
     * 한국인학생 - 학기별 미팅 목록 결과 조회
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function std_kor_show_res_by_sect(Request $request): JsonResponse
    {
        $rules = [
            'sect_id' => 'required|integer|distinct|min:0|max:999',
            'search_month' => 'required|integer|distinct|min:1|max:12',
        ];

        // <<-- Request 유효성 검사
        $validated_result = self::request_validator(
            $request,
            $rules,
            Config::get('constants.kor.reservation.kor_show_sect.failure')
        );

        if (is_object($validated_result)) {
            return $validated_result;
        }
        // -->>

        $std_kor_id = $request->input('std_kor_info')['std_kor_id'];

        $sect_by_reservations = Reservation::select('res_id', 'std_for_name', 'sch_start_date', 'sch_end_date')
            ->join('schedules', 'res_sch', 'sch_id')
            ->join('student_foreigners as for', 'schedules.sch_std_for', 'for.std_for_id')
            ->where('schedules.sch_sect', $request->sect_id)
            ->where('res_std_kor', $std_kor_id)
            ->whereMonth('schedules.sch_start_date', $request->search_month)
            ->where('res_state_of_attendance', true)
            ->get();

        return self::response_json(Config::get('constants.kor.reservation.kor_show_sect.success'), 200, $sect_by_reservations);
    }

    /**
     * 관리자 - 해당 스케줄 학생 추가.
     *
     * @param Schedule $sch_id
     * @param Request $request
     * @return JsonResponse
     */
    public function add_kor_schedule_by_admin(
        Request $request,
        Schedule $sch_id
    ): JsonResponse {
        // <<-- Request 유효성 검사
        $rules = [
            'std_kor_id' => 'required|integer|distinct|min:1000000|max:9999999',
            'guard' => 'required|string|in:admin'
        ];

        $validated_result = self::request_validator(
            $request,
            $rules,
            Config::get('constants.kor.reservation.admin_add_kor.failure')
        );

        if (is_object($validated_result)) {
            return $validated_result;
        }
        // -->>

        $std_kor_id = $request->std_kor_id;
        $schedule_id = $sch_id['sch_id'];

        // <<-- 예약 중복 여부 검사
        $is_already_res = $this->reservation->check_already_res(
            $schedule_id,
            $std_kor_id
        );

        if ($is_already_res) return self::response_json(Config::get('constants.kor.reservation.admin_add_kor.duplicate'), 202);
        // -->>

        // 예약 정보 저장
        $res_data = [
            'res_sch' => $schedule_id,
            'res_std_kor' => $std_kor_id,
            'res_state_of_permission' => true
        ];

        $created_res = $this->reservation->store_std_kor_res($res_data);

        $schedule_date = strtotime($sch_id['sch_start_date']);
        $schedule_date = date("Y-m-d", $schedule_date);

        return self::response_json($schedule_date . Config::get('constants.kor.reservation.admin_add_kor.success'), 201, $created_res);
    }

    /**
     * 관리자 - 해당 스케줄 학생 삭제.
     *
     * @param Reservation $res_id
     * @param Request $request
     * @return JsonResponse
     */
    public function destroy_kor_reservation_by_admin(
        Request $request,
        Reservation $res_id
    ): JsonResponse {
        // <<-- Request 요청 관리자 권한 검사.
        $is_admin = self::is_admin($request);

        if (is_object($is_admin)) {
            return $is_admin;
        }
        // -->>

        try {
            $res_id->delete();
        } catch (Exception $e) {
            return self::response_json_error(Config::get('constants.kor.reservation.destroy.failure'));
        }

        return self::response_json(Config::get('constants.kor.reservation.destroy.success'), 200);
    }
}
