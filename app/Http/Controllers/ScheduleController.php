<?php

namespace App\Http\Controllers;

use App\Library\Services\Preference;
use App\Reservation;
use App\Schedule;
use App\Section;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ScheduleController extends Controller
{
    private const _SCHEDULE_SEARCH_RES_SUCCESS = " 일자 유학생 스케줄을 반환합니다.";
    private const _SCHEDULE_SEARCH_RES_FAILURE = " 일자 유학생 스케줄을 조회에 실패하였습니다.";

    private const _SCHEDULE_RES_STORE_SUCCESS = "스케줄 등록을 완료하였습니다.";

    private $schedule;

    public function __construct()
    {
        $this->schedule = new Schedule();
    }

    /**
     * 유학생 - 특정 날짜에 대한 개인 스케줄 조회
     * /api/foreigner/schedule/
     *
     * @param int $id
     * @return \Illuminate\Http\Response
     */

    private const _STD_FOR_SHOW_SCH_SUCCESS = "스케줄 목록 조회에 성공하였습니다.";
    private const _STD_FOR_SHOW_SCH_NO_DATA = "등록된 스케줄이 없습니다.";
    private const _STD_FOR_SHOW_SCH_FAILURE = "스케줄 목록 조회에 실패하였습니다.";

    /**
     * 관리자 - 특정 날짜 유학생 전체 스케줄 조회
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function std_for_show_sch_by_date(Request $request): JsonResponse
    {
        $rules = [
            'search_date' => 'required|date'
        ];

        // <<-- Request 유효성 검사
        $validated_result = self::request_validator(
            $request, $rules, self::_STD_FOR_SHOW_SCH_FAILURE
        );

        if (is_object($validated_result)) {
            return $validated_result;
        }
        // -->>

        // TODO 토큰으로 유학생 정보 가져오기.
        $search_date = $request->input('search_date');
        $std_for_id = 1022670;
//        $std_for_id = $request->user($request->input('guard'))['std_for_id'];

        // <<-- 날짜에 대한 스케줄 목록을 조회
        $response_data = $this->schedule->get_sch_by_date($search_date, $std_for_id);
        // -->>

        $is_sch_no_data = $response_data->count();
        // TODO 데이터가 없을 경우 response 하는 것(여기)
//        if ()
//        dd($response_data->count());
        return
            self::response_json(self::_STD_FOR_SHOW_SCH_SUCCESS, 200, $response_data);
    }


    /**
     * 관리자 - 해당 유학생 스케줄 등록
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request, Preference $preference_instance)
    {
        $setting_value = $preference_instance->getPreference();                         /* 환경설정 변수 */

        $schedule_data = $request->input('schedule');                                   /* 스케줄 데이터 */
        $ecept_date = $request->input('ecept_date');                                    /* 제외날짜 */
        $sect = Section::find($request->input('sect_id'));                              /* 학기 데이터 */
        $std_for_id = $request->input('std_for_id');                                    /* 외국인 유학생 학번 */

        $sect_start_date = strtotime($sect->sect_start_date);
        $sect_start_date = date("Y-m-d", $sect_start_date);
        $sect_end_date = strtotime($sect->sect_end_date);
        $sect_end_date = date("Y-m-d", $sect_end_date);

        $yoil = array("일", "월", "화", "수", "목", "금", "토");

        $sect_start_yoil = $yoil[date('w', strtotime($sect_start_date))];               /* 시작날짜 요일 */
        // echo ($yoil[date('w', strtotime($sect_end_date))]);                          /* 종료날짜 요일 */

        // 학기 시작 날짜에 맞춰 시작 날짜 재설정
        if ($sect_start_yoil == "토") {
            $sect_start_date = strtotime("
{
$sect_start_date
}

 +2 day");
            /* 날짜 String 변경 */

            $sect_start_date = date("Y-m-d", $sect_start_date);
        } else if ($sect_start_yoil == "일") {
            $sect_start_date = strtotime("{
    $sect_start_date} +1 day");
            /* 날짜 String 변경 */
            $sect_start_date = date("Y-m-d", $sect_start_date);
        }

        $isRepeatMode = true;                                                           /* 반복모드 설정 */

        while ($isRepeatMode) {
            // 요일별 데이터 출력
            foreach ($schedule_data as $day) {
                // 제외 날짜인 경우 패스.
                if (!empty($ecept_date[0]) && $sect_start_date == $ecept_date[0]) {
                    // 해당 날짜 배열에서 제거.
                    array_shift($ecept_date);
                    // 날짜 변경
                    $sect_start_date = $yoil[date('w', strtotime($sect_start_date))] == '금' ?
                        strtotime("{
    $sect_start_date} +3 day") :
                        strtotime("{
    $sect_start_date} +1 day");
                    /* 날짜 String 변경 */
                    $sect_start_date = date("Y-m-d", $sect_start_date);
                    continue;
                }

                // 시간 리스트 목록
                foreach ($day as $hour) {
                    //TODO 환경변수 설정 ( 1000 ~ 9999 )
                    // 줌 비밀번호 생성
                    $zoom_pw = mt_rand(1000, 9999);

                    $sch_start_date = strtotime($sect_start_date . " " . $hour . ":00:00");
                    $sch_end_date = strtotime($sect_start_date . " " . $hour . ":{
    $setting_value->once_meet_time}:00");
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
                    $zoom_pw = mt_rand(1000, 9999);
                    $start_time = $setting_value->once_meet_time + $setting_value->once_rest_time;
                    $end_time = $start_time + $setting_value->once_meet_time;
                    $sch_start_date = strtotime($sect_start_date . " " . $hour . ":{
    $start_time}:00");
                    $sch_end_date = strtotime($sect_start_date . " " . $hour . ":{
    $end_time}:00");

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
                    strtotime("{
    $sect_start_date} +3 day") :
                    strtotime("{
    $sect_start_date} +1 day");
                /* 날짜 String 변경 */
                $sect_start_date = date("Y-m-d", $sect_start_date);
            }
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
    public function update(Request $request, Schedule $sch_id)
    {
        $validator = Validator::make($request->all(), [
            'sch_sect' => 'required|integer',
            'sch_std_for' => 'required|integer',
            'sch_start_date' => 'required|date',
            'sch_end_date' => 'required|date',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => $validator->errors(),
            ], 422);
        }

        $update_schedule = $sch_id->update([
            'sch_start_date' => $request->sch_start_date,
            'sch_end_date' => $request->sch_end_date,
        ]);

        return response()->json([
            'message' => '스케줄 업데이트 완료',
            'result' => $update_schedule,
        ], 200);
    }

    /**
     * 관리자 - 특정 스케줄 삭제
     *
     * @param int $sch_id
     * @return \Illuminate\Http\Response
     */
    public function destroy(Schedule $sch_id)
    {
        $sch_id->delete();

        return response()->json([
            'message' => '스케줄 삭제 완료',
        ], 204);
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
        // 학생 출석 결과 변경 요청 -> 해당 학생 출석결과 변경 진행.
        if (!empty($request->reservation)) {
            $reservation = $request->reservation;

            foreach ($reservation as $data) {
                Reservation::find($data['res_id'])->update([
                    'res_state_of_attendance' => $data['res_state_of_attendance']
                ]);
            }
        }

        // 출석결과 승인
        $sch_id->update([
            'sch_state_of_permission' => true
        ]);

        return response()->json([
            'message' => '출석 결과 승인',
        ], 200);
    }


    /*
     * ========== TEST 완료 ==========
     * 1. 한국인 학생 - 현재 날짜 기준 예약 가능 스케줄 조회(refactoring 필요)
     * 2. 한국인 학생 - 특정 스케줄 조회(TODO 미완성 - 예외 요소 확인 필요)
     * 3. 유학생 - 특정 날짜에 대한 개인 스케줄 조회
     */

    /**
     * 한국인학생 - 현재 날짜 기준 예약 가능 스케줄 조회
     * /api/korean/schedule/
     *
     * @return JsonResponse
     */
    // TODO 가능 날짜 조회하는 것 수정 필요
    public function index(Preference $preference_instance): JsonResponse
    {
        $setting_value = $preference_instance->getPreference();                                 /* 환경설정 변수 */

        /* 시작 날짜 */
        $sch_start_date = date("Y-m-d", strtotime("Now"));
        /* 예약 신청 시작 기준 종료 날짜 */
        $sch_end_date = date("Y-m-d", strtotime("+{
    $setting_value->res_start_period} days"));

        $allSchdules = Schedule::select('sch_id', 'std_for_name', 'std_for_lang', 'sch_res_count', 'sch_start_date', 'sch_end_date')
            ->whereDate('schedules.sch_start_date', '>=', $sch_start_date)
            ->whereDate('schedules.sch_end_date', '<=', $sch_end_date)
            ->join('student_foreigners as for', 'schedules.sch_std_for', 'for.std_for_id')
            ->orderBy('schedules.sch_start_date')
            ->get();

        foreach ($allSchdules as $schedule) {
            $res_count = $schedule->sch_res_count;
            $max_std_once = $setting_value->max_std_once;
            $schedule['sch_res_available'] = ($res_count <= $max_std_once) ? true : false;
        }

        return response()->json([
            'message' => $allSchdules->count() === 0 ? '등록된 스케줄이 없습니다.' : '일정 조회를 성공하였습니다.',
            'result' => $allSchdules,
        ], 200);
    }

    /**
     * 한국인 학생 - 특정 스케줄 조회
     * /api/korean/schedule/{
     * $sch_id}
     *
     * @param Schedule $sch_id
     * @return JsonResponse
     */
    public function std_kor_show_sch(Schedule $sch_id): JsonResponse
    {
        return $this->schedule->get_sch_by_id($sch_id);
    }

}
