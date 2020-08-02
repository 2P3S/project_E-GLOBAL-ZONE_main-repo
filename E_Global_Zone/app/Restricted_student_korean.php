<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Notifications\Notifiable;

class Restricted_student_korean extends Model
{
    use Notifiable;
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'restrict_reason',
        'restrict_reason',
        'restrict_start_date',
        'restrict_end_date',
    ];
}
