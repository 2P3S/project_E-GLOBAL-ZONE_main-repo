<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Student_korean extends Model
{
    use Notifiable;

    protected $guard = 'korean';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'std_kor_id',
        'std_kor_dept',
        'std_kor_name',
        'std_kor_phone',
        'std_kor_mail'
    ];
}
