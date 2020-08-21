<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Notifications\Notifiable;

/**
 * @method static whereIn(string $string, array $std_kor_id)
 * @method static whereDate(string $string, string $operator, false|string $date)
 * @method static join(string $string, string $string1, string $string2)
 */
class Reservation extends Model
{
    use Notifiable;

    /* 기본키 설정 */
    protected $primaryKey = 'res_id';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $guarded = [];

    // 한명 또는 여러명의 학생을 조회 가능
    public function get_std_kor_res(
        array $std_kor_id
    ): object
    {
        $settings = new Setting();
        $date_sch_res_possible = $settings->get_res_possible_date();

        return
            self::join('schedules', 'reservations.res_sch', 'schedules.sch_id')
                ->whereDate('sch_start_date', '>=', $date_sch_res_possible['from'])
                ->whereDate("sch_start_date", "<", $date_sch_res_possible['to'])
                ->whereIn('res_std_kor', $std_kor_id)
                ->orderBy('res_std_kor')->get();
    }
}
