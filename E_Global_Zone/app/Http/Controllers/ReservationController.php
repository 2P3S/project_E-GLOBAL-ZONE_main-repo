<?php

namespace App\Http\Controllers;

use App\Reservation;
use App\Schedule;
use App\Student_korean;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ReservationController extends Controller
{
    /**
     * 한국인학생 - 예약 신청
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * 한국인학생 - 내 예약 일정 조회
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
    }

    /**
     * 한국인학생 - 내 예약 일정 삭제
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
    }

    /**
     * 유학생 - 해당 스케줄 신청 학생 명단 조회
     *
     * @param  int  $sch_id
     * @return \Illuminate\Http\Response
     */
    public function showReservation($sch_id)
    {
        $result_foreigner_reservation = Reservation::where('res_sch', $sch_id)->get();

        // 각 예약에 대한 한국인 학생 정보 추가.
        foreach ($result_foreigner_reservation as $reservation) {
            $student_data = Student_korean::where('std_kor_id', $reservation->res_std_kor)->get()->first();
            $reservation->{"res_std_kor"} = $student_data;
        }

        return response()->json([
            'message' => '해당 스케줄에 대한 예약 조회 성공.',
            'result' => $result_foreigner_reservation,
        ], 200);
    }

    /**
     * 유학생 - 해당 스케줄 신청 학생 명단 승인
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function updateReservaion(Request $request)
    {
        $data = json_decode($request->getContent(), true);

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
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function storeResult(Request $request)
    {
        $data = json_decode($request->getContent(), true);

        // 각 예약에 대한 한국인 학생 결과 업데이트
        foreach ($data['reservation'] as $reservation) {
            $validator = Validator::make($reservation, [
                'res_id' => 'required|integer',
                'res_state_of_attendance' => 'required|boolean',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'message' => $validator->errors(),
                ], 422);
            }

            // 해당 예약에 대한 정보 조회 -> 출석결과 업데이트.
            $reservation_data = Reservation::where('res_id', $reservation['res_id'])->get()->first();
            $reservation_data->update([
                'res_state_of_attendance' => $reservation['res_state_of_attendance'],
            ]);
        }

        return response()->json([
            'message' => '해당 스케줄에 대한 학생 결과 입력 완료.',
        ], 200);
    }
}
