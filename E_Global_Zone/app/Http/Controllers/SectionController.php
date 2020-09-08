<?php

namespace App\Http\Controllers;

use App\Reservation;
use App\Section;
use App\Work_student_foreigner;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class SectionController extends Controller
{
    private const _SECTION_SEARCH_RES_SUCCESS = "등록된 학기 목록을 반환합니다.";
    private const _SECTION_SEARCH_RES_FAILURE = "학기 조회에 실패하였습니다.";

    private const _SECTION_STORE_RES_SUCCESS = "학기 등록에 성공하였습니다.";
    private const _SECTION_STORE_RES_FAILURE = "학기 등록에 실패하였습니다.";

    private const _SECTION_UPDATE_RES_SUCCESS = "학기 정보 변경에 성공하였습니다.";
    private const _SECTION_UPDATE_RES_FAILURE = "학기 정보 변경에 실패하였습니다.";
    private const _SECTION_UPDATE_RES_FAILURE_OVER_DATE = "해당 학기가 시작하여 변경할 수 없습니다.";

    private const _SECTION_DELETE_RES_SUCCESS = "학기 정보 삭제에 성공하였습니다.";
    private const _SECTION_DELETE_RES_FAILURE = "학기 정보 삭제에 실패하였습니다.";

    private const _SECTION_KOR_ATTENDANCED_RES_SUCCESS1 = "현재까지 참석한 학기 정보를 반환합니다.";
    private const _SECTION_KOR_ATTENDANCED_RES_SUCCESS2 = "참석한 미팅이 없습니다.";

    /**
     * 년도별 등록된 전체 학기 목록 조회
     *
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request): JsonResponse
    {
        $rules = [
            'year' => 'integer|distinct|min:2019|max:2999',
            'name' => 'string',
            'sect_id' => 'integer'
        ];

        $validated_result = self::request_validator(
            $request,
            $rules,
            self::_SECTION_SEARCH_RES_FAILURE
        );

        if (is_object($validated_result)) {
            return $validated_result;
        }

        if (!empty($request->input('name'))) {
            $section_data =  Section::where('sect_name', $request->input('name'))->get()->first();
        } else if (!empty($request->input('sect_id'))) {
            $section_data =  Section::find($request->input('sect_id'));
        } else {
            $section_data =  Section::whereYear('sect_start_date', $request->input('year'))->orderBy('sect_start_date', 'DESC')->get();
            // 학기별 등록 유학생 학생 인원수 추가.
            foreach ($section_data as $section) {
                $section['std_for_count'] = Work_student_foreigner::where('work_sect', $section->sect_id)->count();
            }
        }

        return self::response_json(self::_SECTION_SEARCH_RES_SUCCESS, 200, $section_data);
    }

    /**
     * 한국인학생 - 참석한 학기 목록 조회
     *
     * @return \Illuminate\Http\Response
     */
    public function std_kor_attendanced_index(Request $request): JsonResponse
    {
        $std_kor_id = $request->input('std_kor_info')['std_kor_id'];

        $attendanced_section_data = Reservation::select(DB::raw('count(*) as res_count'), 'sect_id', 'sect_name', 'sect_start_date', 'sect_end_date')
            ->join('schedules as sch', 'sch_id', 'res_sch')
            ->join('sections', 'sect_id', 'sch_sect')
            ->where('res_std_kor', $std_kor_id)
            ->where('res_state_of_attendance', true)
            ->groupBy('sect_id')
            ->orderBy('sect_start_date', 'DESC')
            ->get();

        //TODO 상위 % 인지 계산 후 반영.

        $is_non_attendanced_data = $attendanced_section_data->count() == 0;

        if ($is_non_attendanced_data) return self::response_json(self::_SECTION_KOR_ATTENDANCED_RES_SUCCESS2, 202);

        return self::response_json(self::_SECTION_KOR_ATTENDANCED_RES_SUCCESS1, 200, $attendanced_section_data);
    }

    /**
     * 학기 등록
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request): JsonResponse
    {
        $rules = [
            'sect_name' => 'required|string|unique:sections,sect_name',
            'sect_start_date' => 'required|date',
            'sect_end_date' => 'required|date|after_or_equal:sect_start_date',
        ];

        $validated_result = self::request_validator(
            $request,
            $rules,
            self::_SECTION_STORE_RES_FAILURE
        );

        if (is_object($validated_result)) {
            return $validated_result;
        }

        $create_section = Section::create([
            'sect_name' => $request->input('sect_name'),
            'sect_start_date' => $request->input('sect_start_date'),
            'sect_end_date' => $request->input('sect_end_date'),
        ]);

        return self::response_json(self::_SECTION_STORE_RES_SUCCESS, 201, $create_section);
    }

    /**
     * 학기 수정
     *
     * @param \Illuminate\Http\Request $request
     * @param int $sect_id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Section $sect_id): JsonResponse
    {
        // 학기 시작 날짜 검사.
        $sect_start_date = strtotime($sect_id['sect_start_date']);
        $now_date = strtotime("Now");

        if ($sect_start_date < $now_date) {
            return self::response_json_error(self::_SECTION_UPDATE_RES_FAILURE_OVER_DATE);
        }

        $rules = [
            'sect_start_date' => 'required|date',
            'sect_end_date' => 'required|date|after_or_equal:sect_start_date',
            'guard' => 'required|string|in:admin'
        ];

        $validated_result = self::request_validator(
            $request,
            $rules,
            self::_SECTION_UPDATE_RES_FAILURE
        );

        if (is_object($validated_result)) {
            return $validated_result;
        }

        $sect_id->update([
            'sect_start_date' => $request->input('sect_start_date'),
            'sect_end_date' => $request->input('sect_end_date'),
        ]);

        return self::response_json(self::_SECTION_UPDATE_RES_SUCCESS, 200);
    }

    /**
     * 학기 삭제
     *
     * @param int $sect_id
     * @return \Illuminate\Http\Response
     */
    public function destroy(Request $request, Section $sect_id): JsonResponse
    {
        // <<-- Request 요청 관리자 권한 검사.
        $is_admin = self::is_admin($request);

        if (is_object($is_admin)) {
            return $is_admin;
        }
        // -->>

        try {
            $sect_id->delete();
            return self::response_json(self::_SECTION_DELETE_RES_SUCCESS, 200);
        } catch (Exception $e) {
            return self::response_json(self::_SECTION_DELETE_RES_FAILURE, 200);
        }
    }

    public function validate_request_section(
        int $sect_id,
        string $sect_end_date
    ): bool {
        return (empty(Section::where('sect_id', $sect_id)
            ->where('sect_end_date', $sect_end_date)
            ->where('sect_end_date', '>=', now())
            ->where('sect_start_date', '<=', now())
            ->first()));
    }
}
