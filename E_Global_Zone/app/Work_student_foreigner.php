<?php

namespace App;

use App\Http\Controllers\Controller;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\JsonResponse;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\Config;

/**
 * @method static select(array $select_column)
 * @method static where(string $string, $sect_id)
 */
class Work_student_foreigner extends Model
{
    use Notifiable;

    /* 기본키 설정 */
    protected $primaryKey = 'work_list_id';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'work_list_id',
        'work_std_for',
        'work_sect',
    ];

    public $timestamps = false;

    public function get_sect_work_std_for_list(
        Section $section
    ): Collection
    {
        $sect_id = $section['sect_id'];
        $select_column = [
            'work_list_id',
            'std_for_id',
            'std_for_dept',
            'std_for_name',
            'std_for_lang',
            'std_for_country',
            'std_for_state_of_favorite',
            'std_for_num_of_delay_permission',
            'std_for_num_of_delay_input',
        ];

        return self::select($select_column)
            ->join('student_foreigners as for', 'work_student_foreigners.work_std_for', 'for.std_for_id')
            ->where('work_sect', $sect_id)
            ->orderBy('std_for_state_of_favorite')
            ->orderBy('std_for_lang')
            ->get();
    }

    public function get_sect_work_std_for_list_by_sect(
        Section $section
    ): Collection
    {
        $sect_id = $section['sect_id'];
        return self::select(['work_std_for'])
            ->where('work_sect', $sect_id)->get();
    }

    // 해당 섹션에 등록된 근로 유학생을 목록에서 삭제
    public function remove_sect_work_std_for(
        Work_student_foreigner $work_std_for
    ): JsonResponse
    {
        try {
            $work_std_for->delete();
        } catch (\Exception $e) {
            $message = Config::get('constants.kor.work_std_for.destroy.failure');
            return Controller::response_json_error($message);
        }

        $message = Config::get('constants.kor.work_std_for.destroy.success');
        return Controller::response_json($message, 200);
    }
}
