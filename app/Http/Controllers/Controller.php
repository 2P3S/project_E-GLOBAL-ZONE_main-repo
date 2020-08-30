<?php

namespace App\Http\Controllers;

use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Bus\DispatchesJobs;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller as BaseController;
use Illuminate\Support\Facades\Validator;

class Controller extends BaseController
{
    use AuthorizesRequests, DispatchesJobs, ValidatesRequests;

    public static function response_json(
        string $message,
        int $http_response_code,
        object $data = null
    )
    {
        $is_no_data = !(bool)$data;

        if ($is_no_data) {
            return response()->json([
                'message' => $message
            ], $http_response_code);
        }

        return response()->json([
            'message' => $message,
            'data' => $data
        ], $http_response_code);
    }

    public static function request_validator(
        Request $request,
        array $rules,
        string $error_msg
    )
    {
        $validator = Validator::make($request->all(), $rules);

        if ($validator->fails()) {
            return response()->json([
                'message' => $error_msg,
                'error' => $validator->errors(),
            ], 422);
        }

        return true;
    }

    public static function is_admin(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'guard' => 'required|string|in:admin'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => "관리자만 접근 할 수 있습니다.",
            ], 422);
        }

        return true;
    }
}
