<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Config;
use Socialite;
use App\Student_korean;
use App\Admin;
use App\Model\Authenticator;
use App\Student_foreigner;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class LoginController extends Controller
{
    private const _LOGIN_FAILURE = "로그인에 실패하였습니다.";
    private const _AUTH_FAILURE = "G-Suite 계정이 아닙니다.";
    private const _ACCESS_FAILURE = "회원 가입 후 이용 가능합니다.";
    private const _AUTH_NO_PERMISSION = "관리자 승인 후 서비스 이용이 가능합니다.";
    private const _AUTH_HAS_RESTRICT = "이용제한 학생으로 사용할 수 없습니다.";

    private const _LOGIN_ERROR = "아이디 또는 비밀번호를 다시 확인하세요.";
    private const _LOGIN_SUCCESS = " 님 로그인 됐습니다. 어서오세요";
    private const _LOGOUT_SUCCESS = "로그아웃되었습니다.";
    private const _PASSWORD_CHANGE_REQUIRE = "초기 비밀번호로 로그인하였습니다. 비밀번호 변경 후, 재접속 해주세요.";

    /**
     * @var Authenticator
     */
    private $authenticator;
    private $initial_password;

    public function __construct(Authenticator $authenticator)
    {
        $this->authenticator = $authenticator;
        $this->initial_password = [
            'admins' => Config::get('constants.initial_password.admin'),
            'foreigners' => Config::get('constants.initial_password.foreigner'),
        ];
    }

    /**
     * 로그인 시, 사용자 정보 인증
     *
     * @param Request $request
     * @param string $key
     * @return object|null
     */
    private function login_authenticator(
        Request $request,
        string $key
    ): ?array
    {
        $credentials = array_values($request->only($key, 'password', 'provider'));
        $credentials[] = $key;

        if (!$user = $this->authenticator->attempt(...$credentials)) {
            return null;
        }

        $token = '';
        $is_login_init_password = $this->initial_password[$credentials[2]] === $credentials[1];
        $token = $user->createToken(ucfirst($credentials[2]) . ' Token')->accessToken;

        return [
            'flag' => $is_login_init_password,
            'info' => $user,
            'token' => $token,
        ];
    }

    /**
     * 관리자 로그인
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function login_admin(Request $request): object
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

        $provider = $request->input('provider');
        $uri = "";
        if ($provider === 'admins') {
            $uri = Config::get('constants.uri.admin');
        } else {
            $uri = Config::get('constants.uri.main');
        }

        // <<-- 초기 비밀번호 로그인 시
        if ($admin['flag']) {
            $data = [
                'provider' => $provider,
                'account' => $admin['info']['account'],
                'name' => $admin['info']['name'],
                'token' => $admin['token'],
                'uri' => $uri
            ];
            return view('password_update', $data);
        }
        // -->>

        // <<-- 로그인 성공 시
        $message_template = $admin['info']['name'] . self::_LOGIN_SUCCESS;

        return
            self::response_json($message_template, 200, (object)$admin);
        // -->>
    }

    /**
     * 한국인 학생 로그인
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function login_std_kor(Request $request): JsonResponse
    {
        try {
            $header_token = $request->header('Authorization');

            $std_kor_user = Socialite::driver('google')->userFromToken($header_token);

            // 헤더에 토큰이 없는 경우
            if (empty($header_token) || empty($std_kor_user))
                return response()->json([
                    'message' => self::_LOGIN_FAILURE,
                ], 422);

            $check_email = explode('@', $std_kor_user['email'])[1];
            $is_not_g_suite_mail = strcmp($check_email, 'g.yju.ac.kr');

            // E_Global_Zone 회원 확인
            $std_kor_info = Student_korean::where('std_kor_mail', '=', $std_kor_user['email'])->get()->first();

            // 지슈트 메일이 아닌 경우
            if ($is_not_g_suite_mail) {
                return response()->json([
                    'message' => self::_AUTH_FAILURE,
                ], 422);
            } // 회원가입을 하지 않은 경우
            else if (empty($std_kor_info)) {
                return response()->json([
                    'message' => self::_ACCESS_FAILURE,
                ], 202);
            }

            $is_kor_state_of_permission = $std_kor_info['std_kor_state_of_permission'];
            $is_kor_state_of_restricted = $std_kor_info['std_kor_state_of_restriction'];

            // 관리자 승인을 받지 않은 경우
            if (!$is_kor_state_of_permission) {
                return response()->json([
                    'message' => self::_AUTH_NO_PERMISSION,
                ], 203);
            } // 이용 제한 학생인 경우
            else if ($is_kor_state_of_restricted) {
                return response()->json([
                    'message' => self::_AUTH_HAS_RESTRICT,
                ], 203);
            } // 회원인 경우 로그인 성공과 함께 회원정보 전달
            else {
                return response()->json([
                    'message' => $std_kor_info['std_kor_name'] . self::_LOGIN_SUCCESS,
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
    public function login_std_for(Request $request): object
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

        $provider = $request->input('provider');
        $uri = Config::get('constants.uri.main');

        // <<-- 초기 비밀번호로 로그인 시
        if ($foreigner['flag']) {
            $data = [
                'provider' => $request->input('provider'),
                'account' => $foreigner['info']['std_for_id'],
                'name' => $foreigner['info']['std_for_name'],
                'token' => $foreigner['token'],
                'uri' => $uri
            ];
            return view('password_update', $data);
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
        $this->request_user_data($request, false)->token()->revoke();

        return
            self::response_json(self::_LOGOUT_SUCCESS, 200);
    }

    public function request_user_data(
        Request $request,
        bool $is_response_json = true
    )
    {
        $user_data = $request->user($request->input('guard'));

        if (!$is_response_json) {
            return $user_data;
        }

        return
            self::response_json("", 200, $user_data);
    }

    public function remeber_token(
        array $request
    )
    {
        $provider = $request['provider'];
        $users = [
            'admins' => new Admin(),
            'foreigners' => new Student_foreigner()
        ];

        return $users[$provider]->set_user_info($request);
    }

    public function update_password_url(
        array $request,
        string $expire_time
    )
    {
        $is_possible_password = $this->validate_password($request, $expire_time);

        $provider = $request['provider'];
        $password = trim($request['password']);

        if ($is_possible_password) {
            $users = [
                'admins' => new Admin(),
                'foreigners' => new Student_foreigner()
            ];

            $user = $users[$provider]->get_user_info($request);
            $is_no_users = !$user->count();

            if ($is_no_users) {
                return false;
            }

            return $users[$provider]->update_user_info($user, Hash::make($password));
        }

        return false;
    }

    private function validate_password(
        array $request,
        string $expire_time
    ): bool
    {

        $provider = $request['provider'];
        $password = trim($request['password']);
        $password_confirmation = trim($request['password_confirmation']);

        $is_possible_provider = $provider === 'admins' || $provider === 'foreigners';
        $is_initial_password =
            $this->initial_password[$provider] === $password ||
            $this->initial_password[$provider] === $password_confirmation;
        $is_password_confirm = $password === $password_confirmation;

        $pattern = "/^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{8,}$/";
//        $pattern = "/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/";
        $is_possible_password = preg_match($pattern, $password);

        return
            $is_password_confirm &&
            $is_possible_provider &&
            !$is_initial_password &&
            $is_possible_password &&
            $expire_time < date("Y-m-d H:i:s");
    }
}
