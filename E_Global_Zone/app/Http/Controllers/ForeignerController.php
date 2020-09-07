<?php

namespace App\Http\Controllers;

use App\Student_foreigner;
use App\Student_foreigners_contact;
use App\Work_student_foreigner;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Hash;
use phpDocumentor\Reflection\Types\Self_;

class ForeignerController extends Controller
{
    /*
     * [Refactoring]
     * TODO RESPONSE 수정
     * TODO 접근 가능 범위 수정
     */

    // 000 유학생이 등록되었습니다.
    // 000 유학생 등록에 실패하였습니다.
    private const _STD_FOR_STORE_SUCCESS = " 유학생이 등록되었습니다.";
    private const _STD_FOR_STORE_FAILURE = " 유학생 등록에 실패하였습니다.";

    // 000 유학생의 비밀번호가 초기화가 성공하였습니다. (초기 비밀번호 : 1q2w3e4r!)
    // 000 유학생의 비밀번호가 초기화에 실패하였습니다.
    private const _STD_FOR_RESET_SUCCESS = " 비밀번호 초기화가 성공하였습니다.";
    private const _STD_FOR_RESET_FAILURE = " 비밀번호 변경에 실패하였습니다.";

    private const _STD_FOR_FAVORITE_SUCCESS = "유학생 즐겨찾기 변경에 성공하였습니다.";
    private const _STD_FOR_FAVORITE_FAILURE = "유학생 즐겨찾기 변경에 실패하였습니다.";

    // 000 유학생이 삭제되었습니다.
    // 000 유학생 삭제에 실패하였습니다.
    private const _STD_FOR_DELETE_SUCCESS = " 유학생이 삭제되었습니다.";
    private const _STD_FOR_DELETE_FAILURE = " 유학생 삭제에 실패하였습니다.";

    // 000 학번의 학생의 데이터가 중복입니다.
    private const _STD_FOR_DUPLICATED_DATA = " 학번의 학생의 데이터가 중복입니다.";


    private $std_for;
    private $std_for_contact;

    public function __construct()
    {
        $this->std_for = new Student_foreigner();
        $this->std_for_contact = new Student_foreigners_contact();
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
            'foreigners.*' => 'required|integer|distinct|min:1000000|max:9999999',
            'guard' => 'required|string|in:admin'
        ];

        $validated_result = self::request_validator(
            $request, $rules, Config::get('constants.kor.std_for_contacts.index.failure')
        );

        if (is_object($validated_result)) {
            return $validated_result;
        }

        $req_std_for_list = $request->input('foreigners');
        return $this->std_for->get_std_for_contacts($req_std_for_list);
        // Student_foreigner 모델로 분리
    }

    /**
     * 유학생 계정 생성
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function store(Request $request): JsonResponse
    {
        $rules = [
            'std_for_id' => 'required|integer|unique:student_foreigners,std_for_id|unique:student_koreans,std_kor_id|distinct|min:1000000|max:9999999',
            'std_for_dept' => 'required|integer',
            'std_for_name' => 'required|string|min:2',
            'std_for_lang' => 'required|string|min:2|in:영어,중국어,일본어',
            'std_for_country' => 'required|string|min:2',
            'std_for_phone' => 'required|phone_number|unique:student_foreigners_contacts,std_for_phone',
            'std_for_mail' => 'required|email|unique:student_foreigners_contacts,std_for_mail',
            'std_for_zoom_id' => 'required|integer|unique:student_foreigners_contacts,std_for_zoom_id|between:1000000000,9999999999',
            'guard' => 'required|string|in:admin'
        ];

        $validated_result = self::request_validator(
            $request, $rules, self::_STD_FOR_STORE_FAILURE
        );

        if (is_object($validated_result)) {
            return $validated_result;
        }

        $std_for_data = [
            'std_for_id' => $request->input('std_for_id'),
            'password' => Hash::make(Config::get('constants.initial_password.foreigner')),
            'std_for_dept' => $request->input('std_for_dept'),
            'std_for_name' => $request->input('std_for_name'),
            'std_for_lang' => $request->input('std_for_lang'),
            'std_for_country' => $request->input('std_for_country'),
        ];

        $std_for_contact_data = [
            'std_for_id' => $request->input('std_for_id'),
            'std_for_phone' => $request->input('std_for_phone'),
            'std_for_mail' => $request->input('std_for_mail'),
            'std_for_zoom_id' => $request->input('std_for_zoom_id'),
        ];

        $std_for = $this->std_for->store_std_for_info($std_for_data);
        $std_for_contact = $this->std_for_contact->store_std_for_contact($std_for_contact_data);

        $is_create_success = $std_for !== null && $std_for_contact !== null;

        if (!$is_create_success) {
            $this->std_for->destroy_std_for($std_for);

            $message = Config::get('constants.kor.std_for.store.failure');
            return self::response_json_error($message);
        }

        $message = $request->input('std_for_name') . Config::get('constants.kor.std_for.store.success');
        return self::response_json($message, 201);
    }

    /**
     * 유학생 비밀번호 초기화
     *
     * @param Student_foreigner $std_for_id
     * @param Request $request
     * @return Response
     */
    public function updateAccount(?Student_foreigner $std_for_id, Request $request): JsonResponse
    {
        $rules = [
            'guard' => 'required|string|in:foreigner,admin',
            'password' => 'nullable|string|regex:/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/'
        ];

        $validated_result = self::request_validator(
            $request, $rules, self::_STD_FOR_RESET_FAILURE
        );

        if (is_object($validated_result)) {
            return $validated_result;
        }

        if ($request->input('guard') === 'foreigner') {
            $std_for_id = $request->user($request->input('guard'))['std_for_id'];
            Student_foreigner::find($std_for_id)->update([
                'password' => Hash::make($request->input('password')),
            ]);
        } else {
            $std_for_id->update([
                'password' => Hash::make(Config::get('constants.initial_password.foreigner')),
            ]);
        }

        return self::response_json(self::_STD_FOR_RESET_SUCCESS, 200);
    }

    /**
     * 유학생 계정 삭제
     *
     * @param Request $request
     * @param Student_foreigner $std_for_id
     * @return JsonResponse
     */
    public function destroyAccount(
        Request $request,
        Student_foreigner $std_for_id
    ): JsonResponse
    {
        // <<-- Request 요청 관리자 권한 검사.
        $is_admin = self::is_admin($request);

        if (is_object($is_admin)) {
            return $is_admin;
        }
        // -->>

        // 계정, 연락처 정보 삭제
        $is_delete_success = $this->std_for->destroy_std_for($std_for_id);

        if (!$is_delete_success) {
            $message = Config::get('constants.kor.std_for.destroy.failure');
            return self::response_json_error($message);
        }

        $message = Config::get('constants.kor.std_for.destroy.success.failure');
        return self::response_json($message, 200);
    }

    /**
     * 유학생 즐겨찾기 등록 / 해제
     *
     * @param Student_foreigner $std_for_id
     * @param Request $request
     * @return JsonResponse
     */
    public function set_std_for_favorite(Student_foreigner $std_for_id, Request $request): JsonResponse
    {
        $rules = [
            'favorite_bool' => 'required|bool',
            'guard' => 'required|string|in:admin'
        ];

        $validated_result = self::request_validator(
            $request, $rules, self::_STD_FOR_FAVORITE_FAILURE
        );

        if (is_object($validated_result)) {
            return $validated_result;
        }

        $std_for_id->update(['std_for_state_of_favorite' => (int)$request->input('favorite_bool')]);

        return self::response_json(self::_STD_FOR_FAVORITE_SUCCESS, 200);
    }
}
