<?php

namespace App\Http\Controllers;

use App\Department;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class DepartmentController extends Controller
{
    private const _DEPT_INDEX_SUCCESS = "계열/학과 목록 조회에 성공하였습니다.";

    private const _DEPT_STORE_SUCCESS = "(을)를 계열/학과 목록에 추가하였습니다.";
    private const _DEPT_STORE_FAILURE = "계열/학과 목록 추가에 실패하였습니다.";

    private const _DEPT_UPDATE_SUCCESS1 = "계열/학과 이름을 ";
    private const _DEPT_UPDATE_SUCCESS2 = "(으)로 변경하였습니다.";
    private const _DEPT_UPDATE_FAILURE = "계열/학과 이름 변경을 실패하였습니다.";

    private const _DEPT_DELETE_SUCCESS = "(을)를 계열/학과 목록에서 제거하였습니다.";

    private $validator;

    /**
     * 계열 / 학과에 대한 유효성 검사 실시
     *
     * @param Request $request
     * @param array $rules
     * @return bool
     */
    private function department_validator(
        Request $request,
        array $rules
    ): bool
    {
        $this->validator = Validator::make($request->all(), $rules);

        if ($this->validator->fails()) {
            return false;
        }

        return true;
    }

    /**
     * 등록된 계열 / 학과 목록 조회
     *
     * @return JsonResponse
     */
    public function index(): JsonResponse
    {
        return response()->json([
            'message' => self::_DEPT_INDEX_SUCCESS,
            'result' => Department::all(),
        ], 200);
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

        if (!$this->department_validator($request, $rules)) {
            return response()->json([
                'message' => self::_DEPT_STORE_FAILURE,
                'error' => $this->validator->errors(),
            ], 422);
        }

        $new_dept_name = $request->input('dept_name');

        $created_department = Department::create([
            'dept_name' => $new_dept_name
        ]);

        return response()->json([
            'message' => $new_dept_name . self::_DEPT_STORE_SUCCESS,
            'result' => $created_department,
        ], 201);
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

        if (!$this->department_validator($request, $rules)) {
            return response()->json([
                'message' => self::_DEPT_UPDATE_FAILURE,
                'error' => $this->validator->errors(),
            ], 422);
        }

        // <<-- 계열/학과 이름 변경 -> 메세지 저장
        $old_dept_name = $dept_id['dept_name'];
        $new_dept_name = $request->input('dept_name');
        $message_template =
            self::_DEPT_UPDATE_SUCCESS1 . $old_dept_name . "에서 " .
            $new_dept_name . self::_DEPT_UPDATE_SUCCESS2;
        // -->>

        $updated_department = $dept_id->update([
            'dept_name' => $new_dept_name
        ]);

        return response()->json([
            'message' => $message_template,
            'result' => $updated_department,
        ], 200);
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

        return response()->json([
            'message' => $deleted_dept_name . self::_DEPT_DELETE_SUCCESS
        ], 200);
    }
}
