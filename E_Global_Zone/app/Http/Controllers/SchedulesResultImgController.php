<?php

namespace App\Http\Controllers;

use App\Schedule;
use App\SchedulesResultImg;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Storage;

class SchedulesResultImgController extends Controller
{
    private function set_img(
        object $upload_img_file,
        string $img_file_name
    ): string
    {
        $extension = $upload_img_file->extension();                                        /* 확장자 얻기 */
        $storage_path = "{$img_file_name}.{$extension}";

        Storage::putFileAs('public', $upload_img_file, $storage_path);                     /* 파일 저장 후 경로 반환 */

        return $storage_path;
    }

    public static function store_result_img(
        Schedule $schedule,
        object $start_img_file,
        object $end_img_file
    ): JsonResponse
    {
        // 파일 이름 규칙 정의.
        $sch_id = $schedule['sch_id'];
        $std_for_id = $schedule['sch_std_for'];
        $file_name_start = date("Ymd-{$std_for_id}-Hi_\S", strtotime($schedule['sch_start_date']));
        $file_name_end = date("Ymd-{$std_for_id}-Hi_\E", strtotime($schedule['sch_end_date']));

        // 로컬 스토리지에 이미지 파일 저장 -> 경로 반환
        $self_obj = new self();
        $start_img_url = $self_obj->set_img($start_img_file, $file_name_start);
        $end_img_url = $self_obj->set_img($end_img_file, $file_name_end);

        // DB 에 이미지 파일 경로 저장
        $store_data = [
            'sch_id' => $sch_id,
            'start_img_url' => $start_img_url,
            'end_img_url' => $end_img_url,
        ];

        $sch_result_img = new SchedulesResultImg();
        return $sch_result_img->store_result_img_url($store_data);
    }
}
