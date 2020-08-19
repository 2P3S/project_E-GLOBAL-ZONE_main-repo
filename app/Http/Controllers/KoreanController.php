<?php

namespace App\Http\Controllers;

use App\Student_korean;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class KoreanController extends Controller
{
    /**
     * 계정 등록 - 대기 명단 조회
     *
     * @return \Illuminate\Http\Response
     */
    public function indexApproval()
    {
        $approval_result = Student_korean::select('std_kor_id', 'std_kor_dept', 'std_kor_name', 'std_kor_phone', 'std_kor_mail')
        ->where('std_kor_state_of_permission', 0)
        ->get();

        return response()->json([
            'message' => '회원가입 승인 대기중인 한국인 리스트 반환.',
            'data' => $approval_result
        ], 200);
    }

    /**
     * 계정 등록 - 승인
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function updateApproval(Request $request)
    {
        $data = json_decode($request->getContent(), true);

        // 한국인 학생 계정 승인여부 반환
        foreach ($data['approval'] as $approval) {
            $validator = Validator::make($approval, [
                'std_kor_id' => 'required|integer',
                'std_kor_state_of_permission' => 'required|boolean',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'message' => $validator->errors(),
                ], 422);
            }

            $korean = Student_korean::find($approval['std_kor_id']);

            $korean->std_kor_state_of_permission = $approval['std_kor_state_of_permission'];

            $korean->save();
        }

        return response()->json([
            'message' => '계정 승인 완료.',
        ], 200);
    }

    /**
     * 전체 한국인 학생 정보 조회
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //TODO 페이지네이션 기능 추가. + 이용제한 학생인경우 제한 사유 같이 보내기.
        $allSchdules = Student_korean::all();

        return $allSchdules;
    }

    /**
     * 한국인 학생 계정 생성
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function registerAccount(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'std_kor_id' => 'required|integer|min:7',
            'std_kor_dept' => 'required|integer',
            'std_kor_name' => 'required|string|min:2',
            'std_kor_phone' => 'required|string|min:13',
            'std_kor_mail' => 'required|email',
        ]);

        // 지슈트 g.yju.ac.kr 이메일 벨리데이션 검사
        $check_email = explode('@', $request->std_kor_mail)[1];
        $check_email = strcmp($check_email, 'g.yju.ac.kr');

        if ($validator->fails() || $check_email) {
            return response()->json([
                'message' => $check_email ? "G Suite 계정만 가입 가능합니다." : $validator->errors(),
            ], 422);
        }

        Student_korean::create([
            'std_kor_id' => $request->std_kor_id,
            'std_kor_dept' => $request->std_kor_dept,
            'std_kor_name' => $request->std_kor_name,
            'std_kor_phone' => $request->std_kor_phone,
            'std_kor_mail' => $request->std_kor_mail,
        ]);

        return response()->json([
            'message' => '한국인 학생 계정 생성 완료',
        ], 201);
    }

    /**
     * 계정 삭제
     *
     * @param  int  $std_kor_id
     * @return \Illuminate\Http\Response
     */
    public function destroyAccount(Student_korean $std_kor_id)
    {
        $std_kor_id->delete();

        return response()->json([
            'message' => '계정 삭제 완료',
        ], 204);
    }

    /**
     * 이용 제한 등록
     *
     * @return \Illuminate\Http\Response
     */
    public function indexRestrict()
    {
        //
    }

    /**
     * 이용 제한 해제
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroyRestrict($id)
    {
        //
    }

    /**
     * 학년도별 학생정보 CSV 파일 다운로드
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    // public function csv($id)
    // {
    //     //
    // }
}
