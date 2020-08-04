<?php

namespace App\Http\Controllers;

use App\Student_foreigner;
use Illuminate\Http\Request;

class ForeignerController extends Controller
{
    /**
     * 학기별 전체 유학생 정보 조회
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //
    }

    /**
     * 특정 유학생 정보 조회
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
    }

    /**
     * 학기별 유학생 등록
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * 학기별 유학생 수정
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function update($id)
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
     * 유학생 계정 생성
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
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function updateAccount($id)
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
}
