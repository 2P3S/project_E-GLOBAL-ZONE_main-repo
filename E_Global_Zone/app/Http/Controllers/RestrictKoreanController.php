<?php

namespace App\Http\Controllers;

use App\Restricted_student_korean;
use App\Section;
use App\Student_korean;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class RestrictKoreanController extends Controller
{
    private const _INDEX_SUCCESS = " 학생의 이용 제한 사유 조회가 완료되었습니다.";
    private const _INDEX_ERROR = "이용 제한 정보 조회에 실패하였습니다.";
    // -> 발생 시, DB 점검 필요

    private const _SECTION_ERROR = "학기 전체 제한은 학기가 시작한 후 이용 가능합니다.";

    private const _REGISTER_SUCCESS = " 학생의 이용 제한 등록이 완료되었습니다.";
    private const _REGISTER_ERROR = "이미 이용 제한된 학생입니다.";

    private const _UPDATE_SUCCESS = " 학생의 이용 제한 해제가 완료되었습니다.";

    private $restrict;

    public function __construct()
    {
        $this->restrict = new Restricted_student_korean();
    }

    // 한국인학생 이용제한 사유 조회
    public function index(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'std_kor_id' => 'required|integer|min:1000000|max:9999999',
            'guard' => 'required|string|in:admin'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => $validator->errors(),
            ], 422);
        }

        $restricted_kor_data = $this->restrict->get_korean_restricted_info($request['std_kor_id']);

        if (empty($restricted_kor_data->first()) || $restricted_kor_data->count() == 0) {
            return response()->json([
                "message" => self::_INDEX_ERROR
            ], 202);
        }

        return response()->json([
            "message" => $restricted_kor_data['std_kor_name'] . self::_INDEX_SUCCESS,
            "data" => $restricted_kor_data
        ], 200);
    }

    // 한국인학생 이용제한 등록
    public function register(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'std_kor_id' => 'required|integer|min:1000000|max:9999999',
            'restrict_reason' => 'required|string|max:300',
            'restrict_period' => 'required|integer|min:1|max:999',
            'guard' => 'required|string|in:admin'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => $validator->errors(),
            ], 422);
        }

        // 해당 학생 이용 제한 등록 여부 검사.
        $student = Student_korean::find($request['std_kor_id']);

        if ($student['std_kor_state_of_restriction'] === (int)true) {
            return response()->json([
                'message' => self::_REGISTER_ERROR
            ], 202);
        }

        // 학기 전체 이용 제한
        if ((int)$request['restrict_period'] === 999) {
            // 현재 학기 정보 조회
            $sect_data = Section::whereDate('sect_end_date', '>=', date("Y-m-d"))
                ->get()
                ->first();

            if (empty($sect_data)) {
                return response()->json([
                    'message' => self::_SECTION_ERROR
                ], 422);
            }
            $restricted_kor_data =
                $this->restrict->set_korean_restrict($request['std_kor_id'], $request['restrict_reason'], $sect_data['sect_end_date']);
        }
        // 현재 날짜 기준 +N day 이용 제한
        else {
            $restrict_period = (int)$request['restrict_period'] + 1;
            $restrict_end_date = date("Y-m-d", strtotime("+{$restrict_period} days"));

            $restricted_kor_data =
                $this->restrict->set_korean_restrict($request['std_kor_id'], $request['restrict_reason'], $restrict_end_date);
        }

        // 한국인 학생 이용 제한 상태 변경.
        $student->update([
            'std_kor_state_of_restriction' => (int)true
        ]);

        $restricted_kor_data = $this->restrict->get_korean_restricted_info($request['std_kor_id']);

        return response()->json([
            "message" => $restricted_kor_data['std_kor_name'] . self::_REGISTER_SUCCESS,
            "restrict_date" => $restricted_kor_data['restrict_start_date'] . " ~ " . $restricted_kor_data['restrict_end_date'],
            "restrict_reason" => $restricted_kor_data['restrict_reason']
        ], 201);
    }

    // 한국인 학생 이용제한 해제
    public function update(
        Request $request,
        Restricted_student_korean $restrict_id
    ): JsonResponse {
        // <<-- Request 요청 관리자 권한 검사.
        $is_admin = self::is_admin($request);

        if (is_object($is_admin)) {
            return $is_admin;
        }
        // -->>

        $std_kor_id = $restrict_id['restrict_std_kor'];
        $student = Student_korean::find($std_kor_id);

        if ($student['std_kor_state_of_restriction'] === (int)false) {
            return response()->json([
                "message" => self::_INDEX_ERROR
            ], 202);
        }

        $student->update([
            'std_kor_state_of_restriction' => (int)false
        ]);

        $restrict_id->update([
            'restrict_end_date' => now()
        ]);

        return response()->json([
            "message" => $student['std_kor_name'] . self::_UPDATE_SUCCESS,
        ], 200);
    }
}
