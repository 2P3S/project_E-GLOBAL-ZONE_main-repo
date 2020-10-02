<?php

namespace App\Http\Controllers;

use App\Library\Services\Preference;
use App\Reservation;
use App\Restricted_student_korean;
use App\Schedule;
use App\SchedulesResultImg;
use App\Section;
use App\Student_korean;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Config;

class ScheduleController extends Controller
{
    private const _ZOOM_RAN_NUM_START = 1000;
    private const _ZOOM_RAN_NUM_END = 9999;

    private $schedule;
    private $resultImage;
    private $restrict;

    public function __construct()
    {
        $this->schedule = new Schedule();
        $this->resultImage = new SchedulesResultImg();
        $this->restrict = new Restricted_student_korean();
        $this->reservation = new Reservation();
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
            'search_date' => 'required|date',
            'guard' => 'required|string|in:admin'
        ];

        // <<-- Request 유효성 검사
        $validated_result = self::request_validator(
            $request,
            $rules,
            Config::get('constants.kor.schedule.show.failure')
        );

        if (is_object($validated_result)) {
            return $validated_result;
        }
        // -->>

        $search_date = $request->input('search_date');

        function std_for_search_by_lang($date, $std_for_lang)
        {
            return
                Schedule::select('std_for_id', 'std_for_name', 'std_for_lang')
                    ->join('student_foreigners as for', 'schedules.sch_std_for', '=', 'for.std_for_id')
                    ->whereDate('sch_start_date', '=', $date)
                    ->where('std_for_lang', $std_for_lang)
                    ->groupBy('for.std_for_id')
                    ->get();
        }

        ;

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

        // 해당 유학생에 대한 스케줄 정보 추가.
        $response_data['English'] = std_for_add_schedule_data($response_data['English'], $search_date);
        $response_data['Japanese'] = std_for_add_schedule_data($response_data['Japanese'], $search_date);
        $response_data['Chinese'] = std_for_add_schedule_data($response_data['Chinese'], $search_date);

