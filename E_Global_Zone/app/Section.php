<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Notifications\Notifiable;

class Section extends Model
{
    use Notifiable;

    /* 기본키 설정 */
    protected $primaryKey = 'sect_id';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'sect_name',
        'sect_start_date',
        'sect_end_date'
    ];

    public $timestamps = false;
}
