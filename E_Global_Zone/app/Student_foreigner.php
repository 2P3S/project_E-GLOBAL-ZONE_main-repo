<?php

namespace App;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use SMartins\PassportMultiauth\HasMultiAuthApiTokens;

/*
 * TODO
 * 작성일 : 2020-08-08
 * 작성자 : 정재순
 * 내용 : Laravel Passport Multi-Auth
 * 세부내용
 *   - HasMultiAuthApiTokens 추가
 *   - $fillable, $hidden 수정 : password
 *   - 오타 수정 : std_for_country
 */

class Student_foreigner extends Authenticatable
{
    use Notifiable, HasMultiAuthApiTokens;

    protected $guard = 'foreigner';

    /* 기본키 설정 */
    protected $primaryKey = 'std_for_id';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'std_for_id',
        'password',
        'std_for_dept',
        'std_for_name',
        'std_for_lang',
        'std_for_country'
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'password'
    ];
}