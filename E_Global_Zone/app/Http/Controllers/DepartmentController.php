<?php

namespace App\Http\Controllers;

use App\Department;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Config;

class DepartmentController extends Controller
{
    private $department;

    public function __construct()
    {
        $this->department = new Department();
    }

    /**
     * 등록된 계열 / 학과 목록 조회
     *
     * @return JsonResponse
     */
    public function index(): JsonResponse
    {
        return $this->department->get_departments_list();
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
            $request, $rules, Config::get('constants.kor.dept.store.failure')
        );

        if (is_object($validated_result)) {
            return $validated_result;
        }

        $new_dept_name = $request->input('dept_name');
        return $this->department->store_department($new_dept_name);
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
            $request, $rules, Config::get('constants.kor.dept.update.failure')
        );

        if (is_object($validated_result)) {
            return $validated_result;
        }

        $update_dept_name = $request->input('dept_name');
        return $this->department->update_department($dept_id, $update_dept_name);
    }

    /**
     * 계열 / 학과 삭제
     *
     * @param Department $dept_id
     * @return JsonResponse
     */
    public function destroy(Department $dept_id): JsonResponse
    {
        return $this->department->destroy_department($dept_id);
    }
}
