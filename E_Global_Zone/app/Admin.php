<?php

namespace App;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use SMartins\PassportMultiauth\HasMultiAuthApiTokens;

/*
 * 작성일 : 2020-08-08
 * 작성자 : 정재순
 * 내용 : Laravel Passport Multi-Auth
 * 세부내용
 *   - 모델 정의
 *   - HasMultiAuthApiTokens 등록
 */

class Admin extends Authenticatable
{
    use Notifiable, HasMultiAuthApiTokens;

    protected $guard = 'admin';
    protected $primaryKey = 'id';

    protected $fillable = [
        'id', 'account', 'name'
    ];

    protected $hidden = [
        'password'
    ];
}
