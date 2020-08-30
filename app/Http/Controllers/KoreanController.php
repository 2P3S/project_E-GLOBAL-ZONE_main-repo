<?php

namespace App\Http\Controllers;

use App\Restricted_student_korean;
use App\Student_korean;
use Socialite;
use Exception;
use Illuminate\Http\JsonResponse;
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
    private const _STD_KOR_IS_ALREADY_REGISTERED = "이미 존재하는 학생의 정보입니다.";
    private const _STD_KOR_RGS_MAIL_FAILURE = "G - Suite 계정만 가입 가능합니다.";

    // updateApproval
    private const _STD_KOR_APR_UPDATE_SUCCESS = "명의 한국인 학생이 가입 승인 되었습니다.";
    private const _STD_KOR_APR_UPDATE_FAILURE = "가입 승인에 실패하였습니다. 한국인 학생 다시 목록을 확인해주세요";

    private const _STD_KOR_RGS_SUCCESS = "가입 신청에 성공하였습니다. 글로벌 존 관리자 승인 시 이용가능합니다.";
    private const _STD_KOR_RGS_FAILURE = "가입 신청에 실패하였습니다. 글로벌 존 관리자에게 문의해주세요.";

    private const _STD_KOR_RGS_DELETE_SUCCESS = " 한국인 학생이 삭제되었습니다.";
    private const _STD_KOR_RGS_DELETE_FAILURE = " 한국인 학생에 실패하였습니다.";

    private const _STD_KOR_INDEX_SUCCESS = "한국인 학생 정보 조회에 성공하였습니다.";
    private const _STD_KOR_INDEX_NONDATA = "해당 학생의 정보가 없습니다.";
    private const _STD_KOR_INDEX_FAILURE = "한국인 학생 정보 조회에 실패하였습니다.";

    private $restricted;

    public function __construct()
    {
        $this->restricted = new Restricted_student_korean();
    }

    /**
     * 계정 등록 - 대기 명단 조회
     *
     * @return \Illuminate\Http\Response
     */
    public function indexApproval(): JsonResponse
    {
        $approval_result = Student_korean::select('std_kor_id', 'std_kor_dept', 'std_kor_name', 'std_kor_phone', 'std_kor_mail')
            ->where('std_kor_state_of_permission', 0)
            ->get();

        // 가입 승인 대기중인 한국인 학생 인원수 계산.
        $approval_count = $approval_result->count();

        // 대기중인 학생이 없을 경우
        if ($approval_count == 0) {
            return self::response_json(self::_STD_KOR_APR_INDEX_FAILURE, 200);
        }
        // 대기중인 학생이 있을 경우
        else {
            $msg = self::_STD_KOR_APR_INDEX_SUCCESS1 . $approval_count . self::_STD_KOR_APR_INDEX_SUCCESS2;
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
            'approval.*' => 'required|integer|distinct|min:1000000|max:9999999'
        ];

        $validated_result = self::request_validator(
            $request,
            $rules,
            self::_STD_KOR_APR_UPDATE_FAILURE
        );

        if (is_object($validated_result)) {
            return $validated_result;
        }

        $update_std_kor_id_list = $request->input('approval');

        Student_korean::whereIn('std_kor_id', $update_std_kor_id_list)
            ->update([
                'std_kor_state_of_permission' => (int)true
            ]);

        return self::response_json(count($update_std_kor_id_list) . self::_STD_KOR_APR_UPDATE_SUCCESS, 200);
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
            'column_data' => 'required'
        ];

        $validated_result = self::request_validator(
            $request,
            $rules,
            self::_STD_KOR_INDEX_FAILURE
        );

        if (is_object($validated_result)) {
            return $validated_result;
        }

        $column = $request->input('column');
        $column_data = $request->input('column_data');

        $std_kor_info = Student_korean::where($column, $column_data)->get();

        $is_non_kor_data = $std_kor_info->count() === 0;

        // 검색 후 조회된 데이터가 없을 경우
        if ($is_non_kor_data) return self::response_json(self::_STD_KOR_INDEX_NONDATA, 202);

        return self::response_json(self::_STD_KOR_INDEX_SUCCESS, 200, $std_kor_info);
    }

    /**
     * 전체 한국인 학생 정보 조회
     * 페이지 url => api/admin/korean?page=1  ->  page = n 번호에 따라서 바뀜.
     * @return \Illuminate\Http\Response
     */
    public function index(): JsonResponse
    {
        try {
            // 이용제한 학생 기준 정렬 +  페이지네이션 기능 추가
            $std_koreans = Student_korean::where('std_kor_state_of_permission', true)
                ->orderBy('std_kor_state_of_restriction', 'DESC')
                ->paginate(15);

            // 이용제한 학생인경우 제한 사유 같이 보내기.
            foreach ($std_koreans as $korean) {
                if ($korean['std_kor_state_of_restriction'] == true) {
                    $korean['std_stricted_info'] = $this->restricted->get_restricted_korean_info($korean['std_kor_id'], true);
                }
            }
            return self::response_json(self::_STD_KOR_INDEX_SUCCESS, 200, $std_koreans);
        } catch (Exception $e) {
            return self::response_json(self::_STD_KOR_INDEX_FAILURE, 422);
        }
    }

    /**
     * 한국인 학생 계정 생성
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\Response
     */
    public function registerAccount(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'std_kor_id' => 'required|integer|unique:student_koreans,std_kor_id|distinct|min:1000000|max:9999999',
            'std_kor_dept' => 'required|integer',
            'std_kor_name' => 'required|string|min:2',
            'std_kor_phone' => 'required|string|unique:student_koreans,std_kor_phone|min:13',
        ]);

        $std_kor_user = Socialite::driver('google')->userFromToken($request->header('Authorization'));
        $std_kor_mail = $std_kor_user['email'];

        $parse_email = explode('@', $std_kor_mail)[1];
        $check_email = strcmp($parse_email, 'g.yju.ac.kr');

        if ($validator->fails() || $check_email) {
            return response()->json([
                'message' => $check_email ? self::_STD_KOR_RGS_MAIL_FAILURE : $validator->errors(),
            ], 422);
        }

        // 중복 회원 검사
        $is_registered_korean = Student_korean::where('std_kor_mail', $std_kor_mail)
            ->orWhere('std_kor_id', $request->input('std_kor_id'))
            ->count() > 0;

        if ($is_registered_korean) {
            return self::response_json(self::_STD_KOR_IS_ALREADY_REGISTERED, 422);
        }
        // 새로운 회원인 경우 계정 생성
        else {
            Student_korean::create([
                'std_kor_id' => $request->input('std_kor_id'),
                'std_kor_dept' => $request->input('std_kor_dept'),
                'std_kor_name' => $request->input('std_kor_name'),
                'std_kor_phone' => $request->input('std_kor_phone'),
                'std_kor_mail' => $std_kor_mail,
            ]);

            return self::response_json(self::_STD_KOR_RGS_SUCCESS, 201);
        }
    }

    /**
     * 계정 삭제
     *
     * @param int $std_kor_id
     * @return \Illuminate\Http\Response
     */
    public function destroyAccount(Student_korean $std_kor_id): JsonResponse
    {
        $std_kor_id->delete();

        return self::response_json(self::_STD_KOR_RGS_DELETE_SUCCESS, 200);
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
