<?php

namespace App\Http\Controllers;

use App\Section;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class SectionController extends Controller
{
    /**
     * 등록된 전체 학기 목록 조회
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return response()->json([
            'message' => '등록된 학기 목록 조회',
            'result' => Section::all(),
        ], 200);
    }

    /**
     * 학기 등록
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'sect_name' => 'required|string',
            'sect_start_date' => 'required|date',
            'sect_end_date' => 'required|date',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => $validator->errors(),
            ], 422);
        }

        $create_section = Section::create([
            'sect_name' => $request->sect_name,
            'sect_start_date' => $request->sect_start_date,
            'sect_end_date' => $request->sect_end_date,
        ]);

        return response()->json([
            'message' => '학기 등록 완료',
            'result' => $create_section,
        ], 201);
    }

    /**
     * 학기 수정
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $sect_id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Section $sect_id)
    {
        $validator = Validator::make($request->all(), [
            'sect_name' => 'required|string',
            'sect_start_date' => 'required|date',
            'sect_end_date' => 'required|date',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => $validator->errors(),
            ], 422);
        }

        $update_section = $sect_id->update([
            'sect_name' => $request->sect_name,
            'sect_start_date' => $request->sect_start_date,
            'sect_end_date' => $request->sect_end_date,
        ]);

        return response()->json([
            'message' => '스케줄 업데이트 완료',
            'result' => $update_section,
        ], 200);
    }

    /**
     * 학기 삭제
     *
     * @param  int  $sect_id
     * @return \Illuminate\Http\Response
     */
    public function destroy(Section $sect_id)
    {
        $sect_id->delete();

        return response()->json([
            'message' => '학기 삭제 완료',
        ], 204);
    }
}
