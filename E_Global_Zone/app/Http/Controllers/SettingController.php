<?php

namespace App\Http\Controllers;

use App\Setting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class SettingController extends Controller
{
    /**
     * 등록된 전체 학기 목록 조회
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return response()->json([
            'message' => 'Setting Value 조회',
            'result' =>  Setting::orderBy('setting_date', 'DESC')->get()->first(),
        ], 200);
    }

    /**
     * 환경변수 저장
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'max_res_per_day' => 'integer',
            'max_std_once' => 'integer',
            'max_std_once' => 'integer',
            'res_start_period' => 'integer',
            'res_end_period' => 'integer',
            'once_meet_time' => 'integer|max:30',
            'once_rest_time' => 'integer|max:30',
            'min_absent' => 'integer',
            'max_absent' => 'integer',
            'once_limit_period' => 'integer',
            'result_input_deadline' => 'integer',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => $validator->errors(),
            ], 422);
        }
        $query = "";

        //TODO raw query로 밀어넣어야 함!!
        foreach ($request->all() as $key => $value) {
            $query = $query . "'{$key}' => {$value},";
        };

        $create_setting = Setting::create([$query]);

        return response()->json([
            'message' => 'Setting Value 등록 완료',
            'result' => $create_setting,
        ], 201);
    }
}
