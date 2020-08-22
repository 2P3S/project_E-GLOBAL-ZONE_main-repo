<?php

namespace App\Http\Middleware;

use App\Http\Controllers\Controller;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthenticateMulti
{
    private const _LOGIN_FAILURE = "로그인에실패하였습니다.";
    private const _ACCESS_ERROR = "잘못된 접근입니다.";

    /**
     * Handle an incoming request.
     *
     * @param Request $request
     * @param Closure $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {
        $rules = [
            'guard' => 'required|string|in:admin,foreigner',
        ];

        $validated_result = Controller::request_validator(
            $request, $rules, self::_LOGIN_FAILURE
        );

        if (is_object($validated_result)) {
            return $validated_result;
        }

        $is_guard_checked = Auth::guard($request->input('guard'))->check();

        if (!$is_guard_checked) {
            return
                Controller::response_json(self::_ACCESS_ERROR, 401);
        }

        return $next($request);
    }
}