        return response()->json([
            'message' => Config::get('constants.kor.schedule.show.success'),
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
        $rules = [
            'start_date' => 'required|date',
            'end_date' => 'required|date',
        ];

        // <<-- Request 유효성 검사
        $validated_result = self::request_validator(
            $request,
            $rules,
            Config::get('constants.kor.schedule.show.failure')
        );

        if (is_object($validated_result)) {
            return $validated_result;
        }
        // -->>

        $std_for_id = $request->user($request->input('guard'))['std_for_id'];

        $result_foreigner_schedules = Schedule::select('std_for_id', 'sch_id', 'sch_start_date', 'sch_end_date', 'sch_for_zoom_pw', 'sch_state_of_result_input', 'sch_state_of_permission')
            ->join('student_foreigners as for', 'schedules.sch_std_for', '=', 'std_for_id')
            ->where('std_for_id', $std_for_id)
            ->whereDate('sch_start_date', '>=', $request->input('start_date'))
            ->whereDate('sch_start_date', '<=', $request->input('end_date'))
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

        return self::response_json(Config::get('constants.kor.schedule.show.success'), 200, $result_foreigner_schedules);
    }

    /**
     * 관리자 - 해당 유학생 스케줄 등록
     *
     * @param Request $request
     * @return JsonResponse
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
            'guard' => 'required|string|in:admin',
            // <<-- 학기 시작 후 스케줄 조정일 경우 사용
            'sch_start_date' => 'date',
            'sch_end_date' => 'date|after_or_equal:sect_start_date',
            'exception_mode' => 'required|bool',
            // -->>
        ];

        // <<-- Request 유효성 검사
        $validated_result = self::request_validator(
            $request,
            $rules,
            Config::get('constants.kor.schedule.store.failure')
        );

        if (is_object($validated_result)) {
            return $validated_result;
        }

        $setting_value = $preference_instance->getPreference();                                  /* 환경설정 변수 */
        $exception_mode = $request->input('exception_mode');                                     /* 예외 모드 ( 학기 시작 후 전체 수정 ) */

        $schedule_data = $request->input('schedule');                                            /* 스케줄 데이터 */
        $ecept_date = $request->input('ecept_date');                                             /* 제외날짜 */
        $sect = Section::find($request->input('sect_id'));                                       /* 학기 데이터 */
        $std_for_id = $request->input('std_for_id');                                             /* 외국인 유학생 학번 */
        $sect_start_date = strtotime($sect->sect_start_date);

        if ($exception_mode) {
            /**
             * 학기 시작날짜 X -> 커스텀 시작 날짜로 변경.
             *
             * (예외처리 리스트)
             * 1. 관리자 실수 해당 날짜 스케줄이 존재하는 경우.
             * 1-1. 해당 날짜 스케줄에 예약이 존재하는 경우.
             */
            $last_schedule = Schedule::where('sch_sect', $sect['sect_id'])
                ->where('sch_std_for', $std_for_id)
                ->orderBy('sch_start_date', 'DESC')
                ->get()->first();

            $last_schedule_date = strtotime($last_schedule['sch_start_date']);
            $sch_start_date = strtotime($request->input('sch_start_date'));

            // 입력한 시작일 이전에 스케줄이 존재하는 경우
            if ($sch_start_date <= $last_schedule_date) {
                $msg = date("Y-m-d", strtotime("{$last_schedule['sch_start_date']} +1 day")) . " 이후의 스케줄만 등록 가능합니다. ( 입력한 시작일 이전 날짜에 스케줄이 존재합니다. )";
                return self::response_json($msg, 422);
            }

            $sect_start_date = date("Y-m-d", strtotime($request->input('sch_start_date')));

            // 입력한 종료일이 해당 학기 종료일을 넘을 경우 => 자동으로 종료일자에 셋팅.
            $is_over_date = strtotime($request->input('sch_end_date')) > strtotime($sect->sect_end_date);
            $sect_end_date = $is_over_date ? date("Y-m-d", strtotime($sect->sect_end_date)) : date("Y-m-d", strtotime($request->input('sch_end_date')));
        } else {
            // <<-- 이미 등록된 스케줄이 있을 경우 삭제 후 재등록.
            $get_sect_by_schedule = $this->schedule->get_sch_by_sect($request->input('sect_id'), $std_for_id);

            $is_already_inserted_schedule = $get_sect_by_schedule->count() > 0;
            if ($is_already_inserted_schedule) $get_sect_by_schedule->delete();
            // -->>

            // <<--이미 학기가 시작 된 경우 에러 반환.
            $now_date = strtotime("Now");
            if ($now_date >= $sect_start_date) {
                return self::response_json(Config::get('constants.kor.schedule.store.section_err'), 422);
            }
            // -->>

            $sect_start_date = date("Y-m-d", $sect_start_date);
            $sect_end_date = date("Y-m-d", strtotime($sect->sect_end_date));
        }

        $yoil = array("일", "월", "화", "수", "목", "금", "토");

        $sect_start_yoil = $yoil[date('w', strtotime($sect_start_date))];               /* 시작날짜 요일 */
        // echo ($yoil[date('w', strtotime($sect_end_date))]);                          /* 종료날짜 요일 */

        $isFirstLoop = true;

        // 학기 시작 날짜에 맞춰 시작 날짜 재설정
        if ($sect_start_yoil == "토") {
            /* 날짜 String 변경 */
            $sect_start_date = date("Y-m-d", strtotime("{$sect_start_date} +2 day"));
            $isFirstLoop = false;
        } else if ($sect_start_yoil == "일") {
            /* 날짜 String 변경 */
            $sect_start_date = date("Y-m-d", strtotime("{$sect_start_date} +1 day"));
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
                    // 앞타임 스케줄 생성
                    $this->set_custom_schedule(true, $setting_value, $sect_start_date, $hour, $sect->sect_id, $std_for_id);

                    // 뒷타임 스케줄 생성
                    $this->set_custom_schedule(false, $setting_value, $sect_start_date, $hour, $sect->sect_id, $std_for_id);
                }

                // 종료 날짜에 맞춰 반복문 종료.
                if (strtotime($sect_start_date) >= strtotime($sect_end_date)) {
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

        return self::response_json(Config::get('constants.kor.schedule.store.success'), 201);
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
            'guard' => 'required|string|in:admin'
        ];

        // <<-- Request 유효성 검사
        $validated_result = self::request_validator(
            $request,
            $rules,
            Config::get('constants.kor.schedule.update.failure')
        );

        if (is_object($validated_result)) {
            return $validated_result;
        }

        $sch_id->update([
            'sch_start_date' => $request->input('sch_start_date'),
            'sch_end_date' => $request->input('sch_end_date'),
        ]);

        return self::response_json(Config::get('constants.kor.schedule.update.success'), 200);
    }


