<?php

namespace App;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use SMartins\PassportMultiauth\HasMultiAuthApiTokens;

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
