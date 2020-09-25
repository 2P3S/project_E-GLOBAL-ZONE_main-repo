<?php

namespace App\Http\Controllers;

use App\Reservation;
use App\Restricted_student_korean;
use App\Student_korean;
use Socialite;
use Exception;
use Illuminate\Support\Facades\Config;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class KoreanController extends Controller
{
    private $restricted;
    private $std_kor;

    public function __construct()
    {
        $this->std_kor = new Student_korean();
        $this->restricted = new Restricted_student_korean();
    }

    /**
     * 계정 등록 - 대기 명단 조회
     *
     * @return \Illuminate\Http\Response
     */
    public function indexApproval(Request $request): JsonResponse
    {
        // <<-- Request 요청 관리자 권한 검사.
        $is_admin = self::is_admin($request);

        if (is_object($is_admin)) {
            return $is_admin;
        }
        // -->>

        $approval_result = Student_korean::select('std_kor_id', 'std_kor_dept', 'std_kor_name', 'std_kor_phone', 'std_kor_mail')
            ->where('std_kor_state_of_permission', 0)
            ->get();

        // 가입 승인 대기중인 한국인 학생 인원수 계산.
        $approval_count = $approval_result->count();

        // 대기중인 학생이 없을 경우
        if ($approval_count == 0) {
            return self::response_json(Config::get('constants.kor.std_kor.index_approval.no_value'), 202);
        }
        // 대기중인 학생이 있을 경우
        else {
            $msg = Config::get('constants.kor.std_kor.index_approval.success1') . $approval_count . Config::get('constants.kor.std_kor.index_approval.success2');
            return self::response_json($msg, 200, $approval_result);
        }
    }

    /**
     * 계정 등록 - 승인
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\Response
     */
    public function updateApproval(Request $request): JsonResponse
    {
        $rules = [
            'approval' => 'required|array',
            'approval.*' => 'required|integer|distinct|min:1000000|max:9999999',
            'guard' => 'required|string|in:admin'
        ];

        $validated_result = self::request_validator(
            $request,
            $rules,
            Config::get('constants.kor.std_kor.update_approval.failure')
        );

        if (is_object($validated_result)) {
            return $validated_result;
        }

        $update_std_kor_id_list = $request->input('approval');

        Student_korean::whereIn('std_kor_id', $update_std_kor_id_list)
            ->update([
                'std_kor_state_of_permission' => (int)true
            ]);

        return self::response_json(count($update_std_kor_id_list) . Config::get('constants.kor.std_kor.update_approval.success'), 200);
    }

    /**
     *  특정 한국인 학생 정보 조회
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\Response
     */
    public function search_std_kor_data_res(Request $request): JsonResponse
    {
        $rules = [
            'column' => 'required|in:std_kor_id,std_kor_name,std_kor_phone,std_kor_mail',
            'column_data' => 'required',
            'guard' => 'required|string|in:admin'
        ];

        $validated_result = self::request_validator(
            $request,
            $rules,
            Config::get('constants.kor.std_kor.index.failure')
        );

        if (is_object($validated_result)) {
            return $validated_result;
        }

        $column = $request->input('column');
        $column_data = $request->input('column_data');

        $std_kor_info = Student_korean::where($column, $column_data)->get();

        $is_non_kor_data = $std_kor_info->count() === 0;

        // 검색 후 조회된 데이터가 없을 경우
        if ($is_non_kor_data) return self::response_json(Config::get('constants.kor.std_kor.index.no_value'), 202);

        return self::response_json(Config::get('constants.kor.std_kor.index.success'), 200, $std_kor_info);
    }

    /**
     * 전체 한국인 학생 정보 조회
     * 페이지 url => api/admin/korean?page=1  ->  page = n 번호에 따라서 바뀜.
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request): JsonResponse
    {
        $rules = [
            'orderby' => 'required|in:std_kor_dept,std_kor_state_of_restriction,std_kor_num_of_attendance,std_kor_num_of_absent',
            'guard' => 'required|string|in:admin'
        ];

        $validated_result = self::request_validator(
            $request,
            $rules,
            Config::get('constants.kor.std_kor.index.failure')
        );

        if (is_object($validated_result)) {
            return $validated_result;
        }

        // 이용제한 학생 기준 정렬 +  페이지네이션 기능 추가
        $std_koreans = Student_korean::where('std_kor_state_of_permission', true)
            ->orderBy($request->input('orderby'), 'DESC')
            ->paginate(10);

        // 이용제한 학생인경우 제한 사유 같이 보내기.
        foreach ($std_koreans as $korean) {
            if ($korean['std_kor_state_of_restriction'] == true) {
                $korean['std_stricted_info'] = $this->restricted->get_korean_restricted_info($korean['std_kor_id'], true);
            }
        }

        return self::response_json(Config::get('constants.kor.std_kor.index.success'), 200, $std_koreans);
    }

    /**
     * 한국인 학생 계정 생성
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\Response
     */
    public function registerAccount(Request $request): JsonResponse
    {
        // <<-- Google 에서 이메일 요청.
        $std_kor_user = Socialite::driver('google')->userFromToken($request->header('Authorization'));
        $request['std_kor_mail'] = $std_kor_user['email'];
        // -->>

        $rules = [
            'std_kor_id' => 'required|integer|unique:student_koreans,std_kor_id|distinct|min:1000000|max:9999999',
            'std_kor_dept' => 'required|integer',
            'std_kor_name' => 'required|string|min:2',
            'std_kor_phone' => 'required|phone_number|unique:student_koreans,std_kor_phone',
            'std_kor_mail' => 'required:g_suite_mail|unique:student_koreans,std_kor_mail'
        ];

        $validated_result = self::request_validator(
            $request,
            $rules,
            Config::get('constants.kor.std_kor.store.failure')
        );

        if (is_object($validated_result)) {
            return $validated_result;
        }

        // 새로운 회원인 경우 계정 생성
        $std_kor_data = [
            'std_kor_id' => $request->input('std_kor_id'),
            'std_kor_dept' => $request->input('std_kor_dept'),
            'std_kor_name' => $request->input('std_kor_name'),
            'std_kor_phone' => $request->input('std_kor_phone'),
            'std_kor_mail' => $request->input('std_kor_mail'),
        ];

        $this->std_kor->store_std_kor_info($std_kor_data);

        return self::response_json(Config::get('constants.kor.std_kor.store.success'), 201);
    }

    /**
     * 계정 삭제
     *
     * @return \Illuminate\Http\Response
     */
    public function destroyAccount(Student_korean $std_kor_id): JsonResponse
    {
        $std_kor_name = $std_kor_id['std_kor_name'];
        try {
            $std_kor_id->delete();
        } catch (Exception $e) {
            return self::response_json(Config::get('constants.kor.std_kor.destroy.failure'), 422);
        }
        return self::response_json($std_kor_name . Config::get('constants.kor.std_kor.destroy.success'), 200);
    }

    /**
     * 학년도별 학생정보 CSV 파일 다운로드
     *
     * @param int $id
     * @return \Illuminate\Http\Response
     */
    // public function csv($id)
    // {
    //     //
    // }
}
