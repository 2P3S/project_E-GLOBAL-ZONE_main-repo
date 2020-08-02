<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Notifications\Notifiable;

class Setting extends Model
{
    use Notifiable;
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'max_res_per_day',
        'max_std_once',
        'res_start_period',
        'res_end_period',
        'once_meet_time',
        'once_rest_time',
        'min_absent',
        'max_absent',
        'once_limit_period',
        'result_input_deadline'
    ];

}
