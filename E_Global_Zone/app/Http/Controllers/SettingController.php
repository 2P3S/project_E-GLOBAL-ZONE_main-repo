<?php

namespace App\Http\Controllers;

use App\Setting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class SettingController extends Controller
{
    /**
     * 등록된 환경변수 조회
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return response()->json([
            'message' => 'Setting Value 조회',
            'result' => Setting::orderBy('setting_date', 'DESC')->get()->first(),
        ], 200);
    }

    /**
     * 환경변수 저장
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        // TODO 조건 추가 필요 : res_start_period >= res_end_period
        // TODO res_start_period, res_end_period / once_meet_time, once_rest_time 최대 최소값 수정 필요
        $validator = Validator::make($request->all(), [
            'max_res_per_day' => 'integer',
            'max_std_once' => 'integer',
            'res_start_period' => 'required_if:res_end_period|integer|min:1|max:7|gte:res_end_period',
            'res_end_period' => 'required_if:res_start_period|integer|min:1|max:7',
            'once_meet_time' => 'required_if:once_rest_time|integer|min:15|max:50|gte:once_rest_time',
            'once_rest_time' => 'required_if:once_meet_time|integer|min:10|max:30',
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
