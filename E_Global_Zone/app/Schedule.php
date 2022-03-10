<?php

namespace App;

use App\Http\Controllers\Controller;
use App\Library\Services\Preference;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\JsonResponse;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\Config;

/**
 * @method join(string $string, string $string1, string $string2)
 * @method static where(string $string, $std_for_id)
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

        return ($date_sch_res_possible['from'] <= $date_sch &&
            $date_sch < $date_sch_res_possible['to']);
    }

    /**
     * 각 스케줄 대하여 한국인 학생 예약 명단 조회
     * (외국인 학생 기준 / 한국인 학생 기준)
     *
     * @param Schedule $schedule
     * @param string $column_name
     * @param int $std_id
     * @param bool $flag_make_json
     * @return JsonResponse|array
     */
    public function get_sch_res_std_kor_list(
        Schedule $schedule,
        string $column_name = "",
        int $std_id = 0
    ): ?object
    {
        $result = $schedule
            ->join('reservations as res', 'schedules.sch_id', 'res.res_sch')
            ->join('student_koreans as kor', 'kor.std_kor_id', 'res.res_std_kor')
            ->where('schedules.sch_id', $schedule['sch_id']);

        $result =
            $column_name === "" ?
                $result :
                $result->where($column_name, $std_id);

        $lookup_columns = [
            'res_id', 'std_kor_id',
            'std_kor_name', 'std_kor_phone',
            'sch_start_date', 'sch_end_date', 'sch_for_zoom_pw',
            'res_state_of_permission', 'res_state_of_attendance'
        ];

        $response_data = $result->select($lookup_columns)->get();

        return $response_data;
    }

    /**
     * 스케줄 id 값으로 스케줄 정보 조회
     *
     * @param Schedule $sch_id
     * @return object
     */
    public function get_sch_by_id(
        Schedule $sch_id
    ): object
    {
        // 환경변수
        $setting_obj = new Preference();
        $setting_values = $setting_obj->getPreference();

        $result = $sch_id
            ->join('student_foreigners as for', 'for.std_for_id', 'schedules.sch_std_for')
            ->where('sch_id', $sch_id['sch_id'])
            ->first();

        $sch_date = date('Y년 m월 d일', strtotime($result['sch_start_date']));
        $sch_time =
            date('A h시 i분 ~ ', strtotime($result['sch_start_date'])) .
            date('A h시 i분', strtotime($result['sch_end_date']));

        $sch_ava_count = $setting_values['max_std_once'];
        $sch_res_count = Reservation::where('res_sch', $sch_id['sch_id'])->count();

        $response_data = (object)[
            'sch_res_count' => $sch_res_count,
            'sch_ava_count' => $sch_ava_count,
            'std_for_name' => $result['std_for_name'],
            'std_for_lang' => $result['std_for_lang'],
            'sch_date' => $sch_date,
            'sch_time' => $sch_time,
        ];

        return $response_data;
    }

    /**
     * 날짜 값으로 스케줄 정보 조회
     * @param string $search_date
     * @param int $std_for_id
     */
    public function get_sch_by_date(
        string $search_date,
        int $std_for_id = 0
    ): Collection
    {
        $result = Schedule::whereDate('sch_start_date', $search_date);

        $is_search_by_std_for_id = $std_for_id >= 1000000 && $std_for_id <= 9999999;
        if ($is_search_by_std_for_id) {
            $result = $result->where('sch_std_for', $std_for_id);
        }

        return $result->get();
    }

    /**
     * 학기 기준 스케줄 정보 조회
     *
     * @param int $sect_id
     * @param int $std_for_id
     * @return object|null
     */
    public function get_sch_by_sect(
        int $sect_id,
        int $std_for_id = 0
    ): ?object
    {
        return self::where('sch_sect', $sect_id)->where('sch_std_for', $std_for_id);
    }

    /**
     * 학기 특정 날짜 기준 스케줄 정보 조회
     *
     * @param int $sect_id
     * @param int $std_for_id
     * @return object|null
     */
    public function get_sch_by_sect_start_date(
        int $sect_id,
        int $std_for_id = 0,
        string $sch_start_date
    ): ?object
    {
        return self::where('sch_sect', $sect_id)->whereDate('sch_start_date', '>=', $sch_start_date)->where('sch_std_for', $std_for_id);
    }

    public function get_sch_count_by_std_for(
        Section $section,
        int $std_for_id,
        string $tmp_sect_mont
    )
    {
        return self::where('sch_std_for', $std_for_id)
                ->where('sch_sect', $section['sect_id'])
                ->where('sch_state_of_permission', true)
                ->whereMonth('sch_start_date', $tmp_sect_mont)
                ->count();
    }
}
