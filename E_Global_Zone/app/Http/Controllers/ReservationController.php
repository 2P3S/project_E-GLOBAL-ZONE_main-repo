<?php

namespace App\Http\Controllers;

use App\Reservation;
use App\Schedule;
use App\SchedulesResultImg;
use App\Setting;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

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
     * TODO 한국인 학생 학기별 미팅 목록 조회
     * TODO 유학생 주단위 스케줄 조회
     */
    private const _STD_KOR_RES_STORE_OVER = "1일 최대 스케줄 예약 횟수를 초과하였습니다.";
    private const _STD_KOR_RES_STORE_DUPLICATE = "이미 예약한 스케줄입니다.";
    private const _STD_KOR_RES_STORE_IMPOSSIBILITY = "예약 불가능한 스케줄입니다.";
    private const _STD_KOR_RES_STORE_SUCCESS = "일 스케줄 예약이 성공하였습니다.";
    private const _STD_KOR_RES_STORE_FAILURE = "스케줄 예약에 실패하였습니다.";

    private const _STD_KOR_RES_INDEX_FAILURE = "스케줄 예약 목록 조회에 실패하였습니다.";

    private const _STD_KOR_RES_DELETE_SUCCESS = "예약한 스케줄이 삭제되었습니다.";
    private const _STD_KOR_RES_DELETE_FAILURE = "예약한 스케줄 삭제에 실패하였습니다.";

    private const _STD_FOR_RES_SHOW_FAILURE = "스케줄 예약 학생 명단 조회를 실패하였습니다.";

    private $schedule = null;
    private $reservation = null;

    public function __construct()
    {
        $this->schedule = new Schedule();
        $this->reservation = new Reservation();
    }

    /**
     * 유효성 검사
     *
     * @param Request $request
     * @param array $rules
     * @param string $error_msg
     * @return bool|JsonResponse
     */
    // TODO 컨트롤러로 합쳐야 함
    private function request_validator(
        Request $request,
        array $rules,
        string $error_msg
    )
    {
        $validator = Validator::make($request->all(), $rules);

        if ($validator->fails()) {
            return response()->json([
                'message' => $error_msg,
                'error' => $validator->errors(),
            ]);
        }

        return true;
    }

    /**
     * 한국인학생 - 예약 신청
     *
     * @param Request $request
     * @param Schedule $sch_id
     * @return JsonResponse
     */
    public function std_kor_store_res(
        Request $request,
        Schedule $sch_id
    ): JsonResponse
    {
        // <<-- 신청한 스케줄이 예약 신청 가능한지 확인(시작, 마감일 기준)
        $is_res_possibility = $this->schedule->check_res_possibility($sch_id);

        if (!$is_res_possibility) {
            return response()->json([
                'message' => self::_STD_KOR_RES_STORE_IMPOSSIBILITY
            ], 205);
        }
        // -->>

        // <<-- Request 유효성 검사
        $rules = [
            'res_std_kor' => 'required|integer|min:1000000|max:9999999',
        ];

        $validated_request = $this->request_validator(
            $request, $rules, self::_STD_KOR_RES_STORE_FAILURE
        );

        if (is_object($validated_request)) {
            return $validated_request;
        }
        // -->>

        // <<-- 기존 예약 횟수 및 하루 최대 예약 횟수 비교
        $std_kor_id = $request->input('res_std_kor');
        $max_res_per_day = Setting::get_setting_value()['max_res_per_day'];

        $std_kor_res_list = $this->reservation
            ->get_std_kor_res(
                [$std_kor_id]
            );

        $std_kor_res_count = $std_kor_res_list->count();

        if ($std_kor_res_count >= $max_res_per_day) {
            return response()->json([
                'message' => self::_STD_KOR_RES_STORE_OVER
            ], 205);
        }
        // -->>

        // <<-- 예약 중복 여부 검사
        $is_already_res = $std_kor_res_list->where('res_sch', $sch_id['sch_id'])->count();

        if ($is_already_res) {
            return response()->json([
                'message' => self::_STD_KOR_RES_STORE_DUPLICATE
            ], 205);
        }
        // -->>

        $created_res = Reservation::create([
            'res_sch' => $sch_id['sch_id'],
            'res_std_kor' => $std_kor_id
        ]);

        return response()->json([
            'message' => '예약 신청 완료',
            'data' => $created_res,
        ], 201);
    }

    /**
     * 한국인학생 - 해당 일자에 대한 예약 조회
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function std_kor_show_res_by_date(Request $request): JsonResponse
    {
        $rules = [
            'search_date' => 'required|date|after or equal:' . date("Y-m-d")
        ];

        $validated_request = $this->request_validator(
            $request, $rules, self::_STD_KOR_RES_INDEX_FAILURE
        );

        if (is_object($validated_request)) {
            return $validated_request;
        }

        // TODO (CASE 1) 토큰으로 한국인 학생 정보 확인 -> 학번 조회
        // TODO (CASE 2) 구글 로그인 리다이렉션으로 한국인 학생 정보 확인 -> email 조회
        // $std_kor_id = $request->user($request['guard'])['std_kor_id'];
        $std_kor_id = 1321704;
        $search_date = $request->input('search_date');
        return $this->reservation->get_std_kor_res_by_date($std_kor_id, $search_date);
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
            return response()->json([
                'message' => self::_STD_KOR_RES_DELETE_FAILURE
            ], 205);
        }

        return response()->json([
            'message' => self::_STD_KOR_RES_DELETE_SUCCESS
        ], 200);
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
    ): JsonResponse
    {
        // TODO validation, 토큰 -> 유학생 검사 추가(중요)
        // $std_for_id = $request->user($request->input('guard'));
        $std_for_id = "1753176";

        return $this->schedule->get_sch_res_std_kor_list($sch_id, $std_for_id);
    }

    /**
     * 유학생 - 해당 스케줄 신청 학생 명단 승인
     *
     * @param Request $request
     * @return Response
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
     * @param Request $request
     * @return Response
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
