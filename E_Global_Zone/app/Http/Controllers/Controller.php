<?php

namespace App\Http\Controllers;

use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Bus\DispatchesJobs;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller as BaseController;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Validator;

class Controller extends BaseController
{
    use AuthorizesRequests, DispatchesJobs, ValidatesRequests;

    public static function response_json(
        string $message,
        int $http_response_code = 202,
        object $data = null
    ): JsonResponse {
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

    public static function response_json_error(
        string $message
    ): JsonResponse {
        return self::response_json($message);
    }

    public static function request_validator(
        Request $request,
        array $rules,
        string $error_msg
    ) {
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
                'message' => Config::get('constants.kor.access.admin')
            ], 422);
        }

        return true;
    }

    public static function get_http_accept_language(Request $request): String
    {
        $language_arr = array("kor", "eng", "jp");

        $language = 'kor';

        if (!empty($request->server('HTTP_ACCEPT_LANGUAGE')) && in_array($request->server('HTTP_ACCEPT_LANGUAGE'), $language_arr) ) {
            $language = $request->server('HTTP_ACCEPT_LANGUAGE');
        }

        return $language;
    }

    public static function custom_msg($language, $config_msg)
    {
        return Config::get("constants.{$language}.{$config_msg}");
    }
}
