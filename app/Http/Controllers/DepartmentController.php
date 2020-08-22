<?php

namespace App\Http\Controllers;

use App\Department;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DepartmentController extends Controller
{
    private const _DEPT_INDEX_SUCCESS = "계열/학과 목록 조회에 성공하였습니다.";

    private const _DEPT_STORE_SUCCESS = "(을)를 계열/학과 목록에 추가하였습니다.";
    private const _DEPT_STORE_FAILURE = "계열/학과 목록 추가에 실패하였습니다.";

    private const _DEPT_UPDATE_SUCCESS1 = "계열/학과 이름을 ";
    private const _DEPT_UPDATE_SUCCESS2 = "(으)로 변경하였습니다.";
    private const _DEPT_UPDATE_FAILURE = "계열/학과 이름 변경을 실패하였습니다.";

    private const _DEPT_DELETE_SUCCESS = "(을)를 계열/학과 목록에서 제거하였습니다.";

    /**
     * 등록된 계열 / 학과 목록 조회
     *
     * @return JsonResponse
     */
    public function index(): JsonResponse
    {
        $departments = Department::all();
        return
            self::response_json(self::_DEPT_INDEX_SUCCESS, 200, $departments);
    }

    /**
     * 계열 / 학과 등록
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function store(Request $request): JsonResponse
    {
        $rules = [
            'dept_name' => 'required|string|unique:departments,dept_name'
        ];

        $validated_result = self::request_validator(
            $request, $rules, self::_DEPT_STORE_FAILURE
        );

        if (is_object($validated_result)) {
            return $validated_result;
        }

        $new_dept_name = $request->input('dept_name');

        $created_department = Department::create([
            'dept_name' => $new_dept_name
        ]);

        $message_template = $new_dept_name . self::_DEPT_STORE_SUCCESS;
        return
            self::response_json($message_template, 201, $created_department);
    }

    /**
     * 계열 / 학과 이름 변경
     *
     * @param Request $request
     * @param Department $dept_id
     * @return JsonResponse
     */
    public function update(Request $request, Department $dept_id): JsonResponse
    {
        $rules = [
            'dept_name' => 'required|string|unique:departments,dept_name',
        ];

        $validated_result = self::request_validator(
            $request, $rules, self::_DEPT_UPDATE_FAILURE
        );

        if (is_object($validated_result)) {
            return $validated_result;
        }

        // <<-- 계열/학과 이름 변경 -> 메세지 저장
        $old_dept_name = $dept_id['dept_name'];
        $new_dept_name = $request->input('dept_name');
        $message_template =
            self::_DEPT_UPDATE_SUCCESS1 . $old_dept_name . "에서 " .
            $new_dept_name . self::_DEPT_UPDATE_SUCCESS2;
        // -->>

        return
            self::response_json($message_template, 200);
    }

    /**
     * 계열 / 학과 삭제
     *
     * @param Department $dept_id
     * @return JsonResponse
     * @throws Exception
     */
    public function destroy(Department $dept_id): JsonResponse
    {
        $deleted_dept_name = $dept_id['dept_name'];
        $dept_id->delete();

        $message_template = $deleted_dept_name . self::_DEPT_DELETE_SUCCESS;
        return
            self::response_json($message_template, 200);
    }
}
