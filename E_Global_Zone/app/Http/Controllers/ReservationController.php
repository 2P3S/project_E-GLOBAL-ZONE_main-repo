<?php

namespace App\Http\Controllers;

use App\Reservation;
use App\Section;
use App\Schedule;
use App\Student_korean;
use App\Student_foreigner;
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
        //TODO 학생 학번 받아올 수 있으면 res_sch를 parms로 받아오자.
        $validator = Validator::make($request->all(), [
            'res_sch' => 'required|integer',
            'res_std_kor' => 'required|integer',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => $validator->errors(),
            ], 422);
        }

        // 중복 예약 방지를 위한 조회.
        $isDuplicateRes = Reservation::where('res_sch', $request->res_sch)
            ->where('res_std_kor', $request->res_std_kor)->get()->first();

        if ($isDuplicateRes)
            return response()->json([
                'message' => '이미 등록된 스케줄입니다.',
            ], 404);

        $create_reservation = Reservation::create([
            'res_sch' => $request->res_sch,
            'res_std_kor' => $request->res_std_kor,
        ]);

        return response()->json([
            'message' => '예약 신청 완료',
            'result' => $create_reservation,
        ], 200);
    }

    /**
     * 한국인학생 - 내 예약 일정 조회
     *
     * @return \Illuminate\Http\Response
     */
    public function show()
    {
        // 사용자 정보 -> 학번 가져오기.
        $res_std_kor = 1955408;
        $result_reservations = Reservation::where('res_std_kor', $res_std_kor)
            ->where(function ($query) {
                $query->orwhere('res_state_of_permission', '!=', true)
                    ->orwhere('res_state_of_attendance', '!=', true);
            })
            ->get();

        foreach ($result_reservations as $reservation) {
            // 스케줄 정보 추가.
            $schedule_data = Schedule::find($reservation->res_sch);
            $reservation->{"res_sch"} = $schedule_data;

            // 유학생 정보 추가.
            $foreigner_data = Student_foreigner::where('std_for_id', $schedule_data->sch_std_for)
                ->select('std_for_id', 'std_for_lang', 'std_for_contry')
                ->get()->first();

            $schedule_data->{"sch_std_for"} = $foreigner_data;
        }

        return response()->json([
            'message' => '진행중인 예약 조회 완료',
            'result' => $result_reservations,
        ], 200);
    }

    /**
     * 한국인학생 - 내 예약 일정 삭제
     *
     * @param  int  $id
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
