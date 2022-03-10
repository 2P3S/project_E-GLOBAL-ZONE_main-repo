<?php

namespace App;

use App\Library\Services\Preference;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Notifications\Notifiable;

/**
 * @method static orderBy(string $string, string $string1)
 */
class Setting extends Model
{
    use Notifiable;

    /* 기본키 설정 */
    protected $primaryKey = 'setting_date';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $guarded = [];

    protected $hidden = [
        'setting_date', 'default_admin_pw', 'default_std_for_pw'
    ];

    public $timestamps = false;

    // 오늘 기준 예약 신청 가능한 날짜 범위 계산
    public function get_res_possible_date(): array
    {
        // 환경변수
        $setting_obj = new Preference();
        $setting_values = $setting_obj->getPreference();

        $res_start_period = $setting_values['res_start_period'] + 1;
        $res_end_period = $setting_values['res_end_period'];

        $today = date("Y-m-d");

        return [
            "from" => date("Y-m-d", strtotime("{$today} +{$res_end_period} days")),
            "to" => date("Y-m-d", strtotime("{$today} +{$res_start_period} days"))
        ];
    }
}
