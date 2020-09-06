<?php

namespace App;

use App\Http\Controllers\Controller;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\JsonResponse;
use Illuminate\Notifications\Notifiable;

/**
 * @method static find(int $res_id)
 * @method static select(array $lookup_columns)
 * @method static create(array $array)
 * @method static whereIn(string $lookup_column, array $lookup_data)
 * @method static whereDate(string $lookup_column, string $operator, false|string $lookup_date)
 * @method static join(string $parent_table, string $parent_table_column, string $child_table_column)*@method static select(string$string, string$string1, string$string2, string$string3, string$string4, string$string5, string$string6, string$string7, string$string8)
 * @method static where(string $string, $sch_id)
 */
class Reservation extends Model
{
    use Notifiable;

    private const _STD_KOR_RES_INDEX_SUCCESS = "예약한 스케줄 조회에 성공하였습니다. ";
    private const _STD_KOR_RES_INDEX_NO_DATE = "예약된 스케줄이 없습니다.";

    /* 기본키 설정 */
    protected $primaryKey = 'res_id';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $guarded = [];

    public function schedule()
    {
        return $this->belongsTo(Schedule::class, 'res_sch');
    }

    /**
     * 오늘 기준 한국인 학생의 예약 목록을 조회
     * (한명 / 여러명의 가능)
     * @param array $std_kor_id
     * @return object
     */
    public function get_std_kor_res_by_today(
        array $std_kor_id
    ): object {
        $settings = new Setting();
        $date_sch_res_possible = $settings->get_res_possible_date();

        return
            self::join('schedules', 'reservations.res_sch', 'schedules.sch_id')
            ->whereDate('sch_start_date', '>=', $date_sch_res_possible['from'])
            ->whereDate("sch_start_date", "<", $date_sch_res_possible['to'])
            ->whereIn('res_std_kor', $std_kor_id)
            ->orderBy('res_std_kor')->get();
    }

    public function store_std_kor_res(
        array $res_data
    ): Reservation {
        return self::create($res_data);
    }

    /**
     * 한국인 학생 - 특정 날짜 기준 한국인 학생의 예약 목록을 조회 (미사용)
     *
     * @param int $std_kor_id
     * @param string $search_date
     * @return JsonResponse
     */
    public function get_std_kor_res_by_date(
        int $std_kor_id,
        string $search_date
    ): JsonResponse {
        $lookup_columns = [
            'std_for_lang', 'std_for_name',
            'sch_start_date', 'sch_end_date',
            'res_state_of_permission', 'res_state_of_attendance',
            'sch_state_of_result_input', 'sch_state_of_permission',
            'for.std_for_id', 'std_for_zoom_id', 'sch_for_zoom_pw'
        ];

        $result =
            self::select($lookup_columns)
            ->join('schedules as sch', 'sch.sch_id', 'reservations.res_sch')
            ->join('student_foreigners as for', 'for.std_for_id', 'sch.sch_std_for')
            ->join('student_foreigners_contacts as contact', 'for.std_for_id', 'contact.std_for_id')
            ->where('reservations.res_std_kor', $std_kor_id)
            ->whereDate('sch.sch_start_date', $search_date)
            ->get();

        $is_std_kor_res_no_date = $result->count();

        if (!$is_std_kor_res_no_date) {
            return
                Controller::response_json(self::_STD_KOR_RES_INDEX_NO_DATE, 202);
        }

        $message_template = self::_STD_KOR_RES_INDEX_SUCCESS;
        return
            Controller::response_json($message_template, 200, $result);
    }

    /**
     * 한국인 학생 - 해당 날짜 기준 진행중인 예약 목록 조회
     *
     * @param int $std_kor_id
     * @return JsonResponse
     */
    public function get_std_kor_res_by_permission(int $std_kor_id): JsonResponse
    {
        $lookup_columns = [
            'std_for_lang', 'std_for_name',
            'sch_start_date', 'sch_end_date',
            'res_state_of_permission', 'res_state_of_attendance',
            'for.std_for_id', 'std_for_zoom_id', 'sch_for_zoom_pw'
        ];

        $result =
            self::select($lookup_columns)
            ->join('schedules as sch', 'sch.sch_id', 'reservations.res_sch')
            ->join('student_foreigners as for', 'for.std_for_id', 'sch.sch_std_for')
            ->join('student_foreigners_contacts as contact', 'for.std_for_id', 'contact.std_for_id')
            ->where('reservations.res_std_kor', $std_kor_id)
            ->where('sch.sch_state_of_result_input', false)
            ->get();

        $is_std_kor_res_no_date = $result->count();

        if (!$is_std_kor_res_no_date) {
            return
                Controller::response_json(self::_STD_KOR_RES_INDEX_NO_DATE, 202);
        }

        $message_template = self::_STD_KOR_RES_INDEX_SUCCESS;
        return
            Controller::response_json($message_template, 200, $result);
    }

    /**
     * 스케줄에 대한 한국인 학생의 예약 승인, 출석 결과 업데이트
     *
     * @param Schedule $schedule
     * @param array $update_std_kor_id_list
     * @param string $update_column
     * @param bool $update_state
     */
    public function update_std_kor_res(
        Schedule $schedule,
        $update_std_kor_id_list,
        string $update_column,
        bool $update_state
    ): void {
        $sch_id = $schedule['sch_id'];
        $update_data = [
            $update_column => $update_state
        ];

        self::where('res_sch', $sch_id)
            ->whereIn('res_std_kor', $update_std_kor_id_list)
            ->update($update_data);
    }

    /**
     * 스케줄에 대한 한국인 학생의 중복 예약 검색
     *
     * @param string $update_column
     * @param bool $update_state
     */
    public function check_already_res(
        int $schedule_id,
        int $std_kor_id
    ): bool {
        return self::where('res_sch', $schedule_id)->where('res_std_kor', $std_kor_id)->count() != 0;
    }
}
