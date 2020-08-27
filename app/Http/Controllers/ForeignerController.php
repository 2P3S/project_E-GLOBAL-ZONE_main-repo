<?php

namespace App\Http\Controllers;

use App\Schedule;
use App\Section;
use App\Student_foreigner;
use App\Student_foreigners_contact;
use App\Work_student_foreigner;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class ForeignerController extends Controller
{
    /*
     * [Refactoring]
     * TODO RESPONSE 수정
     * TODO 접근 가능 범위 수정
     */
    private const _WORK_STD_FOR_INDEX_SUCCESS = "의 근로유학생 목록 조회에 성공하였습니다.";
    private const _WORK_STD_FOR_INDEX_FAILURE = "등록된 근로유학생이 없습니다.";

    private const _STD_FOR_SHOW_SUCCESS = "유학생 정보조회에 성공하였습니다.";
    private const _STD_FOR_SHOW_FAILURE = "유학생 정보조회에 실패하였습니다.";

    // 0000학기의 근로유학생 목록에 00명이 동록되었습니다.
    private const _SECT_STD_FOR_STORE_SUCCESS1 = "의 근로유학생 목록에 ";
    private const _SECT_STD_FOR_STORE_SUCCESS2 = "명이 등록되었습니다.";
    // 0000학기 근로유학생 등록에 실패하였습니다.
    private const _SECT_STD_FOR_STORE_FAILURE = " 근로유학생 등록에 실패하였습니다.";

    // 000 유학생이 0000학기의 근로유학생 목록에 등록되었습니다.
    // 000 유학생의 근로유학생 등록에 실패하였습니다.
    private const _SECT_STD_FOR_EACH = " 유학생이 ";

    private const _SECT_STD_FOR_EACH_STORE_SUCCESS = " 근로유학생 목록에 등록되었습니다.";
    private const _SECT_STD_FOR_EACH_STORE_FAILURE = " 유학생의 근로유학생 등록에 실패하였습니다.";

    // 000 유학생이 0000학기의 근로유학생 목록에서 삭제되었습니다.
    // 000 유학생의 근로유학생 삭제에 실패하였습니다.
    private const _SECT_STD_FOR_EACH_DELETE_SUCCESS = " 근로유학생 목록에서 삭제되었습니다.";
    private const _SECT_STD_FOR_EACH_DELETE_FAILURE = " 유학생의 근로유학생 삭제에 실패하였습니다.";

    // 000 유학생이 등록되었습니다.
    // 000 유학생 등록에 실패하였습니다.
    private const _STD_FOR_STORE_SUCCESS = " 유학생이 등록되었습니다.";
    private const _STD_FOR_STORE_FAILURE = " 유학생 등록에 실패하였습니다.";

    private const _STD_FOR_INIT_PASSWORD = "1q2w3e4r!";
    // 000 유학생의 비밀번호가 초기화가 성공하였습니다. (초기 비밀번호 : 1q2w3e4r!)
    // 000 유학생의 비밀번호가 초기화에 실패하였습니다.
    private const _STD_FOR_RESET_SUCCESS = " 비밀번호 초기화가 성공하였습니다.";
    private const _STD_FOR_RESET_FAILURE = " 비밀번호 초기화에 실패하였습니다.";

    private const _STD_FOR_FAVORITE_SUCCESS = "유학생 즐겨찾기 변경에 성공하였습니다.";
    private const _STD_FOR_FAVORITE_FAILURE = "유학생 즐겨찾기 변경에 실패하였습니다.";

    // 000 유학생이 삭제되었습니다.
    // 000 유학생 삭제에 실패하였습니다.
    private const _STD_FOR_DELETE_SUCCESS = " 유학생이 삭제되었습니다.";
    private const _STD_FOR_DELETE_FAILURE = " 유학생 삭제에 실패하였습니다.";

    // 000 학번의 학생의 데이터가 중복입니다.
    private const _STD_FOR_DUPLICATED_DATA = " 학번의 학생의 데이터가 중복입니다.";

    // 해당 학기 미등록 유학생 정보 조회
    private const _STD_FOR_NON_DATA_BY_SECT_SUCCESS = " 학기 미등록 유학생 정보 조회 결과를 반환합니다.";

    private $schedule;

    public function __construct()
    {
        $this->schedule = new Schedule();
    }

    //TODO (중요) 활동시간 + 예약 미승인 횟수 + 결과 지연 입력 횟수 조회 후 반환.
    /**
     * 학기별 전체 유학생 정보 조회
     *
     * @param Section $sect_id
     * @return JsonResponse
     */
    public function index(Section $sect_id): JsonResponse
    {
        $sect_name = $sect_id['sect_name'];
        $work_std_for_list =
            Work_student_foreigner::select(
                'work_list_id',
                'std_for_id',
                'std_for_dept',
                'std_for_name',
                'std_for_lang',
                'std_for_country',
                'std_for_state_of_favorite',
                'std_for_num_of_delay_input',
            )
            ->join('student_foreigners as for', 'work_student_foreigners.work_std_for', 'for.std_for_id')
            ->where('work_sect', $sect_id['sect_id'])
            ->orderBy('std_for_state_of_favorite')
            ->orderBy('std_for_lang')
            ->get();

        $time['sect_start_date'] = $sect_id['sect_start_date'];
        $time['sect_end_date'] = $sect_id['sect_end_date'];

        //TODO 예약 미승인 횟수 추가하기.
        if (count($work_std_for_list) === 0) {
            return response()->json([
                'message' => self::_WORK_STD_FOR_INDEX_FAILURE,
                'time' => $time
            ], 202);
        }

        // 활동 00월 계산
        $sect_start_month = (int)date("m", strtotime($sect_id['sect_start_date']));
        $sect_end_month = (int)date("m", strtotime($sect_id['sect_end_date']));

        // 활동 시간 조회
        foreach ($work_std_for_list as $work_std_for_id) {
            $isSearchMode = true;
            $sect_temp_month = $sect_start_month;
            $work_time = [];

            while ($isSearchMode) {
                $work_time[$sect_temp_month . "월"] = Schedule::where('sch_std_for', $work_std_for_id['std_for_id'])
                    ->where('sch_sect', $sect_id['sect_id'])
                    ->where('sch_state_of_permission', true)
                    ->whereMonth('sch_start_date', $sect_temp_month)
                    ->count() / 2;

                $sect_temp_month++;

                // 학기 년도가 변경되는 경우
                if ($sect_temp_month == 13 && $sect_end_month != 12) {
                    $sect_temp_month = 1;
                } else if ($sect_temp_month > $sect_end_month) {
                    $isSearchMode = false;
                }
            }
            $work_std_for_id['work_time'] = $work_time;

            // 해당학기 스케줄 등록여부 반환
            $get_sect_by_sch_count = $this->schedule->get_sch_by_sect((int)$sect_id['sect_id'], (int)$work_std_for_id['std_for_id'])->count();
            // dd($get_sect_by_sch_count);
            $work_std_for_id['is_schedules_inputed'] = $get_sect_by_sch_count > 0;
        }

        return response()->json([
            'message' => $sect_name . self::_WORK_STD_FOR_INDEX_SUCCESS,
            'data' => $work_std_for_list,
            'time' => $time
        ], 200);
    }

    /**
     * 해당 학기 미등록 유학생 정보 조회
     *
     * @param Section $sect_id
     * @return JsonResponse
     */
    public function std_for_index_no_data_by_sect(Section $sect_id): JsonResponse
    {
        $work_list_data = Work_student_foreigner::where('work_sect', $sect_id['sect_id'])->get();

        $work_list_arr = [];

        foreach ($work_list_data as $data) {
            array_push($work_list_arr, $data['work_std_for']);
        };

        $select_column_list = [
            'student_foreigners.std_for_lang',
            'student_foreigners.std_for_country',
            'student_foreigners.std_for_id',
            'student_foreigners.std_for_name',
            'student_foreigners.std_for_dept',
            'contact.std_for_phone',
            'contact.std_for_mail',
            'contact.std_for_zoom_id'
        ];

        $search_data = Student_foreigner::select($select_column_list)
            ->join('student_foreigners_contacts as contact', 'student_foreigners.std_for_id', 'contact.std_for_id')
            ->whereNotIn('student_foreigners.std_for_id', $work_list_arr)
            ->orderBy('student_foreigners.std_for_lang')
            ->get();

        return self::response_json($sect_id['sect_name'] . self::_STD_FOR_NON_DATA_BY_SECT_SUCCESS, 200, $search_data);
    }

    /**
     * 특정 유학생 정보 조회
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function show(Request $request): JsonResponse
    {
        $rules = [
            'foreigners' => 'required|array',
            'foreigners.*' => 'required|integer|distinct|min:1000000|max:9999999'
        ];

        $validated_result = self::request_validator(
            $request,
            $rules,
            self::_STD_FOR_SHOW_FAILURE
        );

        if (is_object($validated_result)) {
            return $validated_result;
        }

        $req_std_for_id = $request->input('foreigners');

        $select_column_list = [
            'student_foreigners.std_for_id',
            'student_foreigners.std_for_name',
            'contact.std_for_phone',
            'contact.std_for_mail',
            'contact.std_for_zoom_id'
        ];

        $data_std_for = [];

        // 학생 정보 저장
        foreach ($req_std_for_id as $std_for_id) {
            // 학번 기준 검색
            $search_result =
                Student_foreigner::select($select_column_list)
                ->join('student_foreigners_contacts as contact', 'student_foreigners.std_for_id', 'contact.std_for_id')
                ->where('student_foreigners.std_for_id', $std_for_id)->get()->first();

            // 검색 결과 저장
            if ($search_result) {
                $data_std_for[] = $search_result;
            }
        }

        return response()->json([
            'message' => self::_STD_FOR_SHOW_SUCCESS,
            'data' => $data_std_for,
        ], 200);
    }

    /**
     * 학기별 유학생 등록
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function store(Request $request): JsonResponse
    {
        $rules = [
            'foreigners' => 'required|array',
            'foreigners.*' => 'required|integer|distinct|min:1000000|max:9999999',
            'sect_id' => 'required|integer|distinct|min:0|max:100'
        ];

        $validated_result = self::request_validator(
            $request,
            $rules,
            self::_STD_FOR_STORE_FAILURE
        );

        if (is_object($validated_result)) {
            return $validated_result;
        }

        $req_std_for_id = $request->input('foreigners');
        $req_sect_id = $request->sect_id;

        // 학생 정보 저장
        foreach ($req_std_for_id as $foreigner_id) {
            // 존재하는 유학생인지 검사
            if (!Student_foreigner::find($foreigner_id)) continue;

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
     * @param Work_student_foreigner $work_list_id
     * @return JsonResponse
     */
    public function destroy(Work_student_foreigner $work_list_id): JsonResponse
    {
        $work_list_id->delete();

        return self::response_json(self::_SECT_STD_FOR_EACH_DELETE_SUCCESS, 200);
    }

    /**
     * 유학생 계정 생성
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function registerAccount(Request $request): JsonResponse
    {
        $rules = [
            'std_for_id' => 'required|integer|unique:student_foreigners,std_for_id|distinct|min:1000000|max:9999999',
            'std_for_dept' => 'required|integer',
            'std_for_name' => 'required|string|min:2',
            'std_for_lang' => 'required|string|min:2',
            'std_for_country' => 'required|string|min:2',
            'std_for_phone' => 'required|string|unique:student_foreigners_contacts,std_for_phone',                  /* (주의) 유학생중 휴대폰이 없는 학생도 많다 */
            'std_for_mail' => 'required|email|unique:student_foreigners_contacts,std_for_mail',
            'std_for_zoom_id' => 'required|string|unique:student_foreigners_contacts,std_for_zoom_id',
        ];

        $validated_result = self::request_validator(
            $request,
            $rules,
            self::_STD_FOR_STORE_FAILURE
        );

        if (is_object($validated_result)) {
            return $validated_result;
        }

        // 계정 생성
        Student_foreigner::create([
            'std_for_id' => $request->std_for_id,
            'password' => Hash::make(self::_STD_FOR_INIT_PASSWORD),
            'std_for_dept' => $request->std_for_dept,
            'std_for_name' => $request->std_for_name,
            'std_for_lang' => $request->std_for_lang,
            'std_for_country' => $request->std_for_country,
        ]);

        // 연락처 정보 등록
        Student_foreigners_contact::create([
            'std_for_id' => $request->std_for_id,
            'std_for_phone' => $request->std_for_phone,
            'std_for_mail' => $request->std_for_mail,
            'std_for_zoom_id' => $request->std_for_zoom_id,
        ]);

        return self::response_json(self::_STD_FOR_STORE_SUCCESS, 201);
    }

    /**
     * 유학생 비밀번호 변경
     * 관리자로 접근 -> 비밀번호 초기화.
     *
     * @param int $std_for_id
     * @param Request $request
     * @return Response
     */
    public function updateAccount(Student_foreigner $std_for_id, Request $request): JsonResponse
    {
        $is_user_admin = true;                                          /* 관리자 인증 여부 */

        //TODO auth 정보로 로직 나누기.
        $user_password = self::_STD_FOR_INIT_PASSWORD;

        if (!$is_user_admin) {
            $rules = [
                'std_for_passwd' => 'required|string|min:8',
            ];

            $validated_result = self::request_validator(
                $request,
                $rules,
                self::_STD_FOR_RESET_FAILURE
            );

            if (is_object($validated_result)) {
                return $validated_result;
            }

            /* 유학생이 원하는 비밀번호로 변경 */
            $user_password = $request->std_for_passwd;
        }

        $std_for_id->update([
            'password' => Hash::make($user_password),
        ]);

        return self::response_json(self::_STD_FOR_RESET_SUCCESS, 200);
    }

    /**
     * 유학생 계정 삭제
     *
     * @param int $std_for_id
     * @return Response
     */
    public function destroyAccount(Student_foreigner $std_for_id): JsonResponse
    {
        // 1. 연락처 정보 삭제
        Student_foreigners_contact::find($std_for_id['std_for_id'])->delete();
        // 2. 계정 삭제
        $std_for_id->delete();

        return self::response_json(self::_STD_FOR_DELETE_SUCCESS, 200);
    }

    /**
     * 유학생 즐겨찾기 등록 / 해제
     *
     * @param int $std_for_id
     * @param Request $request
     * @return Response
     */
    public function set_std_for_favorite(Student_foreigner $std_for_id, Request $request): JsonResponse
    {
        $rules = [
            'favorite_bool' => 'required|bool',
        ];

        $validated_result = self::request_validator(
            $request,
            $rules,
            self::_STD_FOR_FAVORITE_FAILURE
        );

        if (is_object($validated_result)) {
            return $validated_result;
        }
        // dd((int)$request->favorite_bool);
        $std_for_id->update(['std_for_state_of_favorite' => (int) $request->favorite_bool]);

        return self::response_json(self::_STD_FOR_FAVORITE_SUCCESS, 200);
    }
}
