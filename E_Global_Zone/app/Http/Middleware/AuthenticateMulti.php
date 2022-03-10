<?php

namespace App\Http\Middleware;

use App\Http\Controllers\Controller;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Config;

class AuthenticateMulti
{
    /**
     * Handle an incoming request.
     *
     * @param Request $request
     * @param Closure $next
     * @return mixed
     */
    public function handle(Request $request, Closure $next)
    {
        $rules = [
            'guard' => 'required|string|in:admin,foreigner',
        ];

        $err_msg = Config::get('constants.kor.login.log_in.failure');
        $validated_result = Controller::request_validator(
            $request, $rules, $err_msg
        );

        if (is_object($validated_result)) {
            return $validated_result;
        }

        $is_guard_checked = Auth::guard($request->input('guard'))->check();

        $err_msg = Config::get('constants.kor.login.log_in.illegal');
        if (!$is_guard_checked) {
            return
                Controller::response_json($err_msg, 401);
        }

        return $next($request);
    }
}
