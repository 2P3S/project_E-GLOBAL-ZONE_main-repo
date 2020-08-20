<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Notifications\Notifiable;

/**
 * @method static create(array $array)
 */
class Department extends Model
{
    use Notifiable;

    /* 기본키 설정 */
    protected $primaryKey = 'dept_id';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = ['dept_name'];
}
