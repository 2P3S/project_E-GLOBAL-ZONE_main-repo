<?php

namespace App\Http\Controllers;

use App\Notice;
use App\Notices_img;
use App\SchedulesResultImg;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class NoticeController extends Controller
{
    private $notice_img;
    private $result_img;

    public function __construct()
    {
        $this->notice_img = new Notices_img();
        $this->result_img = new SchedulesResultImg();
    }

    /**
     * 관리자 - 공지사항 작성
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function store(Request $request): JsonResponse
    {
        $rules = [
            'noti_url' => 'required|string|in:zone,center',
            'noti_title' => 'required|string',
            'noti_content' => 'required|string',
            'noti_imgs' => 'nullable|array',
            'noti_imgs.*' => 'image|max:5000',
            'guard' => 'required|string|in:admin'
        ];

        // <<-- Request 유효성 검사
        $validated_result = self::request_validator(
            $request,
            $rules,
            "공지사항 작성에 실패했습니다."
        );

        if (is_object($validated_result)) {
            return $validated_result;
        }
        // -->>

        // <<-- 공지사항 작성
        $notice = Notice::create([
            'noti_url' => $request->input('noti_url'),
            'noti_title' => $request->input('noti_title'),
            'noti_content' => $request->input('noti_content')
        ]);
        // -->>

        // <<-- 공지사항 사진 저장
        if (!empty($request['noti_imgs'])) {
            $isSucceeded = $this->notice_img->set_imgs($notice, $request['noti_imgs']);

            if ($isSucceeded === false) {
                return self::response_json_error("공지사항 사진 저장 과정에서 에러가 발생하였습니다.");
            }
        }
        // -->>

        return self::response_json("공지사항 업로드에 성공하였습니다.", 201);
    }

    /**
     * 전체 - 공지사항 불러오기 (페이지네이션)
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function index(Request $request): JsonResponse
    {
        $rules = [
            'noti_url' => 'required|string|in:zone,center',
            'num_of_notice' => 'required|integer|distinct|min:1|max:20'
        ];

        $validated_result = self::request_validator(
            $request,
            $rules,
            "공지사항 조회에 실패하였습니다. 다시 시도 해주세요."
        );

        if (is_object($validated_result)) {
            return $validated_result;
        }

        $notices = Notice::where('noti_url', $request->input('noti_url'))
            ->orderBy('created_at', 'DESC')
            ->paginate($request->input('num_of_notice'));

        return self::response_json("공지사항 조회에 성공하였습니다.", 201, $notices);
    }

    /**
     * 전체 - 공지사항 게시글 사진 불러오기
     *
     * @param Notice $notice
     * @return JsonResponse
     */
    public function index_imgs(Notice $noti_id): JsonResponse
    {
        // 조회수 증가
        $noti_id->increment('noti_views', 1);

        $imgs = $this->notice_img->get_imgs($noti_id);

        foreach($imgs as $img) {
            $img['noti_img'] = $this->result_img->get_base64_img($img['noti_img']);
        }

        return self::response_json("공지사항 게시글 사진 조회에 성공하였습니다.", 200, $imgs);
    }
}
