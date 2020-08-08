<?php

namespace App\Http\Controllers;

use App\Department;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class DepartmentController extends Controller
{
    /**
     * 등록된 계열 / 학과 목록 조회
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return response()->json([
            'message' => '등록된 학기 목록 조회',
            'result' => Department::all(),
        ], 200);
    }

    /**
     * 계열 / 학과 등록
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'dept_name' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => $validator->errors(),
            ], 422);
        }

        $create_department = Department::create([
            'dept_name' => $request->dept_name,
        ]);

        return response()->json([
            'message' => '등록 완료',
            'result' => $create_department,
        ], 201);
    }

    /**
     * 계열 / 학과 이름 변경
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $dept_id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Department $dept_id)
    {
        $validator = Validator::make($request->all(), [
            'dept_name' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => $validator->errors(),
            ], 422);
        }

        $update_department = $dept_id->update([
            'dept_name' => $request->dept_name,
        ]);

        return response()->json([
            'message' => '업데이트 완료',
            'result' => $update_department,
        ], 200);
    }

    /**
     * 계열 / 학과 삭제
     *
     * @param  int  $dept_id
     * @return \Illuminate\Http\Response
     */
    public function destroy(Department $dept_id)
    {
        $dept_id->delete();

        return response()->json([
            'message' => '삭제 완료',
        ], 204);
    }
}
