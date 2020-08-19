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
}
