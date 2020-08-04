<?php

namespace App\Http\Controllers;

use App\Student_korean;
use Illuminate\Http\Request;

class KoreanController extends Controller
{
    /**
     * 계정 등록 - 대기 명단 조회
     *
     * @return \Illuminate\Http\Response
     */
    public function indexApproval()
    {
        //
    }

    /**
     * 계정 등록 - 승인
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function updateApproval(Request $request, $id)
    {
        //
    }

    /**
     * 학년도별 한국인 학생 정보 조회
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $allSchdules = Student_korean::all();

        return $allSchdules;
    }

    /**
     * 한국인 학생 계정 생성
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function registerAccount(Request $request)
    {
        //
    }

    /**
     * 비밀번호 초기화
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function resetAccount(Request $request, $id)
    {
        //
    }

    /**
     * 계정 삭제
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroyAccount($id)
    {
        //
    }

    /**
     * 이용 제한 등록
     *
     * @return \Illuminate\Http\Response
     */
    public function indexRestrict()
    {
        //
    }

    /**
     * 이용 제한 해제
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroyRestrict($id)
    {
        //
    }

    /**
     * 학년도별 학생정보 CSV 파일 다운로드
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    // public function csv($id)
    // {
    //     //
    // }
}
