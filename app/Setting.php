<?php

namespace App;

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

    public $timestamps = false;

    public static function get_setting_value(): Setting
    {
        return
            self::orderBy('setting_date', 'DESC')
                ->limit(1)->first();
    }

    // 오늘 기준 예약 신청 가능한 날짜 범위 계산
    public function get_res_possible_date(): array
    {
        $settings = self::get_setting_value();
        $res_start_period = $settings['res_start_period'] + 1;
        $res_end_period = $settings['res_end_period'];

        // TODO TEST 후 수정필요
//        $today = date("Y-m-d", strtotime("-4 days"));
         $today = date("Y-m-d");

        return [
            "from" => date("Y-m-d", strtotime("{$today} +{$res_end_period} days")),
            "to" => date("Y-m-d", strtotime("{$today} +{$res_start_period} days"))
        ];
    }
}
