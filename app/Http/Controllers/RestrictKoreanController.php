<?php

namespace App\Http\Controllers;

use App\Restricted_student_korean;
use App\Student_korean;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class RestrictKoreanController extends Controller
{
    // TODO request  값 사용 로직 변경하기

    private const _INDEX_SUCCESS = " 학생의 이용 제한을 해제하시겠습니까?";
    private const _INDEX_ERROR = "이용 제한 정보 조회에 실패하였습니다.";
    // -> 발생 시, DB 점검 필요

    private const _SECTION_ERROR = "유효하지 않은 학기 정보입니다.";

    private const _REGISTER_SUCCESS = " 학생의 이용 제한 등록이 완료되었습니다.";
    private const _REGISTER_ERROR = "이미 이용 제한된 학생입니다.";

    private const _UPDATE_SUCCESS = " 학생의 이용 제한 해제가 완료되었습니다.";

    public function index(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'std_kor_id' => 'required|integer|min:1000000|max:9999999',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => $validator->errors(),
            ], 422);
        }

        $restrict_data = Restricted_student_korean::where('restrict_std_kor', $request['std_kor_id'])
            ->where('restrict_start_date', '<=', now())
            ->where('restrict_end_date', '>=', now())
            ->get();

        if (empty($restrict_data->first()) || $restrict_data->count() !== 1) {
            return response()->json([
                "message" => self::_INDEX_ERROR
            ], 202);
        }

        $restrict_std_kor_data = $restrict_data
            ->first()
            ->join('student_koreans as std_kor', 'std_kor.std_kor_id', 'restricted_student_koreans.restrict_std_kor')
            ->where('restrict_start_date', '<=', now())
            ->where('restrict_end_date', '>=', now())
            ->first();

        return response()->json([
            "message" => $restrict_std_kor_data['std_kor_name'] . self::_INDEX_SUCCESS,
            "restrict_date" => $restrict_std_kor_data['restrict_start_date'] . " ~ " . $restrict_std_kor_data['restrict_end_date'],
            "restrict_reason" => $restrict_std_kor_data['restrict_reason']
        ], 200);
    }

    public function register(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'std_kor_id' => 'required|integer|min:1000000|max:9999999',
            'restrict_reason' => 'required|string|max:300',
            'restrict_period' => 'required|integer|min:1|max:999',
            'sect_id' => 'required|integer|min:1',
            'sect_end_date' => 'required|date'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => $validator->errors(),
            ], 422);
        }

        $section = new SectionController();

        if ($section->validate_request_section($request['sect_id'], $request['sect_end_date'])) {
            return response()->json([
                'message' => self::_SECTION_ERROR
            ], 422);
        }

        $student = Student_korean::find($request['std_kor_id']);

        if ($student['std_kor_state_of_restriction'] === (int)true) {
            return response()->json([
                'message' => self::_REGISTER_ERROR
            ], 202);
        }

        $student->update([
            'std_kor_state_of_restriction' => (int)true
        ]);

        // 학기 전체 이용 제한
        if ((int)$request['restrict_period'] === 999) {
            $restrict_data = Restricted_student_korean::create([
                'restrict_std_kor' => $request['std_kor_id'],
                'restrict_reason' => $request['restrict_reason'],
                'restrict_end_date' => $request['sect_end_date']
            ]);
        } else {
            $restrict_period = (int)$request['restrict_period'] + 1;

            $restrict_data = Restricted_student_korean::create([
                'restrict_std_kor' => $request['std_kor_id'],
                'restrict_reason' => $request['restrict_reason'],
                'restrict_end_date' => date("Y-m-d", strtotime("+{$restrict_period} days"))
            ]);
        }

        $restrict_std_kor_data = $restrict_data
            ->join('student_koreans as std_kor', 'std_kor.std_kor_id', 'restricted_student_koreans.restrict_std_kor')
            ->first();

        return response()->json([
            "message" => $restrict_std_kor_data['std_kor_name'] . self::_REGISTER_SUCCESS,
            "restrict_date" => $restrict_std_kor_data['restrict_start_date'] . " ~ " . $restrict_std_kor_data['restrict_end_date'],
            "restrict_reason" => $restrict_std_kor_data['restrict_reason']
        ], 201);
    }

    public function update(Request $request, Restricted_student_korean $restrict_id): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'std_kor_id' => 'required|integer|min:1000000|max:9999999',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => $validator->errors(),
            ], 422);
        }

        $restrict_data = $restrict_id->where('restrict_std_kor', $request['std_kor_id'])->first();
        $student = Student_korean::find($request['std_kor_id']);

        if (empty($restrict_data) || $student['std_kor_state_of_restriction'] === (int)false) {
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