    /**
     * 관리자 - 해당 학기 해당 유학생 전체 스케줄 삭제
     *
     * @return \Illuminate\Http\Response
     */
    public function destroy_all_schedule(Request $request): JsonResponse
    {
        $rules = [
            'sect_id' => 'required|integer|distinct|min:0|max:999',
            'std_for_id' => 'required|integer|distinct|min:1000000|max:9999999',
            'guard' => 'required|string|in:admin'
        ];

        // <<-- Request 유효성 검사
        $validated_result = self::request_validator(
            $request,
            $rules,
            Config::get('constants.kor.schedule.destroy.failure')
        );

        if (is_object($validated_result)) {
            return $validated_result;
        }

        // 이미 등록된 스케줄이 있을 경우 삭제 후 재등록.
        $get_sect_by_schedule = $this->schedule->get_sch_by_sect($request->input('sect_id'), $request->input('std_for_id'));

        $is_already_inserted_schedule = $get_sect_by_schedule->count() > 0;
        if ($is_already_inserted_schedule) {
            $get_sect_by_schedule->delete();
            return self::response_json(Config::get('constants.kor.schedule.destroy.success'), 200);
        } else {
            return self::response_json(Config::get('constants.kor.schedule.destroy.no_value'), 202);
        }
    }

    /**
     * 입력받은 시작 날짜부터 학기 종료일까지의 전체 스케줄 삭제
     *
     * @return JsonResponse
     */
    public function destroy_for_schedules_from_special_date_to_section_end_date(
        Section $sect_id,
        Request $request
    ): JsonResponse
    {
        $rules = [
            'sch_start_date' => 'required|date',
            'std_for_id' => 'required|integer|distinct|min:1000000|max:9999999',
            'guard' => 'required|string|in:admin'
        ];

        $validated_result = self::request_validator(
            $request,
            $rules,
            Config::get('constants.kor.schedule.destroy.failure')
        );

        if (is_object($validated_result)) {
            return $validated_result;
        }

        $std_for_id = $request->input('std_for_id');
        $sch_start_date = $request->input('sch_start_date');

        // 입력 받은 시작 날짜가 해당 section 에 포함되는 날짜인지 검사
        if (!(strtotime($sect_id->sect_start_date) <= strtotime($sch_start_date) && strtotime($sch_start_date) <= strtotime($sect_id->sect_end_date)))
            return $this->response_json_error(Config::get('constants.kor.schedule.destroy.date_err'));

        try {
            // 입력받은 시작 날짜부터 학기 종료일까지 전체 스케줄 삭제
            $this->schedule->get_sch_by_sect_start_date((int)$sect_id['sect_id'], $std_for_id, $sch_start_date)
                ->delete();
        } catch (\Exception $e) {
            // <<-- 삭제 실패
            $message = Config::get('constants.kor.work_std_for.index.failure');
            return $this->response_json_error(Config::get('constants.kor.schedule.destroy.failure'));
            // -->>
        }

        return self::response_json(Config::get('constants.kor.schedule.destroy.success'), 200);
    }


