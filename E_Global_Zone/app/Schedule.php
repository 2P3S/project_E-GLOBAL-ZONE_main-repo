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

    // 오늘 기준 예약 신청 가능 여부를 검사
    public function check_res_possibility(
        Schedule $schedule
    ): bool
    {
        $date_sch = date("Y-m-d", strtotime($schedule['sch_start_date']));

        $settings = new Setting();
        $date_sch_res_possible = $settings->get_res_possible_date();

        return (
            $date_sch_res_possible['from'] <= $date_sch &&
            $date_sch < $date_sch_res_possible['to']
        );

    }
}
