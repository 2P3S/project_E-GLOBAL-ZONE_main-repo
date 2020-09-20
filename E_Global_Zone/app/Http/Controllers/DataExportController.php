<?php

namespace App\Http\Controllers;

use App\Department;
use App\Section;
use App\Student_foreigner;
use App\Student_korean;
use App\Work_student_foreigner;
use Box\Spout\Common\Exception\SpoutException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Config;
use Rap2hpoutre\FastExcel\FastExcel;

class DataExportController extends Controller
{
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
            'std_kor_id as 학번',
            'std_kor_name as 이름',
            'std_kor_phone as 연락처',
            'std_kor_mail as 이메일',
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
            'student_foreigners.std_for_id as 학번',
            'std_for_name as 이름',
            'std_for_phone as 연락처',
            'std_for_mail as 카카오톡 ID',
            'std_for_zoom_id as ZOOM ID'
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
            'work_student_foreigners.work_std_for as 학번',
            'std_for_name as 이름',
            'std_for_phone as 연락처',
            'std_for_mail as 카카오톡 ID',
            'std_for_zoom_id as ZOOM ID'
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


}
