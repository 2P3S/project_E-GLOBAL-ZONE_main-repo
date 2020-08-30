<?php

namespace App\Http\Middleware;

use App\Student_korean;
use Closure;
use Socialite;
use Illuminate\Http\Request;
use Exception;

class GoogleAuth
{
    private const _AUTH_FAILURE     = "사용자 인증에 실패하였습니다.";
    private const _ACCESS_FAILURE   = "회원 가입 후 이용 가능합니다.";
    private const _STD_KOR_RGS_MAIL_FAILURE = "G - Suite 계정만 접속 가능합니다.";
    private const _ACCESS_ERROR     = "잘못된 접근입니다.";

    /**
     * Handle an incoming request.
     *
     * @param  Request  $request
     * @param  Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {
        $header_token = $request->header('Authorization');

        if (empty($header_token))
            // 헤더에 토큰이 없는 경우
            return response()->json([
                'message' => self::_ACCESS_ERROR,
            ], 422);

        try {
            $std_kor_user = Socialite::driver('google')->userFromToken($header_token);
            $check_email = explode('@', $std_kor_user['email'])[1];
            $is_not_g_suite_mail = strcmp($check_email, 'g.yju.ac.kr');

            // E_Global_Zone 회원 확인
            $std_kor_info = Student_korean::where('std_kor_mail', '=', $std_kor_user['email'])->get()->first();

            // 지슈트 메일이 아닌 경우
            if ($is_not_g_suite_mail) {
                return response()->json([
                    'message' => self::_STD_KOR_RGS_MAIL_FAILURE,
                ], 422);
            } else if (empty($std_kor_info)) {
                return response()->json([
                    'message' => self::_ACCESS_FAILURE,
                ], 422);
            }

            $request['std_kor_info'] = $std_kor_info;
        } catch (Exception $e) {
            // 토큰이 만료 된 경우
            return response()->json([
                'message' => self::_AUTH_FAILURE,
            ], 422);
        }

        return $next($request);
    }
}
