<?php

namespace App\Http\Controllers;

use App\Section;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class SectionController extends Controller
{
    private const _SECTION_SEARCH_RES_SUCCESS = " 년도 등록된 학기 목록을 반환합니다.";
    private const _SECTION_SEARCH_RES_FAILURE = "학기 조회에 실패하였습니다.";

    private const _SECTION_STORE_RES_SUCCESS = "학기 등록에 성공하였습니다.";
    private const _SECTION_STORE_RES_FAILURE = "학기 등록에 실패하였습니다.";

    private const _SECTION_UPDATE_RES_SUCCESS = "학기 정보 변경에 성공하였습니다.";
    private const _SECTION_UPDATE_RES_FAILURE = "학기 정보 변경에 실패하였습니다.";

    private const _SECTION_DELETE_RES_SUCCESS = "학기 정보 삭제에 성공하였습니다.";
    private const _SECTION_DELETE_RES_FAILURE = "학기 정보 삭제에 실패하였습니다.";

    /**
     * 년도별 등록된 전체 학기 목록 조회
     *
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request): JsonResponse
    {
        $rules = [
            'year' => 'required|integer|distinct|min:2019|max:2999',
        ];

        $validated_result = self::request_validator(
            $request,
            $rules,
            self::_SECTION_SEARCH_RES_FAILURE
        );

        $year = $request->year;

        if (is_object($validated_result)) {
            return $validated_result;
        }

        $section_data = Section::whereYear('sect_start_date', $year)->get();

        return self::response_json($year . self::_SECTION_SEARCH_RES_SUCCESS, 200, $section_data);
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
            'sect_end_date' => 'required|date',
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
            'sect_name' => $request->sect_name,
            'sect_start_date' => $request->sect_start_date,
            'sect_end_date' => $request->sect_end_date,
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
        $rules = [
            'sect_name' => 'required|string',
            'sect_start_date' => 'required|date',
            'sect_end_date' => 'required|date',
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
            'sect_name' => $request->sect_name,
            'sect_start_date' => $request->sect_start_date,
            'sect_end_date' => $request->sect_end_date,
        ]);

        return self::response_json(self::_SECTION_UPDATE_RES_SUCCESS, 200);
    }

    /**
     * 학기 삭제
     *
     * @param int $sect_id
     * @return \Illuminate\Http\Response
     */
    public function destroy(Section $sect_id): JsonResponse
    {
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
