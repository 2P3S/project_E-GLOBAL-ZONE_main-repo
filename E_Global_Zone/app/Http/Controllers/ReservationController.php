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
use Illuminate\Support\Facades\Storage;

class ReservationController extends Controller
{
    /*
     * [Refactoring]
     * TODO RESPONSE 수정
     * TODO validator 수정
     *
     * == 누락 API ==
     * TODO 접근 가능 범위 수정
     * TODO 관리자가 예약 신청, 승인
     */
    private const _STD_KOR_RES_STORE_OVER = "1일 최대 스케줄 예약 횟수를 초과하였습니다.";
    private const _STD_KOR_RES_STORE_SAME_TIME = "같은 시간대의 스케줄은 예약이 불가능합니다.";
    private const _STD_KOR_RES_STORE_OVER_PEOPLE = "해당 스케줄은 정원 초과로 예약에 실패하였습니다.";
    private const _STD_KOR_RES_STORE_DUPLICATE = "이미 예약한 스케줄입니다.";
    private const _STD_KOR_RES_STORE_IMPOSSIBILITY = "예약 불가능한 스케줄입니다.";
    private const _STD_KOR_RES_STORE_SUCCESS = "일 스케줄 예약이 성공하였습니다.";
    private const _STD_KOR_RES_STORE_FAILURE = "스케줄 예약에 실패하였습니다.";

    private const _STD_KOR_RES_INDEX_FAILURE = "스케줄 예약 목록 조회에 실패하였습니다.";

    private const _STD_KOR_RES_DELETE_SUCCESS = "예약한 스케줄이 삭제되었습니다.";
    private const _STD_KOR_RES_DELETE_FAILURE = "예약한 스케줄 삭제에 실패하였습니다.";
    private const _STD_KOR_RES_DELETE_OVER_DATE = "예약 취소 가능 일자를 초과했습니다.";

    private const _STD_KOR_RESULT_SUCCESS = " 학기별 미팅 목록 조회에 성공하였습니다.";
    private const _STD_KOR_RESULT_FAILURE = " 학기별 미팅 목록 조회에 실패하였습니다.";

    private const _STD_FOR_RES_UPDATE_SUCCESS = "스케줄 예약 학생 승인결과 업데이트를 성공하였습니다.";
    private const _STD_FOR_RES_UPDATE_FAILURE = "스케줄 예약 학생 승인결과 업데이트에 실패하였습니다.";

    private const _STD_FOR_RES_INDEX_FAILURE = "스케줄에 대한 예약 목록이 없습니다.";
    private const _STD_FOR_RES_RESULT_FAILURE = "스케줄 출석 결과 입력에 실패하였습니다.";
    private const _STD_FOR_RES_RESULT_COMPLETED = "이미 결과 입력이 완료되어 수정 불가능합니다.";

