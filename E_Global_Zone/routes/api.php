<?php

use Illuminate\Http\Request;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

// Route::middleware('auth:api')->get('/user', function (Request $request) {
//     return $request->user();
// });

/* 스케줄 라우터 */

Route::prefix('/schedule')->group(function () {
    /* 전체 스케줄 조회 */
    Route::get('', 'ScheduleController@index')->name('schedules.index');
    /* 스케줄 - 특정 날짜 개인(유학생, 한국인학생) 스케줄 조회 */
    Route::get('{date}', 'ScheduleController@show')->name('schedules.show');
    /* 스케줄 등록 */
    Route::post('', 'ScheduleController@store')->name('schedules.store');
    /* 특정 스케줄 업데이트 */
    Route::put('{sch_id}', 'ScheduleController@update')->name('schedules.update');
    /* 특정 스케줄 삭제 */
    Route::delete('{sch_id}', 'ScheduleController@destroy')->name('schedules.destroy');
});

/* 관리자 라우터 */
Route::prefix('/admin')->group(function () {
    /* 유학생 관리 */
    Route::prefix('/foreigner')->group(function () {
        /** 학기별 전체 유학생 정보 조회 */
        Route::get('', 'ForeignerController@index')->name('foreigners.index');
        /** 특정 유학생 정보 조회 */
        Route::get('{id}', 'ForeignerController@show')->name('foreigners.show');
        /** 학기별 유학생 등록 */
        Route::post('', 'ForeignerController@store')->name('foreigners.store');
        /** 학기별 유학생 수정 */
        Route::put('', 'ForeignerController@update')->name('foreigners.update');

        /** 유학생 계정 생성 */
        Route::post('account', 'ForeignerController@registerAccount')->name('foreigners.registerAccount');
        /** 비밀번호 초기화 */
        Route::put('account/{id}', 'ForeignerController@updateAccount')->name('foreigners.updateAccount');
        /** 계정 삭제 */
        Route::delete('account/{id}', 'ScheduleController@destroyAccount')->name('foreigners.destroyAccount');

        /** 학생정보 CSV 파일 다운로드 */
        // Route::get('data/{id}', 'ForeignerController@csv')->name('foreigners.csv');
    });

    /* 한국인학생 관리 */
    Route::prefix('/korean')->group(function () {
        /** 계정 등록 - 대기 명단 조회 */
        Route::get('approval', 'KoreanController@indexApproval')->name('koreans.indexApproval');
        /** 계정 등록 - 승인 */
        Route::put('approval', 'KoreanController@updateApproval')->name('koreans.updateApproval');

        /** 학년도별 한국인 학생 정보 조회 */
        Route::get('{id}', 'KoreanController@index')->name('koreans.index');

        /** 한국인 학생 계정 생성 */
        Route::post('account', 'KoreanController@registerAccount')->name('koreans.registerAccount');
        /** 비밀번호 초기화 */
        Route::put('account/{id}', 'KoreanController@resetAccount')->name('koreans.resetAccount');
        /** 계정 삭제 */
        Route::delete('account/{id}', 'KoreanController@destroyAccount')->name('koreans.destroyAccount');

        /** 이용 제한 등록 */
        Route::get('restrict/{id}', 'RestrictKoreanController@indexRestrict')->name('koreans.indexRestrict');
        /** 이용 제한 해제 */
        Route::delete('restrict/{id}', 'RestrictKoreanController@destroyRestrict')->name('koreans.destroyRestrict');

        /** 학년도별 학생정보 CSV 파일 다운로드 */
        // Route::get('data/{id}', 'KoreanController@csv')->name('koreans.csv');
    });
});

/* 유학생 라우터 */
Route::prefix('/foreigner')->group(function () {
    /* 예약 관련 */
    Route::prefix('/reservation')->group(function () {
        /** 해당 스케줄 신청 학생 명단 조회 */
        Route::get('{sch_id}', 'ReservationController@showReservation')->name('reservations.showReservation');
        /** 해당 스케줄 신청 학생 명단 승인 */
        Route::patch('', 'ReservationController@updateReservaion')->name('reservations.updateReservaion');
        /** 해당 스케줄 출석 결과 입력 */
        Route::post('', 'ReservationController@storeResult')->name('reservations.storeResult');
    });
});

/* 한국인학생 라우터 */
Route::prefix('/korean')->group(function () {
    /* 예약 관련 */
    Route::prefix('/reservation')->group(function () {
        /** 예약 신청 */
        Route::post('', 'ReservationController@store')->name('reservations.store');
        /** 내 예약 일정 조회 */
        Route::get('{id}', 'ReservationController@show')->name('reservations.show');
        /** 내 예약 일정 삭제 */
        Route::delete('{id}', 'ReservationController@destroy')->name('reservations.destroy');
    });
});

/* 로그인 라우터 */
Route::prefix('/auth')->group(function () {
    /* 학생 인증 관련 */
    Route::prefix('/korean')->group(function () {
        /** 로그인 */
        /** 토큰 검사 */
    });

    /* 유학생 인증 관련 */
    Route::prefix('/foreigner')->group(function () {
        /** 로그인 */
        /** 토큰 검사 */
    });

    /* 관리자 인증 관련 */
    Route::prefix('/admin')->group(function () {
        /** 로그인 */
    });
});
