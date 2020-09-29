<?php

namespace App\Http\Controllers;

use App\Department;
use App\Reservation;
use App\Schedule;
use Illuminate\Support\Collection;
use App\Section;
use App\Student_foreigner;
use App\Student_korean;
use App\Work_student_foreigner;
use Box\Spout\Common\Exception\SpoutException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\DB;
use Rap2hpoutre\FastExcel\FastExcel;

class DataExportController extends Controller
{
    private $department;

    private function get_download_error(): JsonResponse
    {
        $message = Config::get('constants.kor.data_export.failure');
        return self::response_json_error($message);
    }

    public function index_dept(Request $request)
    {
        // <<-- Request 요청 관리자 권한 검사.
        $is_admin = self::is_admin($request);

        if (is_object($is_admin)) {
            return $is_admin;
        }
        // -->>

        $departments = Department::all();
        $name = Config::get('constants.kor.data_export.dept');

        try {
            return (new FastExcel($departments))->download($name, function ($departments) {
                return [
                    '계열/학과 이름' => $departments->dept_name,
                ];
            });
        } catch (SpoutException $e) {
            return $this->get_download_error();
        }
    }

    // TODO 조건 검색 추가 필요
    public function index_std_kor(Request $request)
    {
        // <<-- Request 요청 관리자 권한 검사.
        $is_admin = self::is_admin($request);

        if (is_object($is_admin)) {
            return $is_admin;
        }
        // -->>

        $select_column = [
            'dept_name as 계열/학과',
            'std_kor_id as 한국 학생 학번',
            'std_kor_name as 한국 학생 이름',
            'std_kor_phone as 한국 학생 연락처',
            'std_kor_mail as 한국 학생 이메일',
            'std_kor_num_of_attendance as 출석 횟수',
            'std_kor_num_of_absent as 결석 횟수',
            'std_kor_state_of_restriction as 이용 제한 여부',
            DB::raw("(CASE WHEN std_kor_state_of_restriction = 1 THEN '이용 제한' ELSE '이용 가능' END) AS '이용 제한 여부'"),
        ];

        $std_kor_list = Student_korean::select($select_column)
            ->orderBy('std_kor_dept')
            ->orderBy('std_kor_id')
            ->join('departments as dept', 'student_koreans.std_kor_dept', 'dept.dept_id')
            ->get();
        $name = Config::get('constants.kor.data_export.std_kor');

        try {
            return (new FastExcel($std_kor_list))->download($name);
        } catch (SpoutException $e) {
            return $this->get_download_error();
        }
    }

    public function index_std_for(Request $request)
    {
        // <<-- Request 요청 관리자 권한 검사.
        $is_admin = self::is_admin($request);

        if (is_object($is_admin)) {
            return $is_admin;
        }
        // -->>

        $select_column = [
            'dept_name as 계열/학과',
            'std_for_lang as 언어',
            'std_for_country as 국가',
            'student_foreigners.std_for_id as 유학생 학번',
            'std_for_name as 유학생 이름',
            'std_for_phone as 연락처',
            'std_for_mail as 카카오톡 ID',
            'std_for_zoom_id as ZOOM ID',
            'std_for_num_of_delay_permission as 예약 승인 지연 횟수',
            'std_for_num_of_delay_input as 결과 입력 지연 횟수'
        ];

        $std_for_list = Student_foreigner::select($select_column)
            ->orderBy('std_for_lang')
            ->orderBy('student_foreigners.std_for_id')
            ->join('student_foreigners_contacts as std_for_contact', 'student_foreigners.std_for_id', 'std_for_contact.std_for_id')
            ->join('departments as dept', 'student_foreigners.std_for_dept', 'dept.dept_id')
            ->get();
        $name = Config::get('constants.kor.data_export.std_for');

        try {
            return (new FastExcel($std_for_list))->download($name);
        } catch (SpoutException $e) {
            return $this->get_download_error();
        }
    }

    public function index_std_for_by_section(Request $request, Section $sect_id)
    {
        // <<-- Request 요청 관리자 권한 검사.
        $is_admin = self::is_admin($request);

        if (is_object($is_admin)) {
            return $is_admin;
        }
        // -->>

        $select_column = [
            'dept_name as 계열/학과',
            'std_for_lang as 언어',
            'std_for_country as 국가',
            'work_student_foreigners.work_std_for as 유학생 학번',
            'std_for_name as 유학생 이름',
            'std_for_phone as 유학생 연락처',
            'std_for_mail as 카카오톡 ID',
            'std_for_zoom_id as ZOOM ID',
            'std_for_num_of_delay_permission as 예약 승인 지연 횟수',
            'std_for_num_of_delay_input as 결과 입력 지연 횟수'
        ];

        $work_std_for_list = Work_student_foreigner::select($select_column)
            ->join('student_foreigners as std_for', 'work_student_foreigners.work_std_for', 'std_for.std_for_id')
            ->join('student_foreigners_contacts as std_for_contact', 'work_student_foreigners.work_std_for', 'std_for_contact.std_for_id')
            ->join('departments as dept', 'std_for.std_for_dept', 'dept.dept_id')
            ->where('work_sect', $sect_id['sect_id'])
            ->get();

        $name = $sect_id['sect_name'] . " " . Config::get('constants.kor.data_export.work_std_for');

        try {
            return (new FastExcel($work_std_for_list))->download($name);
        } catch (SpoutException $e) {
            return $this->get_download_error();
        }
    }

