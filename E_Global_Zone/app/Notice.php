<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Notifications\Notifiable;

class Notice extends Model
{
    use Notifiable;

    /* 기본키 설정 */
    protected $primaryKey = 'noti_id';

    protected $guarded = [];
}
