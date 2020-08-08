<?php

namespace App\Http\Controllers;

use App\Schedule;
use App\Student_foreigner;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ScheduleController extends Controller
{
    //TODO whereDate / whereMonth / whereDay / whereYear / whereTime 메서드 사용하기.
    /**
     * 해당 주차 전체 스케줄 조회
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'sch_start_date' => 'required|date',
            'sch_end_date' => 'required|date',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => $validator->errors(),
            ], 422);
        }

        //TODO 날짜 계산 찾아보기.
        $allSchdules = Schedule::select('sch_id', 'sch_res_count','sch_start_date', 'sch_end_date', 'std_for_name', 'std_for_lang')
            ->where('schedules.sch_start_date', '>=', $request->sch_start_date)
            ->where('schedules.sch_start_date', '<=', $request->sch_end_date)
            ->join('student_foreigners as for', 'schedules.sch_std_for', 'for.std_for_id')
            ->get();

        // 등록된 스케줄이 없을 경우
        if ($allSchdules->count() === 0) {
            return response()->json([
                'message' => '등록된 스케줄이 없습니다.',
            ], 404);
        }

        return response()->json([
            'message' => '일정 조회를 성공하였습니다.',
            'result' => $allSchdules,
        ], 200);
    }

    /**
     * 유학생 - 특정 날짜 개인 스케줄 조회
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($date)
    {
        $std_for_id = 1372367;
        $result_foreigner_schedules = Schedule::where('sch_std_for', $std_for_id)
            ->whereDate('sch_start_date', $date)
            ->get();

        return $result_foreigner_schedules;
    }

    /**
     * 스케줄 등록
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        // 줌 비밀번호 생성
        $zoom_pw = mt_rand(1000, 9999);

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

        $create_schedule = Schedule::create([
            'sch_sect' => $request->sch_sect,
            'sch_std_for' => $request->sch_std_for,
            'sch_start_date' => $request->sch_start_date,
            'sch_end_date' => $request->sch_end_date,
            'sch_for_zoom_pw' => $zoom_pw,
        ]);

        return response()->json([
            'message' => '스케줄 생성 완료',
            'result' => $create_schedule,
        ], 201);
    }

    /**
     * 특정 스케줄 업데이트
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Schedule $sch_id)
    {

        //TODO 입력한 날짜에 대한 벨리데이션 검사 기능 추가..
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
     * 특정 스케줄 삭제
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy(Schedule $sch_id)
    {
        $sch_id->delete();

        return response()->json([
            'message' => '스케줄 삭제 완료',
        ], 204);
    }
}