    public function index_sch_by_date(Request $request)
    {
        // <<-- Request 요청 관리자 권한 검사.
        $is_admin = self::is_admin($request);

        if (is_object($is_admin)) {
            return $is_admin;
        }
        // -->>

        $rules = [
            'start_date' => 'required|date',
            'end_date' => 'required|date|after:start_date',
        ];

        $validated_result = self::request_validator(
            $request,
            $rules,
            Config::get('constants.kor.data_export.failure')
        );

        if (is_object($validated_result)) {
            return $validated_result;
        }

        $start_date = $request->input('start_date');
        $end_date = $request->input('end_date');

        $select_column = [
            'sch_id as 스케줄 번호',
            'sect_name as 학기명',
            'sch_start_date as 시작 시간',
            'sch_end_date as 종료 시간',
            'std_for_lang as 언어',
            'std_for_country as 국가',
            'sch_std_for as 유학생 학번',
            'std_for_name as 유학생 이름',
            DB::raw("(CASE WHEN sch_state_of_result_input = 1 THEN '완료' ELSE '미완료' END) AS '결과 입력 여부'"),
            DB::raw("(CASE WHEN sch_state_of_permission = 1 THEN '승인' ELSE '미승인' END) AS '관리자 승인 여부'")
        ];

        $sch_list = Schedule::select($select_column)
            ->join('sections', 'schedules.sch_sect', 'sections.sect_id')
            ->join('student_foreigners as std_for', 'schedules.sch_std_for', 'std_for.std_for_id')
            ->whereDate('sch_start_date', '>=', $start_date)
            ->whereDate('sch_start_date', '<=', $end_date)
            ->orderBy('sch_start_date')
            ->get();


        $name = date("[Y년 m월 d일", strtotime($start_date)) . " - " . date("m월 d일] ", strtotime($end_date)) . Config::get('constants.kor.data_export.sch');

        try {
            return (new FastExcel($sch_list))->download($name);
        } catch (SpoutException $e) {
            return $this->get_download_error();
        }
    }

    public function index_res_by_date(Request $request)
    {
        // <<-- Request 요청 관리자 권한 검사.
        $is_admin = self::is_admin($request);

        if (is_object($is_admin)) {
            return $is_admin;
        }
        // -->>

        $rules = [
            'start_date' => 'required|date',
            'end_date' => 'required|date|after:start_date',
        ];

        $validated_result = self::request_validator(
            $request,
            $rules,
            Config::get('constants.kor.data_export.failure')
        );

        if (is_object($validated_result)) {
            return $validated_result;
        }

        $start_date = $request->input('start_date');
        $end_date = $request->input('end_date');

        $select_column = [
            'res_sch as 스케줄 번호',
            'sect_name as 학기명',
            'sch_start_date as 시작 시간',
            'sch_end_date as 종료 시간',
            'std_for_lang as 언어',
            'std_for_country as 국가',
            'sch_std_for as 유학생 학번',
            'std_for_name as 유학생 이름',
            'std_kor_id as 참가 학생 학번',
            'std_kor_name as 참가 학생 이름',
            DB::raw("(CASE WHEN res_state_of_permission = 1 THEN '승인' ELSE '미승인' END) AS '예약 승인 여부'"),
            DB::raw("(CASE WHEN res_state_of_attendance = 1 THEN '출석' ELSE '미참석' END) AS '출석 여부'")
        ];

        $res_list = Reservation::select($select_column)
            ->join('schedules', 'schedules.sch_id', 'res_sch')
            ->join('sections', 'sections.sect_id', 'schedules.sch_sect')
            ->join('student_koreans as std_kor', 'std_kor.std_kor_id', 'res_std_kor')
            ->join('student_foreigners as std_for', 'std_for.std_for_id', 'sch_std_for')
            ->whereDate('sch_start_date', '>=', $start_date)
            ->whereDate('sch_start_date', '<=', $end_date)
            ->orderBy('sch_start_date')
            ->get();


        $name = date("[Y년 m월 d일", strtotime($start_date)) . " - " . date("m월 d일] ", strtotime($end_date)) . Config::get('constants.kor.data_export.res');

        try {
            return (new FastExcel($res_list))->download($name);
        } catch (SpoutException $e) {
            return $this->get_download_error();
        }
    }
}