    /**
     * 관리자 - 특정 스케줄 추가
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function store_some_schedule(Request $request, Preference $preference_instance): JsonResponse
    {
        $rules = [
            'sect_id' => 'required|integer',
            'schedule' => 'required|array',
            'schedule.*.std_for_id' => 'required|integer',
            'schedule.*.times' => 'required|array',
            'schedule.*.times.*' => 'required|integer',
            'schedule.*.date' => 'required|date',
            'guard' => 'required|string|in:admin'
        ];

        $validated_result = self::request_validator(
            $request,
            $rules,
            Config::get('constants.kor.schedule.store.failure')
        );

        if (is_object($validated_result)) {
            return $validated_result;
        }

        $allSchdules = $request->input('schedule');
        $sect_id = $request->input('sect_id');

        $setting_value = $preference_instance->getPreference();                         /* 환경설정 변수 */

        foreach ($allSchdules as $schedule) {
            $std_for_id = $schedule['std_for_id'];
            $date = $schedule['date'];
            $times = $schedule['times'];

            foreach ($times as $hour) {
                // 1. 기존 스케줄 존재 여부 확인
                $sch_end_date = strtotime($date . " " . ++$hour . ":00:00");
                $sch_start_date = strtotime($date . " " . --$hour . ":00:00");

                $start_day = date("Y-m-d H:i:s", $sch_start_date);
                $end_day = date("Y-m-d H:i:s", $sch_end_date);

                // 중복 스케줄 조회
                $is_duplicated_schedule = Schedule::where('sch_std_for', $std_for_id)
                    ->where('sch_start_date', '>=', $start_day)
                    ->where('sch_start_date', '<', $end_day)
                    ->where('sch_end_date', '>=', $start_day)
                    ->where('sch_end_date', '<', $end_day)
                    ->count();

                // 중복된 스케줄인 경우 뛰어넘기
                if ($is_duplicated_schedule) continue;

                // 앞타임 스케줄 생성
                $this->set_custom_schedule(true, $setting_value, $date, $hour, $sect_id, $std_for_id);

                // 뒷타임 스케줄 생성
                $this->set_custom_schedule(false, $setting_value, $date, $hour, $sect_id, $std_for_id);
            }
        }

