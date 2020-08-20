<?php

namespace App\Http\Controllers;

use App\Section;
use App\Student_foreigner;
use App\Student_foreigners_contact;
use App\Work_student_foreigner;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class ForeignerController extends Controller
{
    /*
     * [Refactoring]
     * TODO RESPONSE 수정
     * TODO validator 수정
     * TODO 공식문서 에러 메세지 커스텀하기 확인하기 -> FORM REQUEST 적용
     * TODO 근로유학생 관련된 로직을 근로유학생 컨트롤러로 분리필요(구조가 복잡) -> Section $sect_id 적용
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
    private const _STD_FOR_STORE_SUCCESS = " 유학생이 유학생 목록에 등록되었습니다.";
    private const _STD_FOR_STORE_FAILURE = " 유학생 등록에 실패하였습니다.";

    private const _STD_FOR_INIT_PASSWORD = "1q2w3e4r!";
    // 000 유학생의 비밀번호가 초기화가 성공하였습니다. (초기 비밀번호 : 1q2w3e4r!)
    // 000 유학생의 비밀번호가 초기화에 실패하였습니다.
    private const _STD_FOR_RESET_SUCCESS = "유학생의 비밀번호가 초기화가 성공하였습니다. (초기 비밀번호 : " . self::_STD_FOR_INIT_PASSWORD . ")";
    private const _STD_FOR_RESET_FAILURE = " 유학생의 비밀번호가 초기화에 실패하였습니다.";

    // 000 유학생이 유학생 목록에서 삭제되었습니다.
    // 000 유학생 삭제에 실패하였습니다.
    private const _STD_FOR_DELETE_SUCCESS = " 유학생이 유학생 목록에서 삭제되었습니다.";
    private const _STD_FOR_DELETE_FAILURE = " 유학생 삭제에 실패하였습니다.";


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
                'work_list_id', 'std_for_id', 'std_for_dept',
                'std_for_name', 'std_for_lang', 'std_for_country'
            )
                ->join('student_foreigners as for', 'work_student_foreigners.work_std_for', 'for.std_for_id')
                ->where('work_sect', $sect_id['sect_id'])->get();

        if (count($work_std_for_list) === 0) {
            return response()->json([
                'message' => self::_WORK_STD_FOR_INDEX_FAILURE
            ], 205);
        }

        return response()->json([
            'message' => $sect_name . self::_WORK_STD_FOR_INDEX_SUCCESS,
            'data' => $work_std_for_list,
        ], 200);
    }

    /**
     * 특정 유학생 정보 조회
     *
     * @param Request $request
     * @return JsonResponse
     */
    // TODO POST -> GET 수정 필요(상의)
    public function show(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'foreigners' => 'required|array',
            'foreigners.*' => 'required|integer|distinct|min:1000000|max:9999999'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => self::_STD_FOR_SHOW_FAILURE,
                'error' => $validator->errors()
            ], 422);
        }

        $req_std_for_id = $request->input('foreigners');

        $data_std_for = [];

        // 학생 정보 저장
        foreach ($req_std_for_id as $std_for_id) {
            // 학번 기준 검색
            $search_result =
                Student_foreigner::select(
                    'student_foreigners.std_for_id', 'student_foreigners.std_for_name',
                    'contact.std_for_phone', 'contact.std_for_mail', 'contact.std_for_zoom_id'
                )
                    ->join('student_foreigners_contacts as contact', 'student_foreigners.std_for_id', 'contact.std_for_id')
                    ->where('student_foreigners.std_for_id', $std_for_id)->get();

            // 검색 결과 저장
            if ($search_result) {
                $data_std_for[] = $search_result;
            }
        }

        return response()->json([
            'message' => self::_STD_FOR_SHOW_SUCCESS,
            'data' => $data_std_for,
        ]);
    }

    /**
     * 학기별 유학생 등록
     *
     * @param Request $request
     * @return Response
     */
    public function store(Request $request)
    {
        // TODO show 참고 validator 수정
        // TODO Section $sect_id 활용
        $data = json_decode($request->getContent(), true);

        // 학생 정보 저장
        foreach ($data['foreigners'] as $foreigner_id) {
            // 숫자 Validation 검사
            if (is_numeric($foreigner_id)) {
                // 존재하는 유학생인지 검사
                // TODO 존재하지 않는 유학생 선택 시 수정
                if (!Student_foreigner::find($foreigner_id)) {
                    return response()->json([
                        'message' => "{$foreigner_id} 학번은 존재하지 않는 학번입니다.",
                    ], 422);
                }

                // 이미 해당 학기에 등록한 학생인 경우
                $isDuplicatedStudent = Work_student_foreigner::where('work_std_for', $foreigner_id)
                    ->where('work_sect', $data['sect_id'])
                    ->count();

                // TODO validator 에 추가 -> unique : student_foreigners,std_for_id
                if ($isDuplicatedStudent) {
                    return response()->json([
                        'message' => "{$foreigner_id} 학번의 학생의 데이터가 중복입니다.",
                    ], 422);
                }

                Work_student_foreigner::create([
                    'work_std_for' => $foreigner_id,
                    'work_sect' => $data['sect_id']
                ]);
            } // foreigner_id가 숫자가 아닌 경우
            else {
                return response()->json([
                    'message' => '학번은 숫자만 가능합니다.',
                ], 422);
            }
        }

        return response()->json([
            'message' => ' 학기별 유학생 등록 완료',
        ], 201);
    }

    /**
     * 학기별 유학생 수정 (=삭제)
     *
     * @param int $work_list_id
     * @return Response
     */
    // TODO 한명의 유학생만 추가하는 경우는???
    public function destroy(Work_student_foreigner $work_list_id)
    {
        $work_list_id->delete();

        return response()->json([
            'message' => '해당 학기에 대한 유학생 정보 삭제 완료',
        ], 204);
    }

    /**
     * 유학생 계정 생성
     *
     * @param Request $request
     * @return Response
     */
    public function registerAccount(Request $request)
    {
        // TODO unique 추가
        $validator = Validator::make($request->all(), [
            'std_for_id' => 'required|integer|min:7',
            'std_for_dept' => 'required|integer',
            'std_for_name' => 'required|string|min:2',
            'std_for_lang' => 'required|string|min:2',
            'std_for_country' => 'required|string|min:2',
            'std_for_phone' => 'required|string',                             /* (주의) 유학생중 휴대폰이 없는 학생도 많다 */
            'std_for_mail' => 'required|email',
            'std_for_zoom_id' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => $validator->errors(),
            ], 422);
        }

        // 계정 생성
        //TODO 유학생 초기 비밀번호 환경변수 설정. (최종루트는 env)
        try {
            Student_foreigner::create([
                'std_for_id' => $request->std_for_id,
                'password' => Hash::make("1q2w3e4r!"),
                'std_for_dept' => $request->std_for_dept,
                'std_for_name' => $request->std_for_name,
                'std_for_lang' => $request->std_for_lang,
                'std_for_country' => $request->std_for_country,
            ]);
        } catch (Exception $e) {
            return response()->json([
                'message' => "이미 가입된 유학생입니다.",
            ], 422);
        }

        // 연락처 정보 등록
        Student_foreigners_contact::create([
            'std_for_id' => $request->std_for_id,
            'std_for_phone' => $request->std_for_phone,
            'std_for_mail' => $request->std_for_mail,
            'std_for_zoom_id' => $request->std_for_zoom_id,
        ]);

        return response()->json([
            'message' => '유학생 학생 계정 생성 완료',
        ], 201);
    }

    /**
     * 유학생 비밀번호 변경
     * 토큰 정보가 관리자인 경우 -> 비밀번호 1q2w3e4r! 초기화.
     *
     * @param int $std_for_id
     * @param Request $request
     * @return Response
     */
    public function updateAccount(Student_foreigner $std_for_id, Request $request)
    {
        $is_user_admin = true;                                          /* 관리자 인증 여부 */
        //TODO 리셋 비밀번호 환경변수 설정 ( 최종루트는 env )
        //TODO auth 정보로 로직 나누기.
        $user_password = "1q2w3e4r!";

        if (!$is_user_admin) {
            $validator = Validator::make($request->all(), [
                'std_for_passwd' => 'required|string|min:8',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'message' => $validator->errors(),
                ], 422);
            }

            /* 유학생이 원하는 비밀번호로 변경 */
            $user_password = $request->std_for_passwd;
        }

        $std_for_id->update([
            'password' => Hash::make($user_password),
        ]);

        return response()->json([
            'message' => '비밀번호 변경 완료',
        ], 200);
    }

    /**
     * 유학생 계정 삭제
     *
     * @param int $std_for_id
     * @return Response
     */
    public function destroyAccount(Student_foreigner $std_for_id)
    {
        // 1. 연락처 정보 삭제
        Student_foreigners_contact::find($std_for_id['std_for_id'])->delete();
        // 2. 계정 삭제
        $std_for_id->delete();

        return response()->json([
            'message' => '유학생 계정 삭제 완료',
        ], 200);
    }
}
