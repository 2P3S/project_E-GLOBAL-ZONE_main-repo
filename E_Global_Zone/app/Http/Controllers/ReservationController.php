<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

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
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function showReservation($id)
    {
        //
    }

    /**
     * 유학생 - 해당 스케줄 신청 학생 명단 승인
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function updateReservaion(Request $request, $id)
    {
        //
    }

    /**
     * 유학생 - 해당 스케줄 출석 결과 입력
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function storeResult(Request $request)
    {
        //
    }
}
