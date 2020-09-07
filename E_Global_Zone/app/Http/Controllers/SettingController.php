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
            'message' => '환경변수를 조회합니다.',
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
        $validator = Validator::make($request->all(), [
            'max_res_per_day' => 'required|integer',
            'max_std_once' => 'required|integer',
            'res_start_period' => 'required_without:res_end_period|integer|min:1|max:7|gte:res_end_period',
            'res_end_period' => 'required_without:res_start_period|integer|min:1|max:7',
            'once_meet_time' => 'required_without:once_rest_time|integer|min:10|max:30|gte:once_rest_time',
            'once_rest_time' => 'required_without:once_meet_time|integer|min:10|max:30',
            'min_absent' => 'required|integer|min:1',
            'max_absent' => 'required|integer|min:1',
            'once_limit_period' => 'required|integer|min:1',
            'result_input_deadline' => 'required|integer|min:1',
            'guard' => 'required|string|in:admin'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => $validator->errors(),
            ], 422);
        }

        $request = $request->except('guard');

        $create_setting = Setting::create($request);

        return response()->json([
            'message' => '환경변수 저장 완료',
            'result' => $create_setting,
        ], 201);
    }
}
