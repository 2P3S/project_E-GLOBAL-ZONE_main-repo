<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class SchedulesResultImg extends Model
{
    protected $primaryKey = 'sch_id';

    protected $fillable = [
        'sch_id',
        'start_img_url',
        'end_img_url'
    ];
}
