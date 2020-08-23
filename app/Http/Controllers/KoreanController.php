<?php

namespace App\Http\Controllers;

use App\Restricted_student_korean;
use App\Student_korean;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class KoreanController extends Controller
{
    /*
     * [Refactoring]
     * TODO RESPONSE 수정
     * TODO validator 수정
     * TODO 접근 가능 범위 수정
     * TODO 한국인 유학생 -> 학번 validation 수정 min, max, unique
     */
    // indexApproval
    private const _STD_KOR_APR_INDEX_SUCCESS1 = "가입 승인 대기중인 한국인 학생은 ";
    private const _STD_KOR_APR_INDEX_SUCCESS2 = "명입니다.";
    private const _STD_KOR_APR_INDEX_FAILURE = "가입 승인 대기중인 한국인 학생이 없습니다.";

    // updateApproval
    private const _STD_KOR_APR_UPDATE_SUCCESS = "명의 한국인 학생이 가입 승인 되었습니다.";
    private const _STD_KOR_APR_UPDATE_FAILURE = "가입 승인에 실패하였습니다. 한국인 학생 다시 목록을 확인해주세요";

    private const _STD_KOR_RGS_SUCCESS = "가입 신청에 성공하였습니다. 글로벌 존 관리자 승인 시 이용가능합니다.";
    private const _STD_KOR_RGS_FAILURE = "가입 신청에 실패하였습니다. 글로벌 존 관리자에게 문의해주세요.";
    private const _STD_KOR_RGS_MAIL_FAILURE = "G - Suite 계정만 가입가능합니다.";

    private const _STD_KOR_RGS_DELETE_SUCCESS = " 한국인 학생이 삭제되었습니다.";
    private const _STD_KOR_RGS_DELETE_FAILURE = " 한국인 학생에 실패하였습니다.";


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

        // TODO 학생 수 카운트 -> 승인 대기 중인 한국인 학생이 없을 경우
        return response()->json([
            'message' => '회원가입 승인 대기중인 한국인 리스트 반환.',
            'data' => $approval_result
        ], 200);
    }

    /**
     * 계정 등록 - 승인
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\Response
     */
    public function updateApproval(Request $request)
    {
        $approval_data = $request->input('approval');

        // 한국인 학생 계정 승인여부 반환
        foreach ($approval_data as $approval) {
            $validator = Validator::make($approval, [
                'std_kor_id' => 'required|integer|distinct|min:1000000|max:9999999',
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
     * 페이지 url => api/admin/korean?page=1  ->  page = n 번호에 따라서 바뀜.
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        // 이용제한 학생 기준 정렬 +  페이지네이션 기능 추가
        $std_koreans= Student_korean::orderBy('std_kor_state_of_restriction', 'DESC')->paginate(15);

        // 이용제한 학생인경우 제한 사유 같이 보내기.
        foreach($std_koreans as $korean) {
            if($korean['std_kor_state_of_restriction'] == true) {
                $result = Restricted_student_korean::where('restrict_std_kor', $korean['std_kor_id'])->get();
                $korean['std_stricted_info'] = $result;
            }
        }

        return $std_koreans;
    }

    /**
     * 한국인 학생 계정 생성
     *
     * @param \Illuminate\Http\Request $request
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
     * @param int $std_kor_id
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
