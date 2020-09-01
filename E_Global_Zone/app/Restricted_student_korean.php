<?php

namespace App;

use App\Library\Services\Preference;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Notifications\Notifiable;

/**
 * @method static where(string $string, $std_kor_id)
 * @method static create(array $array)
 */
class Restricted_student_korean extends Model
{
    const _MAX_ABSENT_COUNT_KOREAN_REASON = "최대 결석 횟수를 넘어 영구 접속 금지된 계정입니다.";

    use Notifiable;

    /* 기본키 설정 */
    protected $primaryKey = 'restrict_id';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'restrict_std_kor',
        'restrict_reason',
        'restrict_start_date',
        'restrict_end_date',
    ];

    /**
     * 한국인 학생 - 최근 이용 제한 정보 조회
     */
    public function get_korean_restricted_info(int $std_kor_id, bool $is_selected_mode = false)
    {
        $restricted_korean_info = self::where('restrict_std_kor', $std_kor_id)
            ->join('student_koreans as std_kor', 'std_kor.std_kor_id', 'restricted_student_koreans.restrict_std_kor')
            ->where('std_kor_state_of_restriction', true)
            ->orderBy('restrict_start_date', 'DESC');

        return $is_selected_mode ?
            $restricted_korean_info->select('restrict_id', 'restrict_reason', 'restrict_start_date', 'restrict_end_date')->get()->first()
            : $restricted_korean_info->get()->first();
    }

    /**
     * 한국인 학생 결석 자동 카운팅
     * @param int $std_kor_id
     */
    public function set_korean_absent_count(int $std_kor_id): object
    {
        // 환경변수
        $setting_obj = new Preference();
        $setting_values = $setting_obj->getPreference();

        // 노쇼 최대 => max_absent
        $max_absent = $setting_values['max_absent'];
        // 패널티 부여 => min_absent
        $min_absent = $setting_values['min_absent'];
        // 패널티 기간 => once_limit_period
        $once_limit_period = $setting_values['once_limit_period'];

        /**
         * 1. 기본적으로 한국인 학생의 노쇼 카운트++ update (std_kor_num_of_absent)
         * 2. 노쇼 카운트 (std_kor_num_of_absent) :: 패널티 부여 (min_absent)
         * 3. if 노쇼 카운트 >= 노쇼 최대
         *      현재 날짜로 부터 영구 정지.
         * 4. else-if 노쇼 카운트 >= 패널티 부여
         *      현재 날짜로 부터 + 패널티 기간 정지 (once_limit_period).
         * 5.
         */
        $std_kor_data = Student_korean::find($std_kor_id);
        $std_kor_data->increment('std_kor_num_of_absent', 1);
        // update([
        //     'std_kor_num_of_absent' => $std_kor_data['std_kor_num_of_absent'] + 1
        // ]);

        if ($std_kor_data['std_kor_num_of_absent'] >= $max_absent) {
            $this->set_korean_restrict($std_kor_id, self::_MAX_ABSENT_COUNT_KOREAN_REASON, date("Y-m-d", strtotime("+999 days")));
        } else if ($std_kor_data['std_kor_num_of_absent'] >= $min_absent) {
            $restrict_end_date = date("Y-m-d", strtotime("+{$once_limit_period} days"));
            $_OVER_ABSENT_COUNT_KOREAN_REASON = "결석 {$min_absent}회 이상 하여 {$restrict_end_date}일까지 사용할 수 없습니다.";
            $this->set_korean_restrict($std_kor_id, $_OVER_ABSENT_COUNT_KOREAN_REASON, $restrict_end_date);
        }

        return $std_kor_data;
    }

    /**
     * 한국인 학생 이용 제한 등록
     * @param int $std_kor_id
     * @param string $reason
     * @param string $date
     */
    public function set_korean_restrict (int $std_kor_id, string $reason, string $date)
    {
        return self::create([
            'restrict_std_kor' => $std_kor_id,
            'restrict_reason' => $reason,
            'restrict_end_date' => $date
        ]);
    }
}
