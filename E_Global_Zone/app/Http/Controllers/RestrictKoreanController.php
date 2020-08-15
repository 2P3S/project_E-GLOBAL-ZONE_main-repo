<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse as Json;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class RestrictKoreanController extends Controller
{
    const _SECTION_ERROR = "유효하지 않은 학기 정보입니다.";

    public function index()
    {
        echo "조회";
    }

    public function register(Request $request): Json
    {
        // 제한할 한국인 학생
        // 제한 사유
        // 제한 기간(영구 제한 선택 시 -> 9999)
        // 학기 ID,
        // 학기 종료일

        $validator = Validator::make($request->all(), [
            'std_kor_id' => 'required|numeric|min:1000000|max:9999999',
            'restrict_reason' => 'required|string|max:300',
            'restrict_period' => 'required|numeric|min:1',
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

//        Restricted_student_korean::create([
//            'restrict_std_kor'
//            'restrict_reason'
//        ])

    }

    public function update()
    {
        echo "수정";
    }


}
