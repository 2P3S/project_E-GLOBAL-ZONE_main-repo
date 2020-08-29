<?php

namespace App\Http\Controllers;

use App\Library\Services\Preference;
use App\Reservation;
use App\Restricted_student_korean;
use App\Schedule;
use App\SchedulesResultImg;
use App\Section;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ScheduleController extends Controller
{
    private const _SCHEDULE_SEARCH_RES_SUCCESS = " 일자 유학생 스케줄을 반환합니다.";
    private const _SCHEDULE_SEARCH_RES_FAILURE = " 일자 유학생 스케줄을 조회에 실패하였습니다.";

    private const _SCHEDULE_RES_STORE_SUCCESS = "스케줄 등록을 완료하였습니다.";

    private const _SCHEDULE_RES_DELETE_SUCCESS = "스케줄 삭제을 완료하였습니다.";
    private const _SCHEDULE_RES_DELETE_FAILURE = "해당 학기에 등록된 스케줄이 없습니다.";
    private const _SCHEDULE_RES_UPDATE_SUCCESS = "스케줄 변경를 완료하였습니다.";

    private const _STD_FOR_SHOW_SCH_SUCCESS = "스케줄 목록 조회에 성공하였습니다.";
    private const _STD_FOR_SHOW_SCH_NO_DATA = "등록된 스케줄이 없습니다.";
    private const _STD_FOR_SHOW_SCH_FAILURE = "스케줄 목록 조회에 실패하였습니다.";

    private const _SCHDEULE_RES_APPROVE_DUPLICATED = "이미 출석 승인된 완료된 스케줄입니다.";
    private const _SCHDEULE_RES_APPROVE_SUCCESS = "출석 결과 승인이 완료되었습니다.";
    private const _SCHDEULE_RES_APPROVE_FAILURE = "출석 결과 승인에 실패하였습니다.";

    private const _ZOOM_RAN_NUM_START   = 1000;
    private const _ZOOM_RAN_NUM_END     = 9999;


    private $schedule;
    private $resultImage;
    private $restrict;

    public function __construct()
    {
        $this->schedule = new Schedule();
        $this->resultImage = new SchedulesResultImg();
        $this->restrict = new Restricted_student_korean();
    }

    /**
     *  관리자 - 특정 날짜 전체 유학생 스케줄 조회
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function showForeignerSchedules(Request $request): JsonResponse
    {
        $rules = [
            'search_date' => 'required|date'
        ];

        // <<-- Request 유효성 검사
        $validated_result = self::request_validator(
            $request,
            $rules,
            self::_STD_FOR_SHOW_SCH_FAILURE
        );

        if (is_object($validated_result)) {
            return $validated_result;
        }
        // -->>

        $search_date = $request->search_date;

        function std_for_search_by_lang($date, $std_for_lang)
        {
            return
                Schedule::select('std_for_id', 'std_for_name', 'std_for_lang')
                ->join('student_foreigners as for', 'schedules.sch_std_for', '=', 'for.std_for_id')
                ->whereDate('sch_start_date', '=', $date)
                ->where('std_for_lang', $std_for_lang)
                ->groupBy('for.std_for_id')
                ->get();
        };

        function std_for_add_schedule_data($response_data, $date)
        {
            foreach ($response_data as $student) {
                $student['schedules'] = Schedule::select('sch_id', 'sch_start_date', 'sch_end_date', 'sch_for_zoom_pw', 'sch_state_of_result_input', 'sch_state_of_permission')
                    ->join('student_foreigners as for', 'schedules.sch_std_for', '=', 'std_for_id')
                    ->whereDate('sch_start_date', '=', $date)
                    ->where('std_for_id', $student->std_for_id)
                    ->get();

                foreach ($student['schedules'] as $schedule) {
                    $reservation_data = Schedule::join('reservations as res', 'schedules.sch_id', '=', 'res.res_sch');

                    // 전체 예약 한국인 인원수
                    $reservated_count = $reservation_data->where('res.res_sch', '=', $schedule->sch_id)->count();

                    // 예약 미승인 한국인 인원수
                    $un_permission_count = $reservation_data->where('res.res_state_of_permission', '=', false)->count();

                    $schedule['reservated_count'] = $reservated_count;
                    $schedule['un_permission_count'] = $un_permission_count;
                }
            }

            return $response_data;
        }

        $response_data = [];

        // 언어별 유학생 분류.
        $response_data['English'] = std_for_search_by_lang($search_date, '영어');
        $response_data['Japanese'] = std_for_search_by_lang($search_date, '일본어');
        $response_data['Chinese'] = std_for_search_by_lang($search_date, '중국어');

        // return response()->json([
        //     'message' => self::_STD_FOR_SHOW_SCH_SUCCESS,
        //     'result' => $response_data,
        // ], 200);

        // 해당 유학생에 대한 스케줄 정보 추가.
        $response_data['English'] = std_for_add_schedule_data($response_data['English'], $search_date);
        $response_data['Japanese'] = std_for_add_schedule_data($response_data['Japanese'], $search_date);
        $response_data['Chinese'] = std_for_add_schedule_data($response_data['Chinese'], $search_date);

        return response()->json([
            'message' => self::_STD_FOR_SHOW_SCH_SUCCESS,
            'data' => $response_data,
        ], 200);
    }

    /**
     *  유학생 - 특정 기간 전체 스케줄 조회
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function std_for_show_sch_by_date(Request $request): JsonResponse
    {
        // TODO std_for_id 미들웨어로 부터 받아오기.
        $rules = [
            'start_date' => 'required|date',
            'end_date' => 'required|date',
            'std_for_id' => 'required|integer'
        ];

        // <<-- Request 유효성 검사
        $validated_result = self::request_validator(
            $request,
            $rules,
            self::_STD_FOR_SHOW_SCH_FAILURE
        );

        if (is_object($validated_result)) {
            return $validated_result;
        }
        // -->>

        $result_foreigner_schedules = Schedule::select('std_for_id', 'sch_id', 'sch_start_date', 'sch_end_date', 'sch_for_zoom_pw', 'sch_state_of_result_input', 'sch_state_of_permission')
            ->join('student_foreigners as for', 'schedules.sch_std_for', '=', 'std_for_id')
            ->where('std_for_id', $request->std_for_id)
            ->whereDate('sch_start_date', '>=', $request->start_date)
            ->whereDate('sch_start_date', '<=', $request->end_date)
            ->orderBy('sch_start_date')
            ->get();

        foreach ($result_foreigner_schedules as $schedule) {
            $reservation_data = Schedule::join('reservations as res', 'schedules.sch_id', '=', 'res.res_sch');

            // 전체 예약 한국인 인원수
            $reservated_count = $reservation_data->where('res.res_sch', '=', $schedule->sch_id)->count();

            // 예약 미승인 한국인 인원수
            $un_permission_count = $reservation_data->where('res.res_state_of_permission', '=', false)->count();

            $schedule['reservated_count'] = $reservated_count;
            $schedule['un_permission_count'] = $un_permission_count;
        }

        return self::response_json(self::_STD_FOR_SHOW_SCH_SUCCESS, 200, $result_foreigner_schedules);
    }

    /**
     * 관리자 - 해당 유학생 스케줄 등록
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request, Preference $preference_instance): JsonResponse
    {
        $rules = [
            'sect_id' => 'required|integer|distinct|min:0|max:999',
            'std_for_id' => 'required|integer|distinct|min:1000000|max:9999999',
            'schedule.*' => 'array',
            'schedule.*.*' => 'integer',
            'ecept_date' => 'array',
            'ecept_date.*' => 'date',
        ];

        // <<-- Request 유효성 검사
        $validated_result = self::request_validator(
            $request,
            $rules,
            self::_STD_FOR_SHOW_SCH_FAILURE
        );

        if (is_object($validated_result)) {
            return $validated_result;
        }

        $setting_value = $preference_instance->getPreference();                         /* 환경설정 변수 */

        $schedule_data = $request->input('schedule');                                   /* 스케줄 데이터 */
        $ecept_date = $request->input('ecept_date');                                    /* 제외날짜 */
        $sect = Section::find($request->sect_id);                                       /* 학기 데이터 */
        $std_for_id = $request->std_for_id;                                             /* 외국인 유학생 학번 */

        // 이미 등록된 스케줄이 있을 경우 삭제 후 재등록.
        $get_sect_by_schedule = $this->schedule->get_sch_by_sect($request->sect_id, $std_for_id);

        $is_already_inserted_schedule = $get_sect_by_schedule->count() > 0;
        if ($is_already_inserted_schedule) $get_sect_by_schedule->delete();

        $sect_start_date = strtotime($sect->sect_start_date);
        $sect_start_date = date("Y-m-d", $sect_start_date);
        $sect_end_date = strtotime($sect->sect_end_date);
        $sect_end_date = date("Y-m-d", $sect_end_date);

        $yoil = array("일", "월", "화", "수", "목", "금", "토");

        $sect_start_yoil = $yoil[date('w', strtotime($sect_start_date))];               /* 시작날짜 요일 */
        // echo ($yoil[date('w', strtotime($sect_end_date))]);                          /* 종료날짜 요일 */

        $isFirstLoop = true;

        // 학기 시작 날짜에 맞춰 시작 날짜 재설정
        if ($sect_start_yoil == "토") {
            $sect_start_date = strtotime("{$sect_start_date} +2 day");
            /* 날짜 String 변경 */
            $sect_start_date = date("Y-m-d", $sect_start_date);
            $isFirstLoop = false;
        } else if ($sect_start_yoil == "일") {
            $sect_start_date = strtotime("{$sect_start_date} +1 day");
            /* 날짜 String 변경 */
            $sect_start_date = date("Y-m-d", $sect_start_date);
            $isFirstLoop = false;
        }

        $isRepeatMode = true;                                                           /* 반복모드 설정 */

        while ($isRepeatMode) {
            // 요일별 데이터 출력
            foreach ($schedule_data as $key => $day) {
                // 처음 순회하는 루프인 경우 요일 맞추기
                if ($isFirstLoop && $sect_start_yoil != "월") {
                    // Ex 학기 시작 날짜는 수요일인 경우 => 월, 화 는 뛰어 넘어야 함.
                    if ($sect_start_yoil != $key) continue;
                    else $isFirstLoop = false;
                }

                // 제외 날짜인 경우 패스.
                if (!empty($ecept_date[0]) && $sect_start_date == $ecept_date[0]) {
                    // 해당 날짜 배열에서 제거.
                    array_shift($ecept_date);
                    // 날짜 변경
                    $sect_start_date = $yoil[date('w', strtotime($sect_start_date))] == '금' ?
                        strtotime("{$sect_start_date} +3 day") :
                        strtotime("{$sect_start_date} +1 day");
                    /* 날짜 String 변경 */
                    $sect_start_date = date("Y-m-d", $sect_start_date);
                    continue;
                }

                // 시간 리스트 목록
                foreach ($day as $hour) {
                    // 줌 비밀번호 생성
                    $zoom_pw = mt_rand(self::_ZOOM_RAN_NUM_START, self::_ZOOM_RAN_NUM_END);

                    $sch_start_date = strtotime($sect_start_date . " " . $hour . ":00:00");
                    $sch_end_date = strtotime($sect_start_date . " " . $hour . ":{$setting_value->once_meet_time}:00");
                    $sch_start_date = date("Y-m-d H:i:s", $sch_start_date);
                    $sch_end_date = date("Y-m-d H:i:s", $sch_end_date);

                    Schedule::create([
                        'sch_sect' => $sect->sect_id,
                        'sch_std_for' => $std_for_id,
                        'sch_start_date' => $sch_start_date,
                        'sch_end_date' => $sch_end_date,
                        'sch_for_zoom_pw' => $zoom_pw,
                    ]);

                    // 줌 비밀번호 생성
                    $zoom_pw = mt_rand(self::_ZOOM_RAN_NUM_START, self::_ZOOM_RAN_NUM_END);
                    $start_time = $setting_value->once_meet_time + $setting_value->once_rest_time;
                    $end_time = $start_time + $setting_value->once_meet_time;
                    $sch_start_date = strtotime($sect_start_date . " " . $hour . ":{$start_time}:00");
                    $sch_end_date = strtotime($sect_start_date . " " . $hour . ":{$end_time}:00");

                    $sch_start_date = date("Y-m-d H:i:s", $sch_start_date);
                    $sch_end_date = date("Y-m-d H:i:s", $sch_end_date);

                    Schedule::create([
                        'sch_sect' => $sect->sect_id,
                        'sch_std_for' => $std_for_id,
                        'sch_start_date' => $sch_start_date,
                        'sch_end_date' => $sch_end_date,
                        'sch_for_zoom_pw' => $zoom_pw,
                    ]);
                }

                // 종료 날짜에 맞춰 반복문 종료.
                if ($sect_start_date == $sect_end_date) {
                    $isRepeatMode = false;
                    break;
                }

                /*  날짜 변경 공식
                    월 ~ 목 => +1day
                    금      => +3day
                */
                $sect_start_date = $yoil[date('w', strtotime($sect_start_date))] == '금' ?
                    strtotime("{$sect_start_date} +3 day") :
                    strtotime("{$sect_start_date} +1 day");
                /* 날짜 String 변경 */
                $sect_start_date = date("Y-m-d", $sect_start_date);
            }

            $isFirstLoop = false;
        }

        return self::response_json(self::_SCHEDULE_RES_STORE_SUCCESS, 201);
    }

    /**
     * 관리자 - 특정 스케줄 업데이트
     *
     * @param \Illuminate\Http\Request $request
     * @param int $sch_id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Schedule $sch_id): JsonResponse
    {
        $rules = [
            'sch_std_for' => 'required|integer',
            'sch_start_date' => 'required|date',
            'sch_end_date' => 'required|date',
        ];

        // <<-- Request 유효성 검사
        $validated_result = self::request_validator(
            $request,
            $rules,
            self::_STD_FOR_SHOW_SCH_FAILURE
        );

        if (is_object($validated_result)) {
            return $validated_result;
        }

        $sch_id->update([
            'sch_start_date' => $request->sch_start_date,
            'sch_end_date' => $request->sch_end_date,
        ]);

        return self::response_json(self::_SCHEDULE_RES_UPDATE_SUCCESS, 200);
    }


    /**
     * 관리자 - 해당 학기 해당 유학생 전체 스케줄 삭제
     *
     * @param int $sch_id
     * @return \Illuminate\Http\Response
     */
    public function destroy_all_schedule(Request $request): JsonResponse
    {
        $rules = [
            'sect_id' => 'required|integer|distinct|min:0|max:999',
            'std_for_id' => 'required|integer|distinct|min:1000000|max:9999999',
        ];

        // <<-- Request 유효성 검사
        $validated_result = self::request_validator(
            $request,
            $rules,
            self::_STD_FOR_SHOW_SCH_FAILURE
        );

        if (is_object($validated_result)) {
            return $validated_result;
        }

        // 이미 등록된 스케줄이 있을 경우 삭제 후 재등록.
        $get_sect_by_schedule = $this->schedule->get_sch_by_sect($request->sect_id, $request->std_for_id);

        $is_already_inserted_schedule = $get_sect_by_schedule->count() > 0;
        if ($is_already_inserted_schedule) {
            $get_sect_by_schedule->delete();
            return self::response_json(self::_SCHEDULE_RES_DELETE_SUCCESS, 200);
        } else {
            return self::response_json(self::_SCHEDULE_RES_DELETE_FAILURE, 200);
        }
    }

    /**
     * 관리자 - 특정 스케줄 삭제
     *
     * @param int $sch_id
     * @return \Illuminate\Http\Response
     */
    public function destroy(Schedule $sch_id): JsonResponse
    {
        Reservation::where('res_sch', $sch_id['sch_id'])->delete();
        $sch_id->delete();

        return self::response_json(self::_SCHEDULE_RES_DELETE_SUCCESS, 200);
    }

    /**
     * 관리자 - 해당 날짜 출석 결과 미입력건 조회
     *
     * @param string $date
     * @return \Illuminate\Http\Response
     */
    public function indexUninputedList($date)
    {
        $uninput_list = Schedule::select('schedules.sch_id', 'std_for_id', 'std_for_name', 'sch_start_date', 'sch_end_date')
            ->join('student_foreigners as for', 'schedules.sch_std_for', '=', 'for.std_for_id')
            ->whereDate('sch_start_date', $date)
            ->where('sch_state_of_result_input', false)
            ->get();

        foreach ($uninput_list as $schedule) {
            $kor_data = Reservation::select('std_kor_id', 'std_kor_name', 'res_state_of_attendance')
                ->join('student_koreans as kor', 'reservations.res_std_kor', '=', 'std_kor_id')
                ->where('res_sch', $schedule['sch_id'])
                ->get();
            // 한국인 학생 정보 추가.
            $schedule['student_korean'] = $kor_data;
        }

        return response()->json([
            'message' => $date . ' 일 출석 결과 미입력건 조회',
            'data' => $uninput_list,
        ], 200);
    }

    /**
     * 관리자 - 해당 날짜 출석 결과 미승인건 조회
     *
     * @param string $date
     * @return \Illuminate\Http\Response
     */
    public function indexUnapprovedList($date)
    {
        $unapproved_list = Schedule::select('schedules.sch_id', 'std_for_id', 'std_for_name', 'sch_start_date', 'sch_end_date', 'start_img_url', 'end_img_url')
            ->join('student_foreigners as for', 'schedules.sch_std_for', '=', 'for.std_for_id')
            ->join('schedules_result_imgs as img', 'schedules.sch_id', '=', 'img.sch_id')
            ->whereDate('sch_start_date', $date)
            ->where('sch_state_of_result_input', true)
            ->where('sch_state_of_permission', false)
            ->get();

        foreach ($unapproved_list as $schedule) {
            $kor_data = Reservation::select('std_kor_id', 'std_kor_name', 'res_state_of_attendance')
                ->join('student_koreans as kor', 'reservations.res_std_kor', '=', 'std_kor_id')
                ->where('res_sch', $schedule['sch_id'])
                ->get();

            // 한국인 학생 정보 추가.
            $schedule['student_korean'] = $kor_data;

            // 이미지 주소 매핑
            $schedule['start_img_url'] =
                $this->resultImage->get_img($schedule['start_img_url']);
            $schedule['end_img_url'] =
                $this->resultImage->get_img($schedule['end_img_url']);
        }

        return response()->json([
            'message' => $date . ' 일 출석 결과 미승인건 조회',
            'data' => $unapproved_list,
        ], 200);
    }

    /**
     * 관리자 - 출석 결과 미승인 건 승인
     *
     * @param int $sch_id
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\Response
     */
    public function updateApprovalOfUnapprovedCase(Request $request, Schedule $sch_id)
    {
        // 이미 출석 결과가 승인 된 스케줄인 경우
        if($sch_id['sch_state_of_permission'] == true) {
            return self::response_json(self::_SCHDEULE_RES_APPROVE_DUPLICATED, 422);
        }

        $rules = [
            'attendance' => 'required|array',
            'attendance.*' => 'required|integer',
            'absent' => 'array',
            'absent.*' => 'integer',
        ];

        $validated_result = self::request_validator(
            $request,
            $rules,
            self::_SCHDEULE_RES_APPROVE_FAILURE
        );

        if (is_object($validated_result)) {
            return $validated_result;
        }

        $update_attendance_id_list = $request->input('attendance');
        $update_absent_id_list = $request->input('absent');

        // 해당 스케줄에 대한 유학생 출석 결과 입력 승인
        $sch_id->update([
            'sch_state_of_permission' => true
        ]);

        // 해당 스케줄에 대한 한국인 학생 결석 횟수 업데이트
        if (!empty($update_absent_id_list)) {
            foreach ($update_absent_id_list as $std_kor_id) {
                $this->restrict->set_korean_absent_count($std_kor_id);
            }
        }

        // 해당 스케줄에 대한 한국인 학생 출석 결과 승인
        Reservation::whereIn('res_id', $update_attendance_id_list)
            ->where('res_sch', $sch_id['sch_id'])
            ->update([
                'res_state_of_attendance' => true
            ]);

        return self::response_json(self::_SCHDEULE_RES_APPROVE_SUCCESS, 200);
    }

    /**
     * 한국인학생 - 현재 날짜 기준 예약 가능 스케줄 조회
     * /api/korean/schedule/
     *
     * @return JsonResponse
     */
    public function index(Preference $preference_instance): JsonResponse
    {
        $setting_value = $preference_instance->getPreference();                                 /* 환경설정 변수 */
        $max_std_once = $setting_value->max_std_once;

        /* 시작 날짜 */
        $sch_start_date = date("Y-m-d", strtotime("Now"));
        /* 예약 신청 시작 기준 종료 날짜 */
        $sch_end_date = date("Y-m-d", strtotime("+{$setting_value->res_start_period} days"));

        $allSchdules = Schedule::select('sch_id', 'std_for_name', 'std_for_lang', 'sch_start_date', 'sch_end_date')
            ->whereDate('schedules.sch_start_date', '>=', $sch_start_date)
            ->whereDate('schedules.sch_end_date', '<=', $sch_end_date)
            ->join('student_foreigners as for', 'schedules.sch_std_for', 'for.std_for_id')
            ->orderBy('schedules.sch_start_date')
            ->get();

        foreach ($allSchdules as $schedule) {
            $schedule['std_res_count'] = Reservation::where('res_sch', $schedule['sch_id'])->count();
            $schedule['sch_res_available'] = ($schedule['std_res_count'] <= $max_std_once) ? true : false;
        }

        return response()->json([
            'message' => $allSchdules->count() === 0 ? '등록된 스케줄이 없습니다.' : '일정 조회를 성공하였습니다.',
            'result' => $allSchdules,
        ], 200);
    }

    /**
     * 한국인 학생 - 특정 스케줄 조회
     * /api/korean/schedule/{$sch_id}
     *
     * @param Schedule $sch_id
     * @return JsonResponse
     */
    public function std_kor_show_sch(Schedule $sch_id): JsonResponse
    {
        return $this->schedule->get_sch_by_id($sch_id);
    }
}