        return self::response_json(Config::get('constants.kor.schedule.store.success'), 201);
    }

    /**
     * 관리자 - 해당 날짜 전체 스케줄 삭제
     *
     * @return JsonResponse
     */
    public function destroy_by_date(Request $request): JsonResponse
    {
        $rules = [
            'date' => 'required|date',
            'guard' => 'required|string|in:admin'
        ];

        // <<-- Request 유효성 검사
        $validated_result = self::request_validator(
            $request,
            $rules,
            Config::get('constants.kor.schedule.destroy.failure')
        );

        if (is_object($validated_result)) {
            return $validated_result;
        }
        // -->>

        $schedules_by_date = Schedule::whereDate('sch_start_date', '=', $request->input('date'));
        $schedule_exists = $schedules_by_date->count() > 0;

        if ($schedule_exists) {
            $schedules_by_date->delete();
            return self::response_json(Config::get('constants.kor.schedule.destroy.success'), 200);
        } else {
            return self::response_json(Config::get('constants.kor.schedule.destroy.no_value'), 202);
        }
    }

    /**
     * 관리자 - 특정 스케줄 삭제
     *
     * @param int $sch_id
     * @return JsonResponse
     */
    public function destroy(Request $request, Schedule $sch_id): JsonResponse
    {
        // <<-- Request 요청 관리자 권한 검사.
        $is_admin = self::is_admin($request);

        if (is_object($is_admin)) {
            return $is_admin;
        }
        // -->>

        $sch_id->delete();

        return self::response_json(Config::get('constants.kor.schedule.destroy.success'), 200);
    }

    /**
     * 관리자 - 해당 날짜 출석 결과 미입력건 조회
     *
     * @param string $date
     * @return JsonResponse
     */
    public function indexUninputedList(Request $request, $date)
    {
        // <<-- Request 요청 관리자 권한 검사.
        $is_admin = self::is_admin($request);

        if (is_object($is_admin)) {
            return $is_admin;
        }
        // -->>

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
            'message' => $date . Config::get('constants.kor.schedule.index_uninputed_list.success'),
            'data' => $uninput_list,
        ], 200);
    }

    /**
     * 관리자 - 해당 날짜 출석 결과 조회 ( 승인, 미승인 )
     *
     * @param string $date
     * @return JsonResponse
     */
    public function indexApprovedList(Request $request, $date)
    {
        // <<-- Request 요청 관리자 권한 검사.
        $rules = [
            'sch_state_of_permission' => 'required|bool',
            'guard' => 'required|string|in:admin'
        ];

        $validated_result = self::request_validator(
            $request,
            $rules,
            Config::get('constants.kor.schedule.index_approved_list.failure')
        );

        if (is_object($validated_result)) {
            return $validated_result;
        }
        // -->>

        $unapproved_list = Schedule::select('schedules.sch_id', 'std_for_id', 'std_for_name', 'sch_start_date', 'sch_end_date', 'start_img_url', 'end_img_url')
            ->join('student_foreigners as for', 'schedules.sch_std_for', '=', 'for.std_for_id')
            ->join('schedules_result_imgs as img', 'schedules.sch_id', '=', 'img.sch_id')
            ->whereDate('sch_start_date', $date)
            ->where('sch_state_of_result_input', true)
            ->where('sch_state_of_permission', $request->input('sch_state_of_permission'))
            ->get();

        foreach ($unapproved_list as $schedule) {
            $kor_data = Reservation::select('std_kor_id', 'std_kor_name', 'res_state_of_permission', 'res_state_of_attendance')
                ->join('student_koreans as kor', 'reservations.res_std_kor', '=', 'std_kor_id')
                ->where('res_sch', $schedule['sch_id'])
                ->get();

            // 한국인 학생 정보 추가.
            $schedule['student_korean'] = $kor_data;
        }

        return response()->json([
            'message' => $date . Config::get('constants.kor.schedule.index_approved_list.success'),
            'data' => $unapproved_list,
        ], 200);
    }

    /**
     * 관리자 - 출석 결과 미승인 건 승인
     *
     * @param int $sch_id
     * @param Request $request
     * @return JsonResponse
     */
    public function updateApprovalOfUnapprovedCase(Request $request, Schedule $sch_id)
    {
        // 이미 출석 결과가 승인 된 스케줄인 경우
        if ($sch_id['sch_state_of_permission'] == true) {
            return self::response_json(Config::get('constants.kor.schedule.update_approved_list.duplicate'), 422);
        }

        $rules = [
            'attendance' => 'nullable|array',
            'attendance.*' => 'integer|distinct|min:1000000|max:9999999',
            'absent' => 'nullable|array',
            'absent.*' => 'integer|distinct|min:1000000|max:9999999',
            'guard' => 'required|string|in:admin'
        ];

        $validated_result = self::request_validator(
            $request,
            $rules,
            Config::get('constants.kor.schedule.update_approved_list.failure')
        );

        if (is_object($validated_result)) {
            return $validated_result;
        }

        $update_attendance_id_list = $request->input('attendance');
        $update_absent_id_list = $request->input('absent');

        // <<-- 출석, 결석 학생 업데이트
        if (!empty($update_attendance_id_list)) {
            $this->reservation->update_std_kor_res(
                $sch_id,
                $update_attendance_id_list,
                'res_state_of_attendance',
                true
            );

            // 해당 스케줄이 대한 한국인 학생 활동 참여 횟수 업데이트
            Student_korean::whereIn('std_kor_id', $update_attendance_id_list)
                ->increment('std_kor_num_of_attendance', 1);
        }

        if (!empty($update_absent_id_list)) {
            $this->reservation->update_std_kor_res(
                $sch_id,
                $update_absent_id_list,
                'res_state_of_attendance',
                false
            );

            // 해당 스케줄에 대한 한국인 학생 결석 횟수 업데이트
            foreach ($update_absent_id_list as $std_kor_id) {
                // 유학생 승인을 받지 못해 결석으로 처리 된 학생은 제외.
                $reservation = Reservation::where('res_sch', $sch_id['sch_id'])
                    ->where('res_std_kor', $std_kor_id)
                    ->get()
                    ->first();
                $has_permission = $reservation['res_state_of_permission'];

                if ($has_permission)
                    $this->restrict->set_korean_absent_count($std_kor_id);
            }
        }
        // -->>

        // 해당 스케줄에 대한 유학생 출석 결과 입력 승인
        $sch_id->update([
            'sch_state_of_permission' => true
        ]);

        return self::response_json(Config::get('constants.kor.schedule.update_approved_list.success'), 200);
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
            ->whereDate('schedules.sch_start_date', '>', $sch_start_date)
            ->whereDate('schedules.sch_end_date', '<=', $sch_end_date)
            ->join('student_foreigners as for', 'schedules.sch_std_for', 'for.std_for_id')
            ->orderBy('schedules.sch_start_date')
            ->get();

        foreach ($allSchdules as $schedule) {
            $schedule['std_res_count'] = Reservation::where('res_sch', $schedule['sch_id'])->count();
            $schedule['sch_res_available'] = ($schedule['std_res_count'] <= $max_std_once) ? true : false;
        }

        return response()->json([
            'message' => $allSchdules->count() === 0 ? Config::get('constants.kor.schedule.kor_index.failure') : Config::get('constants.kor.schedule.kor_index.success'),
            'data' => $allSchdules,
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
        $schedule_data = $this->schedule->get_sch_by_id($sch_id);

        return self::response_json(Config::get('constants.kor.reservation.for_index.success'), 200, $schedule_data);
    }

    // 스케줄 생성 커스텀 함수.
    public function set_custom_schedule(bool $is_first_time, object $setting_value, string $date, string $hour, int $sect_id, int $std_for_id)
    {
        // 줌 비밀번호 생성
        $zoom_pw = mt_rand(self::_ZOOM_RAN_NUM_START, self::_ZOOM_RAN_NUM_END);

        // 앞타임 스케줄 정의.
        if ($is_first_time) {
            $sch_start_date = strtotime($date . " " . $hour . ":00:00");
            $sch_end_date = strtotime($date . " " . $hour . ":{$setting_value->once_meet_time}:00");
        } // 뒷타임 스케줄 정의.
        else {
            $start_time = $setting_value->once_meet_time + $setting_value->once_rest_time;
            $end_time = $start_time + $setting_value->once_meet_time;
            $sch_start_date = strtotime($date . " " . $hour . ":{$start_time}:00");
            $sch_end_date = strtotime($date . " " . $hour . ":{$end_time}:00");
        }

        $sch_start_date = date("Y-m-d H:i:s", $sch_start_date);
        $sch_end_date = date("Y-m-d H:i:s", $sch_end_date);

        return Schedule::create([
            'sch_sect' => $sect_id,
            'sch_std_for' => $std_for_id,
            'sch_start_date' => $sch_start_date,
            'sch_end_date' => $sch_end_date,
            'sch_for_zoom_pw' => $zoom_pw,
        ]);
    }

    public function index_holiday(Request $request)
    {
        // <<-- Request 요청 관리자 권한 검사.
        $is_admin = self::is_admin($request);

        if (is_object($is_admin)) {
            return $is_admin;
        }
        // -->>

        $validated_result = self::request_validator(
            $request,
            ['year' => 'nullable|integer'],
            "공휴일 목록 조회에 실패했습니다."
        );

        if (is_object($validated_result)) {
            return $validated_result;
        }

        $key = $_ENV['HOLIDAY_API_KEY'];
        $year = $request->input('year') ?? date("Y");
        $URL = "http://apis.data.go.kr/B090041/openapi/service/SpcdeInfoService/getRestDeInfo?serviceKey={$key}&solYear={$year}&_type=json&numOfRows=50";

        $result = json_decode(file_get_contents($URL), true, 512, JSON_THROW_ON_ERROR);
        $holiday_list = (object)array_column($result['response']['body']['items']['item'], 'locdate');

        return Controller::response_json('공휴일 목록 조회에 성공했습니다.', 200, $holiday_list);
    }
}