    private const _STD_KOR_RES_INDEX_SUCCESS = "예약한 스케줄 조회에 성공하였습니다. ";


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
                self::response_json_error(self::_STD_KOR_RES_DELETE_FAILURE);

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
                self::response_json_error(self::_STD_KOR_RES_DELETE_OVER_DATE);
        } else {
            $res_id->delete();

            return self::response_json(self::_STD_KOR_RES_DELETE_SUCCESS, 200);
        }
    }

    /**
     * 유학생 - 해당 스케줄 신청 학생 명단 조회
     *
     * @param Schedule $sch_id
     * @return JsonResponse
     */
    public function std_for_show_res_by_id(
        Schedule $sch_id
    ): JsonResponse {
        $std_for_id = $sch_id['sch_std_for'];

        // <<-- 스케줄에 대한 예약 학생 명단 조회
        return $this->schedule->get_sch_res_std_kor_list($sch_id, 'sch_std_for', (int) $std_for_id, true);
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
            self::_STD_FOR_RES_UPDATE_FAILURE
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

        return self::response_json(self::_STD_FOR_RES_UPDATE_SUCCESS, 200);
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
        // <<-- 기존 결과 입력 여부 확인
        $sch_state_of_result_input = $sch_id['sch_state_of_result_input'];

        if ($sch_state_of_result_input) {
            return
                self::response_json(self::_STD_FOR_RES_RESULT_COMPLETED, 202);
        }
        // -->>

        // <<-- 스케줄에 대한 예약 존재 여부 확인
        $is_sch_no_res = $this->schedule->get_sch_res_std_kor_list($sch_id) === null;
        if ($is_sch_no_res) {
            return
                self::response_json(self::_STD_FOR_RES_INDEX_FAILURE, 202);
        }
        // -->>

        // dismensions 속성 잠시 제거..
        // dimensions:min_width=900,min_height=900|max:2000
        $rules = [
            'result_start_img' => 'required|image',
            'result_end_img' => 'required|image',
            'attendance_std_kor_id_list' => 'nullable|array',
            'attendance_std_kor_id_list.*' => 'integer|distinct|min:1000000|max:9999999',
            'absent_std_kor_id_list' => 'nullable|array',
            'absent_std_kor_id_list.*' => 'integer|distinct|min:1000000|max:9999999'
        ];

        // <<-- Request 유효성 검사
        $validated_result = self::request_validator(
            $request,
            $rules,
            self::_STD_FOR_RES_RESULT_FAILURE
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

        // <<-- 스케줄 결과 입력 결과 업데이트
        $sch_id->update(['sch_state_of_result_input' => true]);
        // -->>

        // 이미지 저장 후 결과 반환
        return
            SchedulesResultImgController::store_result_img(
                $sch_id,
                $request->file('result_start_img'),
                $request->file('result_end_img')
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
                self::response_json(self::_STD_KOR_RES_STORE_IMPOSSIBILITY, 202);
        }
        // -->>

        $std_kor_id = $request->input('std_kor_info')['std_kor_id'];

        // <<-- 해당 스케줄 정원 최대 예약 가능 횟수 비교
        $std_kor_res_count = Reservation::where('res_sch', $sch_id['sch_id'])->count();
        $is_over_max_std_once = $std_kor_res_count >= $setting_value->max_std_once;

        if ($is_over_max_std_once) {
            return
                self::response_json(self::_STD_KOR_RES_STORE_OVER_PEOPLE, 202);
        }
        // -->>

        // <<-- 기존 예약 횟수 및 하루 최대 예약 횟수 비교
        $std_kor_res = $this->reservation->get_std_kor_res_by_today([$std_kor_id]);

        // 동시간대 예약등록 여부 파악.
        $res_start_time = strtotime($sch_id['sch_start_date']);

        foreach ($std_kor_res as $res) {
            if (strtotime($res['sch_start_date']) == $res_start_time) {
                return
                    self::response_json(self::_STD_KOR_RES_STORE_SAME_TIME, 202);
            }
        }

        // 최대 예약 횟수가 넘어간 경우
        $count_of_reservation = $this->reservation->get_std_kor_res_by_date($std_kor_id, $sch_id['sch_start_date'])->get()->count();
        $is_over_max_res_per_day = $count_of_reservation >= $setting_value->max_res_per_day;

        if ($is_over_max_res_per_day) {
            return
                self::response_json(self::_STD_KOR_RES_STORE_OVER, 202);
        }
        // -->>

        // <<-- 예약 중복 여부 검사
        $is_already_res = $this->reservation->check_already_res(
            $sch_id['sch_id'],
            $std_kor_id
        );

        if ($is_already_res) return self::response_json(self::_STD_KOR_RES_STORE_DUPLICATE, 202);
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

        return self::response_json($schedule_date . self::_STD_KOR_RES_STORE_SUCCESS, 201, $created_res);
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
            self::_STD_KOR_RES_INDEX_FAILURE
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

        $msg                = $sect_id['sect_name'] . "학기의 랭킹을 반환합니다.";
        $search_data        = $sect_by_reservations->where('res_std_kor', $std_kor_id);

        $has_no_reservation = $search_data->count() == 0;

        if ($has_no_reservation)
            return response()->json([
                'message' => $msg,
                'data' => 0,
            ], 200);

        $number_of_student       = $sect_by_reservations->count();
        $number_of_rank_by_sect  = $search_data->keys()->first() + 1;

        $rank_by_percent_formula = (int) ($number_of_rank_by_sect / $number_of_student * 100);


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
            self::_STD_KOR_RESULT_FAILURE
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

        return self::response_json(self::_STD_KOR_RESULT_SUCCESS, 200, $sect_by_reservations);
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
            self::_STD_KOR_RES_STORE_FAILURE
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

        if ($is_already_res) return self::response_json(self::_STD_KOR_RES_STORE_DUPLICATE, 202);
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

        return self::response_json($schedule_date . self::_STD_KOR_RES_STORE_SUCCESS, 201, $created_res);
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
            return self::response_json_error(self::_STD_KOR_RES_DELETE_FAILURE);
        }

        return self::response_json(self::_STD_KOR_RES_DELETE_SUCCESS, 200);
    }
}
