<?php

namespace App\Http\Controllers;

use App\Schedule;
use App\Section;
use App\Student_foreigner;
use App\Work_student_foreigner;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Config;

class WorkStudentForeignerController extends Controller
{
    private $schedule;
    private $work_std_for;
    private $std_for;

    // 해당 학기 미등록 유학생 정보 조회
    private const _STD_FOR_NON_DATA_BY_SECT_SUCCESS = " 학기";

    public function __construct()
    {
        $this->schedule = new Schedule();
        $this->work_std_for = new Work_student_foreigner();
        $this->std_for = new Student_foreigner();
    }

    /**
     * 해당 학기 등록된 근로 유학생 정보 조회
     *
     * @param Section $sect_id
     * @return JsonResponse
     */
    public function work_std_for_registered_index_by_sect(
        Section $sect_id
    ): JsonResponse
    {
        $work_std_for_list = null;
        $time = [
            'sect_start_date' => $sect_id['sect_start_date'],
            'sect_end_date' => $sect_id['sect_end_date']
        ];

        try {
            $work_std_for_list = $this->work_std_for->get_sect_work_std_for_list($sect_id);
            $is_no_work_std_for = !$work_std_for_list->count();
            $sect_name = $sect_id['sect_name'];

            // <<-- 조회 결과 없음
            if ($is_no_work_std_for) {
                $message = $sect_name . Config::get('constants.kor.work_std_for.index.no_value');
                return $this->response_json_time($message, $time);
            }
            // -->>

            // 활동 00월 계산
            $sect_month = [
                'start' => (int)date("m", strtotime($sect_id['sect_start_date'])),
                'end' => (int)date("m", strtotime($sect_id['sect_end_date']))
            ];

            // 활동 시간 조회
            foreach ($work_std_for_list as $work_std_for_id) {
                $isSearchMode = true;
                $sect_month['temp'] = $sect_month['start'];
                $std_for_id = $work_std_for_id['std_for_id'];
                $work_time = [];

                while ($isSearchMode) {
                    $section = $sect_id;

                    $work_time[$sect_month['temp'] . "월"] = $this->schedule
                        ->get_sch_count_by_std_for($section, $std_for_id, $sect_month['temp']);

                    $sect_month['temp']++;

                    // 학기 년도가 변경되는 경우
                    if ($sect_month['temp'] === 13 && $sect_month['end'] !== 12) {
                        $sect_month['temp'] = 1;
                    } else if ($sect_month['temp'] > $sect_month['end']) {
                        $isSearchMode = false;
                    }
                }
                $work_std_for_id['work_time'] = $work_time;

                // 해당학기 스케줄 등록여부 반환
                $get_sect_by_sch_count = $this->schedule
                    ->get_sch_by_sect((int)$sect_id['sect_id'], $std_for_id)->count();

                $work_std_for_id['is_schedules_inputed'] = $get_sect_by_sch_count > 0;
            }
        } catch (\Exception $e) {
            // <<-- 조회 실패
            $message = Config::get('constants.kor.work_std_for.index.failure');
            return $this->response_json_time($message, $time);
            // -->>
        }

        // <<-- 조회 성공
        $message = $sect_name . Config::get('constants.kor.work_std_for.index.success');
        return $this->response_json_time($message, $time, $work_std_for_list);
        // -->>
    }


    /**
     * 해당 학기 등록되지 않은 근로 유학생 정보 조회
     *
     * @param Section $sect_id
     * @return JsonResponse
     */
    public function work_std_for_not_registered_index_by_sect(
        Section $sect_id
    ): JsonResponse
    {
        $not_work_std_for_list = null;
        try {
            $work_std_for_list = $this->work_std_for->get_sect_work_std_for_list_by_sect($sect_id);
            $work_std_for_id = $work_std_for_list->toArray();
            $not_work_std_for_list = $this->std_for->get_sect_not_work_std_for_list($work_std_for_id);
        } catch (\Exception $e) {
            $message = Config::get('constants.kor.not_work_std_for.index.failure');
            return self::response_json_error($message);
        }
        $message = $sect_id['sect_name'] . Config::get('constants.kor.not_work_std_for.index.success');
        return self::response_json(
            $message, 200, $not_work_std_for_list
        );
    }


