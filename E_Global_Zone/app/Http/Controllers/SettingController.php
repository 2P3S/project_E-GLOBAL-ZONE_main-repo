<?php

namespace App\Http\Controllers;

use App\Setting;
use App\Restricted_student_korean;
use App\Student_foreigner;
use App\Student_korean;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Config;

class SettingController extends Controller
{
    private $restrict;

    public function __construct()
    {
        $this->restrict = new Restricted_student_korean();
    }

    /**
     * 등록된 환경변수 조회
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $setting_data = Setting::orderBy('setting_date', 'DESC')->get()->first();

        return self::response_json(Config::get('constants.kor.setting.index.success'), 200, $setting_data);
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

        return self::response_json(Config::get('constants.kor.setting.store.success'), 201, $create_setting);
    }

    /**
     * 한국인 / 유학생 정보 초기화
     *
     * 유학생 -> std_for_num_of_delay_permission, std_for_num_of_delay_input
     * 한국인 학생 -> std_kor_num_of_absent, std_kor_state_of_restriction
     *
     * [IF] 리셋모드에 따라, 한국인 학생 전체 참여 횟수 초기화 가능.
     */
    public function reset_restriction_info(Request $request)
    {
        $rules = [
            'factory_reset' => 'required|bool',
            'guard' => 'required|string|in:admin'
        ];

        $validated_result = self::request_validator(
            $request,
            $rules,
            Config::get('constants.kor.section.update.failure')
        );

        if (is_object($validated_result)) {
            return $validated_result;
        }

        // <<--유학생 정보 초기화
        Student_foreigner::query()->update([
            'std_for_num_of_delay_permission' => 0,
            'std_for_num_of_delay_input' => 0
        ]);
        // -->>

        $factory_reset_mode = $request->input('factory_reset');

        $std_kor_reset_colums = [
            'std_kor_num_of_absent' => 0,
            'std_kor_state_of_restriction' => 0
        ];

        if ($factory_reset_mode) {
            $std_kor_reset_colums['std_kor_num_of_attendance'] = 0;
        }

        // 한국인 학생 정보 초기화
        $std_kor_data = Student_korean::where('std_kor_state_of_permission', true)->get();

        foreach ($std_kor_data as $std_kor) {
            if ($std_kor['std_kor_state_of_restriction']) {
                $restricted_info = $this->restrict->get_korean_restricted_info($std_kor['std_kor_id']);

                $restricted_info->update([
                    'restrict_end_date' => now()
                ]);
            }

            // <<-- 결석, 이용 제한 누적 횟수 초기화
            $std_kor->update($std_kor_reset_colums);
            // -->>
        }
    }
}
