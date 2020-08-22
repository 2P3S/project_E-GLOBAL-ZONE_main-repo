<?php

namespace App;

use App\Http\Controllers\Controller;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\JsonResponse;
use Illuminate\Notifications\Notifiable;

/**
 * @method join(string $string, string $string1, string $string2)
 */
class Schedule extends Model
{
    use Notifiable;

    private const _STD_FOR_RES_SHOW_SUCCESS = "스케줄 예약 학생 명단 조회에 성공하였습니다.";
    private const _STD_FOR_RES_SHOW_NO_DATA = "예약된 스케줄이 없습니다.";

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

    /**
     * 각 스케줄 대하여 한국인 힉생 예약 명단 조회
     * (외국인 학생 기준 / 한국인 학생 기준)
     *
     * @param Schedule $schedule
     * @param string $column_name
     * @param int $std_for_id
     * @param bool $flag_make_json
     * @return JsonResponse|array
     */
    public function get_sch_res_std_kor_list(
        Schedule $schedule,
        string $column_name,
        int $std_for_id,
        bool $flag_make_json
    ): ?object
    {
        $result = $schedule
            ->join('reservations as res', 'schedules.sch_id', 'res.res_sch')
            ->join('student_koreans as kor', 'kor.std_kor_id', 'res.res_std_kor')
            ->where($column_name, $std_for_id);

        $is_exist_sch_res = $result->count();
        if (!$is_exist_sch_res) {
            return $flag_make_json ?
                Controller::response_json(self::_STD_FOR_RES_SHOW_NO_DATA, 205) :
                null;
        }

        $lookup_columns = [
            'res_id', 'std_kor_id',
            'std_kor_name', 'std_kor_phone',
            'sch_start_date', 'sch_end_date',
            'res_state_of_permission', 'res_state_of_attendance'
        ];

        $response_data = $result->select($lookup_columns)->get();

        return $flag_make_json ?
            Controller::response_json(self::_STD_FOR_RES_SHOW_SUCCESS, 200, $response_data) :
            $response_data;
    }
}
