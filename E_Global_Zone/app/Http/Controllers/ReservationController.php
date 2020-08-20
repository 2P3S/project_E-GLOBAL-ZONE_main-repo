<?php

namespace App\Http\Controllers;

use App\Reservation;
use App\Schedule;
use App\SchedulesResultImg;
use App\Setting;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class ReservationController extends Controller
{
    /*
     * [Refactoring]
     * TODO RESPONSE 수정
     * TODO validator 수정
     * TODO 접근 가능 범위 수정
     * TODO 관리자가 예약 신청, 승인
     */
    private const _STD_KOR_RES_STORE_OVER = "1일 최대 스케줄 예약 횟수를 초과하였습니다.";
    private const _STD_KOR_RES_STORE_DUPLICATE = "이미 예약한 스케줄입니다.";
    private const _STD_KOR_RES_STORE_SUCCESS = "일 스케줄 예약이 성공하였습니다.";
    private const _STD_KOR_RES_STORE_FAILURE = "스케줄 예약에 실패하였습니다.";

    private const _STD_KOR_RES_INDEX_SUCCESS = "스케줄 예약 목록 조회에 성공하였습니다.";
    private const _STD_KOR_RES_INDEX_FAILURE = "등록된 스케줄 예약이 없습니다.";

    private const _STD_KOR_RES_DELETE_SUCCESS = "예약한 스케줄이 삭제되었습니다.";
    private const _STD_KOR_RES_DELETE_FAILURE = "예약한 스케줄 삭제에 실패하였습니다.";

    private const _STD_FOR_RES_SHOW_SUCCESS = "스케줄 신청 학생 명단 조회에 성공하였습니다.";
    private const _STD_FOR_RES_SHOW_FAILURE = "스케줄 신청 학생 명단 조회를 실패하였습니다.";

    /**
     * 한국인학생 - 예약 신청
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'res_sch' => 'required|integer',
            'res_std_kor' => 'required|integer',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => $validator->errors(),
            ], 422);
        }

        $setting_value = Setting::orderBy('setting_date', 'DESC')->get()->first();      /* 환경설정 변수 */

        // 하루 최대 예약 횟수 제한 조건 검색.
        $isOverCountRes = Reservation::where('res_std_kor', $request->res_std_kor)
            ->whereDate('created_at', date("Y-m-d"))
            ->count();

        if ($isOverCountRes >= $setting_value->max_res_per_day) {
            return response()->json([
                'message' => '하루 최대 예약 가능 횟수를 초과하였습니다.',
            ], 404);
        }

        // 중복 예약 방지를 위한 조회.
        $isDuplicateRes = Reservation::where('res_sch', $request->res_sch)
            ->where('res_std_kor', $request->res_std_kor)->get()->first();

        if ($isDuplicateRes) {
            return response()->json([
                'message' => '이미 등록된 스케줄입니다.',
            ], 404);
        }

        $create_reservation = Reservation::create([
            'res_sch' => $request->res_sch,
            'res_std_kor' => $request->res_std_kor,
        ]);

        return response()->json([
            'message' => '예약 신청 완료',
            'result' => $create_reservation,
        ], 201);
    }

    /**
     * 한국인학생 - 해당 일자 예약 조회
     *
     * @return \Illuminate\Http\Response
     */
    public function show()
    {
        // 사용자 정보 -> 학번 가져오기.
        $res_std_kor = 1955408;
        $sch_start_date = "2020-08-10";

        $result_reservations = Reservation::select('std_for_lang', 'std_for_name', 'sch_start_date', 'sch_end_date', 'res_state_of_permission', 'res_state_of_attendance', 'sch_state_of_result_input', 'sch_state_of_permission', 'sch_for_zoom_pw')
            ->join('schedules as sch', 'sch.sch_id', '=', 'reservations.res_sch')
            ->join('student_foreigners as for', 'for.std_for_id', '=', 'sch.sch_std_for')
            ->where('reservations.res_std_kor', $res_std_kor)
            ->whereDate('sch.sch_start_date', $sch_start_date)
            ->get();

        // TODO 신청한 예약이 없을 경우
        return response()->json([
            'message' => '진행중인 예약 조회 완료',
            'result' => $result_reservations,
        ], 200);
    }

    /**
     * 한국인학생 - 내 예약 일정 삭제
     *
     * @param int $id
     * @return \Illuminate\Http\Response
     */
    public function destroy(Reservation $res_id)
    {
        $res_id->delete();

        return response()->json([
            'message' => '예약 삭제 완료',
        ], 200);
    }

    /**
     * 유학생 - 해당 스케줄 신청 학생 명단 조회
     *
     * @param int $sch_id
     * @return \Illuminate\Http\Response
     */
    public function showReservation($sch_id)
    {
        // TODO Schedule $sch_id
        $result_foreigner_reservation = Reservation::select('res_id', 'std_kor_id', 'std_kor_name', 'std_kor_phone', 'res_state_of_permission', 'res_state_of_attendance')
            ->join('student_koreans as kor', 'kor.std_kor_id', 'reservations.res_std_kor')
            ->where('reservations.res_sch', $sch_id)
            ->get();

        return response()->json([
            'message' => '해당 스케줄에 대한 예약 조회 성공.',
            'result' => $result_foreigner_reservation,
        ], 200);
    }

    /**
     * 유학생 - 해당 스케줄 신청 학생 명단 승인
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\Response
     */
    public function updateReservaion(Request $request)
    {
        // TODO JSON_DECODE 수정필요
        $data = json_decode($request->getContent(), true);

        // TODO 반복문 제거 -> whereIN 으 수정
        // 각 예약에 대한 한국인 학생 승인 업데이트
        foreach ($data['reservation'] as $reservation) {
            $validator = Validator::make($reservation, [
                'res_id' => 'required|integer',
                'res_sch' => 'required|integer',
                'res_state_of_permission' => 'required|boolean',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'message' => $validator->errors(),
                ], 422);
            }

            // 해당 예약에 대한 정보 조회 -> 승인여부 업데이트.
            $reservation_data = Reservation::where('res_id', $reservation['res_id'])->get()->first();

            /**
             * 기존 퍼미션 -> true,
             * 변경 퍼미션 -> true
             * => 변경 X
             *
             * 기존 퍼미션 -> false,
             * 변경 퍼미션 -> false
             * => 변경 X
             */

            // 기존 퍼미션 -> false == ( 허가 X ) => 0
            // 변경 퍼미션 -> true  == ( 허가 O ) => 1
            // => 카운트 ++
            if (!$reservation_data->res_state_of_permission && $reservation['res_state_of_permission']) {
                $isAddMode = true;
            }
            // 기존 퍼미션 -> true
            // 변경 퍼미션 -> false
            // => 카운트 --
            else if ($reservation_data->res_state_of_permission && !$reservation['res_state_of_permission']) {
                $isAddMode = false;
            }

            $reservation_data->update([
                'res_state_of_permission' => $reservation['res_state_of_permission'],
            ]);

            // 스케줄 데이터 조회
            $schedule = Schedule::find($reservation['res_sch']);

            // 스케줄 - 학생 수 업데이트
            if (isset($isAddMode)) {
                $isAddMode ? $schedule->increment('sch_res_count') : $schedule->decrement('sch_res_count');
                unset($isAddMode);
            }
        }

        return response()->json([
            'message' => '해당 스케줄에 대한 학생 승인 업데이트 완료.',
        ], 200);
    }

    /**
     * 유학생 - 해당 스케줄 출석 결과 입력
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\Response
     */
    public function inputResult(Request $request)
    {
        // 이미지 사진 Validation 확인.
        if (empty($request->file('result_start_img')) || empty($request->file('result_end_img'))) {
            return response()->json([
                'message' => '결과 사진을 올려주세요. 사진은 총 2장 시작, 끝 사진이 필요합니다.',
            ], 422);
        }

        // 각 예약에 대한 한국인 학생 결과 업데이트
        foreach ($request->reservation as $res_id => $reservation_result) {
            // 해당 예약건이 존재하는지 확인.
            $reservation_data = Reservation::where('res_id', $res_id)->get()->first();

            // Validation :: res_id & reservation_result
            if (!$reservation_data) {
                return response()->json([
                    'message' => $res_id . ' 번의 예약이 존재하지 않습니다.',
                ], 422);
            }

            // 해당 예약에 대한 정보 조회 -> 출석결과 업데이트.
            $reservation_data->update([
                'res_state_of_attendance' => $reservation_result,
            ]);
        }

        // 유학생 해당 스케줄 결과 입력 booleanValue 업데이트.
        $schedule_data = Schedule::find($reservation_data['res_sch']);
        // dd($schedule_data);
        $schedule_data->update(['sch_state_of_result_input' => true]);

        // 파일 이름 규칙 정의.
        $foreigner_id = $schedule_data['sch_std_for'];
        $start_time = explode(' ', str_replace(':', '-', $schedule_data['sch_start_date']));
        $end_time = explode(' ', str_replace(':', '-', $schedule_data['sch_end_date']));
        $file_name_start = "{$start_time[0]}-{$foreigner_id}-{$start_time[1]}-S";
        $file_name_end = "{$end_time[0]}-{$foreigner_id}-{$end_time[1]}-E";

        // 로컬 스토리지에 이미지 파일 저장 -> 경로 반환
        $path_to_start_time = $this->set_img($request->file('result_start_img'), $file_name_start);
        $path_to_end_time = $this->set_img($request->file('result_end_img'), $file_name_end);

        try {
            SchedulesResultImg::create([
                'sch_id' => $schedule_data['sch_id'],
                'start_img_url' => $path_to_start_time,
                'end_img_url' => $path_to_end_time,
            ]);
        } // 유학생 -> 이미지 재 업로드 요청 로직.
        catch (Exception $e) {
            SchedulesResultImg::find($schedule_data['sch_id'])->update([
                'start_img_url' => $path_to_start_time,
                'end_img_url' => $path_to_end_time,
            ]);
        }
        // Storage::download('public/1701314.png');                                     /* ( 추후 써먹을것 ) 이미지 다운로드 */

        return response()->json([
            'message' => '해당 스케줄에 대한 학생 결과 입력 완료.',
        ], 200);
    }

    public function set_img($img_file, $img_name)
    {
        $extension = $img_file->extension();                                           /* 확장자 얻기 */
        $image_path = $img_name . "." . $extension;

        //TODO 파일 경로 수정.
        Storage::putFileAs(                                            /* 파일 저장 후 경로 반환 */
            'public',
            $img_file,
            $image_path
        );

        return $image_path;
    }

    public function get_img($img_name)
    {
        $img_url = 'http://127.0.0.1:8000' . Storage::url('public/' . $img_name);       /* 이미지 URL */
        return $img_url;
    }
}
