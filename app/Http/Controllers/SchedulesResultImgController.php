<?php

namespace App\Http\Controllers;

use App\Schedule;
use App\SchedulesResultImg;
use App\Section;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Config;

class SchedulesResultImgController extends Controller
{
    private $resultImage;
    private $controller;

    public function __construct()
    {
        $this->resultImage = new SchedulesResultImg();
    }

    private function set_img(
        object $upload_img_file,
        string $img_file_name,
        string $folder_name
    ): string {
        $extension = $upload_img_file->extension();                                        /* 확장자 얻기 */
        $storage_path = "{$folder_name}/{$img_file_name}.{$extension}";

        Storage::putFileAs('public', $upload_img_file, $storage_path);                     /* 파일 저장 후 경로 반환 */

        return $storage_path;
    }

    public function store_result_img(
        Schedule $schedule,
        object $start_img_file,
        object $end_img_file,
        String $language
    ): JsonResponse {
        // 파일 이름 규칙 정의.
        $sch_id = $schedule['sch_id'];
        $std_for_id = $schedule['sch_std_for'];
        $file_name_start = date("Ymd-{$std_for_id}-Hi_\S", strtotime($schedule['sch_start_date']));
        $file_name_end = date("Ymd-{$std_for_id}-Hi_\E", strtotime($schedule['sch_end_date']));
        $sect_name = Section::find($schedule['sch_sect'])['sect_name'];

        // 로컬 스토리지에 이미지 파일 저장 -> 경로 반환 -> DB 에 이미지 파일 경로 저장
        try {
            SchedulesResultImg::create([
                'sch_id' => $sch_id,
                'start_img_url' => $this->set_img($start_img_file, $file_name_start, $sect_name),
                'end_img_url' => $this->set_img($end_img_file, $file_name_end, $sect_name),
            ]);
        } catch (QueryException $queryException) {
            switch ($queryException->getCode()) {
                case 23000:
                    return
                        self::response_json(self::custom_msg($language, 'reservation.for_input_result.completed'), 202);
                default:
                    return
                        self::response_json(self::custom_msg($language, 'reservation.for_input_result.failure'), 422);
            }
        }

        // <<-- 스케줄 결과 입력 결과 업데이트
        $schedule->update(['sch_state_of_result_input' => true]);
        // -->>

        return
            self::response_json(self::custom_msg($language, 'reservation.for_input_result.success'), 201);
    }

    /**
     * 이미지 파일 불러오기
     * @param Request $request
     */
    public function index_result_img(Request $request, SchedulesResultImg $sch_id): JsonResponse
    {
        // <<-- Request 요청 관리자 권한 검사.
        $is_admin = self::is_admin($request);

        if (is_object($is_admin)) {
            return $is_admin;
        }
        // -->>

        try {
            $img_data = (object) array(
                'start_img' => $this->resultImage->get_base64_img($sch_id['start_img_url']),
                'end_img' => $this->resultImage->get_base64_img($sch_id['end_img_url']),
            );
        } catch (Exception $e) {
            return self::response_json_error(Config::get('constants.kor.result_img.index.failure'));
        }

        return self::response_json(Config::get('constants.kor.result_img.index.success'), 200, $img_data);
    }
}
