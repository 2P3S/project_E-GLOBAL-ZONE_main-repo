<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Notifications\Notifiable;

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
}
