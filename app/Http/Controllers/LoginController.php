<?php

namespace App\Http\Controllers;

use App\Model\Authenticator;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

/*
 * TODO
 * 작성일 : 2020-08-08
 * 작성자 : 정재순
 * 내용 : Laravel Passport Multi-Auth 적용
 * 세부내용
 *   - adminLogin
 *      - Request : adminLogin(account, password, provider)
 *      - Response : message,
 */

class LoginController extends Controller
{
    /**
     * @var Authenticator
     */
    private $authenticator;

    public function __construct(Authenticator $authenticator)
    {
        $this->authenticator = $authenticator;
    }

    // 관리자 로그인
    public function adminLogin(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'account' => 'required|string',
            'password' => 'required|string|min:8',
            'provider' => 'required|string|in:admins',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => $validator->errors()
            ], 422);
        }

        $credentials = array_values($request->only('account', 'password', 'provider'));

        if (!$admin = $this->authenticator->attempt(...$credentials)) {
            return response()->json([
                'message' => '아이디 또는 비밀번호를 다시 확인하세요.'
            ]);
        }

        $token = $admin->createToken(ucfirst($credentials[2]) . ' Token')->accessToken;

        return response()->json([
            'message' => $admin['name'] . ' 님 로그인 되셨습니다. 어서오세요',
            'admin' => $admin,
            'access_token' => $token
        ]);
    }

    // 외국인 유학생 로그인
    public function foreignerLogin(Request $request)
    {
        dd("외국인 유학생 로그인 입니다.");
    }

}
