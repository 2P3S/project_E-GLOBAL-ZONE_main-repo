<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

/*
 * TODO
 * 작성일 : 2020-08-08
 * 작성자 : 정재순
 * 내용 : Laravel Passport Multi-Auth
 * 세부내용
 *   - Middleware AuthenticateMulti 정의
 */

class AuthenticateMulti
{
    private const ACCESS_ERROR = '잘못된 접근입니다.';

    /**
     * Handle an incoming request.
     *
     * @param Request $request
     * @param Closure $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {
        $validator = Validator::make($request->all(), [
            'guard' => 'required|string|in:admin,foreigner',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => $validator->errors()
            ], 422);
        }

        if (!Auth::guard($request['guard'])->check()) {
            return response()->json([
                'message' => self::ACCESS_ERROR
            ], 401);
        }

        return $next($request);
    }
}
