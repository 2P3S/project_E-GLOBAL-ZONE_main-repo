<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Notifications\Notifiable;

class Schedule extends Model
{
    use Notifiable;

    /* 기본키 설정 */
    protected $primaryKey = 'sch_id';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'sch_id',
        'sch_sect',
        'sch_std_for',
        'sch_start_date',
        'sch_end_date',
        'sch_res_count',
        'sch_state_of_result_input',
        'sch_state_of_permission',
        'sch_for_zoom_pw'
    ];

    public $timestamps = false;
}
