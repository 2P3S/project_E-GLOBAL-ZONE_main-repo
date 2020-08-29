<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Notifications\Notifiable;

/**
 * @method static where(string $string, $std_kor_id)
 * @method static create(array $array)
 */
class Restricted_student_korean extends Model
{
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
    public function get_restricted_korean_info(int $std_kor_id, bool $is_selected_mode = false)
    {
        $restricted_korean_info = self::where('restrict_std_kor', $std_kor_id)
            ->join('student_koreans as std_kor', 'std_kor.std_kor_id', 'restricted_student_koreans.restrict_std_kor')
            ->where('std_kor_state_of_restriction', true)
            ->orderBy('restrict_start_date', 'DESC');

        return $is_selected_mode ?
            $restricted_korean_info->select('restrict_id', 'restrict_reason', 'restrict_start_date', 'restrict_end_date')->get()->first()
            : $restricted_korean_info->get()->first();
    }
}
