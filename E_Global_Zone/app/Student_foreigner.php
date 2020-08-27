<?php

namespace App;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use SMartins\PassportMultiauth\HasMultiAuthApiTokens;

/**
 * @method static select(string $string, string $string1, string $string2, string $string3, string $string4)
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
        'std_for_country',
        'std_for_num_of_delay_permission',
        'std_for_num_of_delay_input',
        'std_for_state_of_favorite'
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
