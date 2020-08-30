<?php

namespace App\Http\Controllers;

use Socialite;
use App\Model\Authenticator;
use App\Student_korean;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class LoginController extends Controller
{
    private const _LOGIN_FAILURE = "로그인에 실패하였습니다.";
    private const _AUTH_FAILURE = "G-Suite 계정이 아닙니다.";
    private const _ACCESS_FAILURE   = "회원 가입 후 이용 가능합니다.";

    private const _LOGIN_ERROR = "아이디 또는 비밀번호를 다시 확인하세요.";
    private const _LOGIN_SUCCESS = " 님 로그인 됐습니다. 어서오세요";
    private const _LOGOUT_SUCCESS = "로그아웃되었습니다.";
    private const _PASSWORD_CHANGE_REQUIRE = "초기 비밀번호로 로그인하였습니다. 비밀번호 변경 후, 재접속 해주세요.";

    private const _ADMIN_INIT_PASSWORD = "oicyju5630!";
    private const _STD_FOR_INIT_PASSWORD = "1q2w3e4r!";

    /**
     * @var Authenticator
     */
    private $authenticator;

    public function __construct(Authenticator $authenticator)
    {
        $this->authenticator = $authenticator;
    }

    /**
     * 로그인 시, 사용자 정보 인증
     *
     * @param Request $request
     * @param string $key
     * @return array|null
     */
    private function login_authenticator(
        Request $request,
        string $key
    ): ?array {
        $credentials = array_values($request->only($key, 'password', 'provider'));
        $credentials[] = $key;

        if (!$user = $this->authenticator->attempt(...$credentials)) {
            return null;
        }

        $token = '';

        $initial_password = [
            'admins' => self::_ADMIN_INIT_PASSWORD,
            'foreigners' => self::_STD_FOR_INIT_PASSWORD
        ];

        // <<-- 초기 비밀번호로 로그인 시
        $is_login_init_password = $initial_password[$credentials[2]] !== $credentials[1];
        if ($is_login_init_password) {
            $token = $user->createToken(ucfirst($credentials[2]) . ' Token')->accessToken;
        }
        // -->>

        return [
            'info' => $user,
            'token' => $token
        ];
    }

    /**
     * 관리자 로그인
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function login_admin(Request $request): JsonResponse
    {
        $rules = [
            'account' => 'required|string',
            'password' => 'required|string|min:8',
            'provider' => 'required|string|in:admins'
        ];

        $validated_result = self::request_validator(
            $request,
            $rules,
            self::_LOGIN_FAILURE
        );

        if (is_object($validated_result)) {
            return $validated_result;
        }

        // <<-- 로그인 실패 시
        if (empty($admin = $this->login_authenticator($request, 'account'))) {
            return
                self::response_json(self::_LOGIN_ERROR, 401);
        }
        // -->>

        $token = $admin['token'];

        // <<-- 초기 비밀번호로 로그인 시
        if (empty($token)) {
            return
                self::response_json(self::_PASSWORD_CHANGE_REQUIRE, 202);
        }
        // -->>

        // <<-- 로그인 성공 시
        $message_template = $admin['info']['name'] . self::_LOGIN_SUCCESS;

        return
            self::response_json($message_template, 200, (object)$admin);
        // -->
    }

    /**
     * 한국인 학생 로그인
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function login_std_kor(Request $request): JsonResponse
    {
        $header_token = $request->header('Authorization');

        // 헤더에 토큰이 없는 경우
        if (empty($header_token))
            return response()->json([
                'message' => self::_LOGIN_FAILURE,
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
                    'message' => self::_AUTH_FAILURE,
                ], 422);
            }

            // 회원가입을 하지 않은 경우
            else if (empty($std_kor_info)) {
                return response()->json([
                    'message' => self::_ACCESS_FAILURE,
                ], 202);
            }

            // 회원인 경우 로그인 성공과 함께 회원정보 전달
            else {
                return response()->json([
                    'message' => $std_kor_info['std_kor_name'].self::_LOGIN_SUCCESS,
                    'data' => $std_kor_info
                ], 200);
            }

        } catch (Exception $e) {
            // 토큰이 만료 된 경우
            return response()->json([
                'message' => self::_LOGIN_FAILURE,
            ], 422);
        }
    }

    /**
     * 외국인 유학생 로그인
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function login_std_for(Request $request): JsonResponse
    {
        $rules = [
            'std_for_id' => 'required|string',
            'password' => 'required|string|min:8',
            'provider' => 'required|string|in:foreigners'
        ];

        $validated_result = self::request_validator(
            $request,
            $rules,
            self::_LOGIN_FAILURE
        );

        if (is_object($validated_result)) {
            return $validated_result;
        }

        // <<-- 로그인 실패 시
        if (empty($foreigner = $this->login_authenticator($request, 'std_for_id'))) {
            return
                self::response_json(self::_LOGIN_ERROR, 401);
        }
        // -->>

        $token = $foreigner['token'];

        // <<-- 초기 비밀번호로 로그인 시
        if (empty($token)) {
            return
                self::response_json(self::_PASSWORD_CHANGE_REQUIRE, 202);
        }
        // -->>

        // <<-- 로그인 성공 시
        $message_template = $foreigner['info']['std_for_name'] . self::_LOGIN_SUCCESS;

        return
            self::response_json($message_template, 200, (object)$foreigner);
        // -->>
    }

    /**
     * 관리자, 유학생 로그아웃
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function logout(Request $request): JsonResponse
    {
        $request->user($request->input('guard'))->token()->revoke();

        return
            self::response_json(self::_LOGOUT_SUCCESS, 200);
    }

    public function request_user_data(Request $request)
    {
        $user_data = $request->user($request->input('guard'));

        return
            self::response_json("", 200, $user_data);
    }
}