    // 000 유학생이 등록되었습니다.
    // 000 유학생 등록에 실패하였습니다.
    private const _STD_FOR_STORE_FAILURE = " 유학생 등록에 실패하였습니다.";
    private const _SECT_STD_FOR_EACH_STORE_SUCCESS = " 근로유학생 목록에 등록되었습니다.";
    // 000 학번의 학생의 데이터가 중복입니다.
    private const _STD_FOR_DUPLICATED_DATA = " 학번의 학생의 데이터가 중복입니다.";

    /**
     * 학기별 유학생 등록
     *
     * @param Request $request
     * @return JsonResponse
     */
    // TODO 알고리즘 수정 필요
    public function store(
        Request $request,
        Section $sect_id
    ): JsonResponse
    {
        /*
         * 성공 시, 출력 메세지
         *  -> 0000 학기의 근로유학생 목록 추가에 성공하였습니다.
         * $message = $sect_id['sect_name'] . Config::get('constants.kor.work_std_for.store.success');
         *
         * 실패 시, 출력 메세지
         *  -> 근로유학생 목록 추가에 실패하였습니다.
         * $message = Config::get('constants.kor.work_std_for.store.failure');
        */
        $rules = [
            'foreigners' => 'required|array',
            'foreigners.*' => 'required|integer|distinct|min:1000000|max:9999999',
//            'sect_id' => 'required|integer|distinct|min:0|max:100',
            'guard' => 'required|string|in:admin'
        ];

        $validated_result = self::request_validator(
            $request, $rules, self::_STD_FOR_STORE_FAILURE
        );

        if (is_object($validated_result)) {
            return $validated_result;
        }

        $std_for_list = $request->input('foreigners');
        $req_sect_id = $sect_id['sect_id'];

        // 학생 정보 저장
        foreach ($std_for_list as $foreigner_id) {
            // 존재하는 유학생인지 검사
            if (!Student_foreigner::find($foreigner_id)) {
                continue;
            }

            // 이미 해당 학기에 등록한 학생인 경우
            $isDuplicatedStudent = Work_student_foreigner::where('work_std_for', $foreigner_id)
                ->where('work_sect', $req_sect_id)
                ->count();

            if ($isDuplicatedStudent) {
                return self::response_json(self::_STD_FOR_DUPLICATED_DATA, 422);
            }

            Work_student_foreigner::create([
                'work_std_for' => $foreigner_id,
                'work_sect' => $req_sect_id
            ]);
        }

        return self::response_json(self::_SECT_STD_FOR_EACH_STORE_SUCCESS, 201);
    }


    /**
     * 학기별 유학생 수정 (=삭제)
     *
     * @param Request $request
     * @param Work_student_foreigner $work_list_id
     * @return JsonResponse
     * @throws \Exception
     */
    public function destroy(
        Request $request,
        Work_student_foreigner $work_list_id
    ): JsonResponse
    {
        // <<-- Request 요청 관리자 권한 검사.
        $is_admin = self::is_admin($request);

        if (is_object($is_admin)) {
            return $is_admin;
        }
        // -->>

        return $this->work_std_for->remove_sect_work_std_for($work_list_id);
    }

    private function response_json_time(
        string $message,
        array $time,
        object $work_std_for_list = null
    )
    {
        $is_no_data = !(bool)$work_std_for_list;

        if ($is_no_data) {
            return response()->json([
                'message' => $message,
                'time' => $time
            ], 202);
        }

        return response()->json([
            'message' => $message,
            'data' => $work_std_for_list,
            'time' => $time
        ], 200);
    }
}
