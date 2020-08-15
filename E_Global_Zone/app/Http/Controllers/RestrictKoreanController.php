<?php

namespace App\Http\Controllers;

use App\Restricted_student_korean;
use App\Student_korean;
use Illuminate\Http\JsonResponse as Json;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class RestrictKoreanController extends Controller
{
    private const _SECTION_ERROR = "유효하지 않은 학기 정보입니다.";
    private const _REGISTER_ERROR = "이미 이용 제한된 학생입니다.";
    private const _REGISTER_SUCCESS = " 학생의 이용 제한 등록이 완료되었습니다.";

    public function index(Request $request): Json
    {
        echo "조회";
    }

    public function register(Request $request): Json
    {
        $validator = Validator::make($request->all(), [
            'std_kor_id' => 'required|numeric|min:1000000|max:9999999',
            'restrict_reason' => 'required|string|max:300',
            'restrict_period' => 'required|numeric|min:1|max:999',
            'sect_id' => 'required|numeric|min:1',
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
        if ($student['std_kor_state_of_restriction'] === 1) {
            return response()->json([
                'message' => self::_REGISTER_ERROR
            ], 205);
        }

        $student->update([
            'std_kor_state_of_restriction' => 1
        ]);

        // 학기 전체 이용 제한
        if ((int)$request['restrict_period'] === 999) {
            $restricted_student_korean = Restricted_student_korean::create([
                'restrict_std_kor' => $request['std_kor_id'],
                'restrict_reason' => $request['restrict_reason'],
                'restrict_end_date' => $request['sect_end_date']
            ]);
        } else {
            $restrict_period = (int)$request['restrict_period'] + 1;

            $restricted_student_korean = Restricted_student_korean::create([
                'restrict_std_kor' => $request['std_kor_id'],
                'restrict_reason' => $request['restrict_reason'],
                'restrict_end_date' => date("Y-m-d", strtotime("+{$restrict_period} days"))
            ]);
        }


        $restrict_std_kor_data = $restricted_student_korean
            ->join('student_koreans as std_kor', 'std_kor.std_kor_id', 'restricted_student_koreans.restrict_std_kor')
            ->first();

        return response()->json([
            "message" => $restrict_std_kor_data['std_kor_name'] . self::_REGISTER_SUCCESS,
            "restrict_date" => $restrict_std_kor_data['restrict_start_date'] . " ~ " . $restrict_std_kor_data['restrict_end_date'],
            "restrict_reason" => $restrict_std_kor_data['restrict_reason']
        ], 200);

    }

    public function update()
    {
        echo "수정";
    }


}
