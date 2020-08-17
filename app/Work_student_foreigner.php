<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Notifications\Notifiable;

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
}
