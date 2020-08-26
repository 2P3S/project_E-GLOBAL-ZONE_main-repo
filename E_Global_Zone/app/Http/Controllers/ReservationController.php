<?php

namespace App\Http\Controllers;

use App\Library\Services\Preference;
use App\Reservation;
use App\Schedule;
use App\Setting;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
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
    private const _STD_KOR_RES_STORE_DUPLICATE = "이미 예약한 스케줄입니다.";
    private const _STD_KOR_RES_STORE_IMPOSSIBILITY = "예약 불가능한 스케줄입니다.";
    private const _STD_KOR_RES_STORE_SUCCESS = "일 스케줄 예약이 성공하였습니다.";
    private const _STD_KOR_RES_STORE_FAILURE = "스케줄 예약에 실패하였습니다.";

    private const _STD_KOR_RES_INDEX_FAILURE = "스케줄 예약 목록 조회에 실패하였습니다.";

    private const _STD_KOR_RES_DELETE_SUCCESS = "예약한 스케줄이 삭제되었습니다.";
    private const _STD_KOR_RES_DELETE_FAILURE = "예약한 스케줄 삭제에 실패하였습니다.";

    private const _STD_KOR_RESULT_SUCCESS = " 학기별 미팅 목록 조회에 성공하였습니다.";
    private const _STD_KOR_RESULT_FAILURE = " 학기별 미팅 목록 조회에 실패하였습니다.";

    private const _STD_FOR_RES_UPDATE_SUCCESS = "스케줄 예약 학생 승인결과 업데이트를 성공하였습니다.";
    private const _STD_FOR_RES_UPDATE_FAILURE = "스케줄 예약 학생 승인결과 업데이트에 실패하였습니다.";

    private const _STD_FOR_RES_INDEX_FAILURE = "스케줄에 대한 예약 목록이 없습니다.";
    private const _STD_FOR_RES_RESULT_FAILURE = "스케줄 출석 결과 입력에 실패하였습니다.";
    private const _STD_FOR_RES_RESULT_COMPLETED = "이미 결과 입력이 완료되어 수정 불가능합니다.";


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
    public function std_kor_destroy_res(Reservation $res_id): JsonResponse
    {
        try {
            $res_id->delete();
        } catch (Exception $e) {
            return
                self::response_json(self::_STD_KOR_RES_DELETE_FAILURE, 202);
        }

        return
            self::response_json(self::_STD_KOR_RES_DELETE_SUCCESS, 200);
    }

    /**
     * 유학생 - 해당 스케줄 신청 학생 명단 조회
     *
     * @param Schedule $sch_id
     * @return JsonResponse
     */
    public function std_for_show_res_by_id(
        Request $request,
        Schedule $sch_id
    ): JsonResponse {
        // TODO validation, 토큰 -> 유학생 검사 추가(중요)
        // $std_for_id = $request->user($request->input('guard'));
        $std_for_id = $request->std_for_id;

        // <<-- 스케줄에 대한 예약 학생 명단 조회
        return $this->schedule->get_sch_res_std_kor_list($sch_id, 'sch_std_for', $std_for_id, true);
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

        // TODO std_kor_id 미들웨어로 부터 받아오기
        // $std_kor_id = $request->user($request['guard'])['std_kor_id'];
        $std_kor_id = $request->std_kor_id;

        // <<-- 기존 예약 횟수 및 하루 최대 예약 횟수 비교
        $std_kor_res_list = $this->reservation->get_std_kor_res_by_today([$std_kor_id]);
        $is_over_max_res_per_day = $std_kor_res_list->count() >= $setting_value->max_res_per_day;

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
     * 한국인학생 - 해당 일자에 대한 예약 조회
     * api/korean/reservation
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function std_kor_show_res_by_date(Request $request): JsonResponse
    {
        $rules = [
            'search_date' => 'required|date|after or equal:' . date("Y-m-d")
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

        // TODO (CASE 1) 토큰으로 한국인 학생 정보 확인 -> 학번 조회 (CASE 2) 구글 로그인 리다이렉션으로 한국인 학생 정보 확인 -> email 조회
        // $std_kor_id = $request->user($request['guard'])['std_kor_id'];

        // <<-- 날짜로 한국인 학생 예약 내역 조회, 반환
        $std_kor_id = $request->std_kor_id;
        $search_date = $request->input('search_date');

        return $this->reservation->get_std_kor_res_by_date($std_kor_id, $search_date);
        // -->>
    }

    /**
     * 한국인학생 - 학기별 미팅 목록 결과 조회
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function std_kor_show_res_by_sect(Request $request): JsonResponse
    {
        //TODO std_kor_id 미들웨어로 처리하기
        $rules = [
            'sect_id' => 'required|integer|distinct|min:0|max:999',
            'search_month' => 'required|integer|distinct|min:1|max:12',
            'std_kor_id' => 'required|integer'
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

        $sect_by_reservations = Reservation::select('res_id', 'std_for_name', 'sch_start_date', 'sch_end_date')
            ->join('schedules', 'res_sch', 'sch_id')
            ->join('student_foreigners as for', 'schedules.sch_std_for', 'for.std_for_id')
            ->where('schedules.sch_sect', $request->sect_id)
            ->where('res_std_kor', $request->std_kor_id)
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
        $rules = [
            'std_kor_id' => 'required|integer|distinct|min:1000000|max:9999999',
        ];

        // <<-- Request 유효성 검사
        $validated_result = self::request_validator(
            $request,
            $rules,
            self::_STD_KOR_RES_STORE_FAILURE
        );

        if (is_object($validated_result)) {
            return $validated_result;
        }

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
}
