<?php

namespace App\Http\Controllers;

use App\Schedule;
use App\Student_foreigner;
use App\Department;
use Illuminate\Http\Request;

class ScheduleController extends Controller
{
    /**
     * 전체 스케줄 조회
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //TODO 날짜 계산 찾아보기.
        $allSchdules = Schedule::where('sch_start_date', '>=', '2020-08-05')
            ->where('sch_start_date', '<', '2020-08-06')
            ->get();

        // 등록된 스케줄이 없을 경우
        if ($allSchdules->count() === 0) {
            return response()->json([
                'message' => '등록된 스케줄이 없습니다.',
            ], 404);
        }

        // 각 스케줄에 대한 유학생 정보 추가.
        foreach ($allSchdules as $schedule) {
            $student_data = Student_foreigner::where('std_for_id', $schedule->sch_std_for)->get()->first();
            $schedule->{"foreign_info"} = $student_data;
        }

        return response()->json([
            'message' => '일정 조회를 성공하였습니다.',
            'result' => $allSchdules,
        ], 200);
    }

    /**
     * 특정 날짜 개인 스케줄 조회
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $result_foreigner_schedules = Schedule::where('sch_std_for', $id)
            ->where('sch_start_date', '>=', '2020-08-06')
            ->where('sch_start_date', '<', '2020-08-07')
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
        //
    }

    /**
     * 특정 스케줄 업데이트
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        //
    }

    /**
     * 특정 스케줄 삭제
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
    }
}
