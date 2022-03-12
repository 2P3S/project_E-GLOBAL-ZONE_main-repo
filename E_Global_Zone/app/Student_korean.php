<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Notifications\Notifiable;

/**
 * @method static find($std_kor_id)
 */
class Student_korean extends Model
{
    use Notifiable;

    protected $guard = 'korean';

    /* 기본키 설정 */
    protected $primaryKey = 'std_kor_id';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $guarded = [];

    public function store_std_kor_info(
        array $std_kor_data
    ): ?self {
        $std_kor = null;
        try {
            $std_kor = self::create($std_kor_data);
        } catch (\Exception $e) {
            return null;
        }

        return $std_kor;
    }

    public function get_all_users()
    {
        return self::all();
    }
}
