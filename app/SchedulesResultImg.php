<?php

namespace App;

use App\Http\Controllers\Controller;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\QueryException;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Storage;

/**
 * @method static create(array $array)
 */
class SchedulesResultImg extends Model
{
    protected $primaryKey = 'sch_id';

    protected $fillable = [
        'sch_id',
        'start_img_url',
        'end_img_url'
    ];


    /*
     * 결과 조회 시, 스케줄 아이디로 이미지 url 조회
     */
    public function get_img($img_name)
    {
        $img_url = 'http://' . request()->getHttpHost() . Storage::url('public/' . $img_name);       /* 이미지 URL */
        return $img_url;
    }

    public function get_base64_img($img_name)
    {
        $data = Storage::get('public/' . $img_name);
        $type = pathinfo('storage/' . $img_name, PATHINFO_EXTENSION);

        return 'data:image/' . $type . ';base64,' . base64_encode($data);
    }
}
