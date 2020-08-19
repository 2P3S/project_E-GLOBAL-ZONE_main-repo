<?php

namespace App\Http\Controllers;

use App\Work_student_foreigner;
use App\Student_foreigners_contact;
use App\Student_foreigner;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class ForeignerController extends Controller
{
    /**
     * 학기별 전체 유학생 정보 조회
     *
     * @param  int  $work_sect
     * @return \Illuminate\Http\Response
     */
    public function index($work_sect)
    {
        $search_result = Work_student_foreigner::select('work_list_id', 'std_for_id', 'std_for_dept', 'std_for_name', 'std_for_lang', 'std_for_country')
            ->join('student_foreigners as for', 'work_student_foreigners.work_std_for', 'for.std_for_id')
            ->where('work_sect', $work_sect)
            ->get();

        return response()->json([
            'message' => '학기별 전체 유학생 정보 조회 완료',
            'data' => $search_result,
        ], 200);
    }

    /**
     * 특정 유학생 정보 조회
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function show(Request $request)
    {
        $data = json_decode($request->getContent(), true);

        $data_student = [];

        // 학생 정보 저장
        foreach ($data['foreigners'] as $foreigner_id) {
            // 숫자 Validation 검사
            if (is_numeric($foreigner_id)) {
                // 학번 기준 검색
                $search_result = Student_foreigner::select('student_foreigners.std_for_id', 'student_foreigners.std_for_name', 'contact.std_for_phone', 'contact.std_for_mail', 'contact.std_for_zoom_id')
                    ->join('student_foreigners_contacts as contact', 'student_foreigners.std_for_id', 'contact.std_for_id')
                    ->where('student_foreigners.std_for_id', $foreigner_id)
                    ->get();

                // 검색 결과 저장
                if ($search_result) array_push($data_student, $search_result);
            }
            // foreigner_id가 숫자가 아닌 경우
            else {
                return response()->json([
                    'message' => '학번 조회는 숫자만 가능합니다.',
                ], 422);
            }
        }

        return response()->json([
            'message' => '유학생 정보를 반환합니다',
            'data' => $data_student,
        ]);
    }

    /**
     * 학기별 유학생 등록
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $data = json_decode($request->getContent(), true);

        // 학생 정보 저장
        foreach ($data['foreigners'] as $foreigner_id) {
            // 숫자 Validation 검사
            if (is_numeric($foreigner_id)) {
                // 존재하는 유학생인지 검사
                if (!Student_foreigner::find($foreigner_id)) {
                    return response()->json([
                        'message' => "{$foreigner_id} 학번은 존재하지 않는 학번입니다.",
                    ], 422);
                }

                // 이미 해당 학기에 등록한 학생인 경우
                $isDuplicatedStudent = Work_student_foreigner::where('work_std_for', $foreigner_id)
                    ->where('work_sect', $data['sect_id'])
                    ->count();

                if ($isDuplicatedStudent) {
                    return response()->json([
                        'message' => "{$foreigner_id} 학번의 학생의 데이터가 중복입니다.",
                    ], 422);
                }

                Work_student_foreigner::create([
                    'work_std_for' => $foreigner_id,
                    'work_sect' => $data['sect_id']
                ]);
            }
            // foreigner_id가 숫자가 아닌 경우
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
     * @param  int  $work_list_id
     * @return \Illuminate\Http\Response
     */
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
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function registerAccount(Request $request)
    {
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
     * @param  int  $std_for_id
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
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
     * @param  int  $std_for_id
     * @return \Illuminate\Http\Response
     */
    public function destroyAccount(Student_foreigner $std_for_id)
    {
        Student_foreigners_contact::find($std_for_id['std_for_id'])->delete();
        $std_for_id->delete();

        return response()->json([
            'message' => '유학생 계정 삭제 완료',
        ], 200);
    }
}
