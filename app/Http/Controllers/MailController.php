<?php

namespace App\Http\Controllers;

use App\Admin;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;

class MailController extends Controller
{
    private const _MAIL_SEND_SUCCESS = "비밀번호 초기화 메일을 전송하였습니다.";
    private const _MAIL_SEND_FAILURE = "비밀번호 초기화 메일 전송을 실패하였습니다.";
    private const _EFFECTIVE_TIME = 3;

    private const _ADMIN_NAME = "E Global Zone 관리자";

    /**
     * @return JsonResponse
     */
    public function request_reset(): JsonResponse
    {
        $effective_time = self::_EFFECTIVE_TIME;
        $admin = Admin::where('id', 1);
        $data = [
            "reset_request_time" => date("Y-m-d H:i:s"),
            "reset_expire_time" => date("Y-m-d H:i:s", strtotime("+{$effective_time} minutes")),
            "effective_time" => $effective_time
        ];

        $admin->update([
            'reset_expire_time' => $data['reset_expire_time']
        ]);

        try {
            Mail::send('emails.reset', $data, function ($message) {

                $mail_from_address = env('MAIL_FROM_ADDRESS');
                $mail_from_name = env('MAIL_FROM_NAME');
                $mail_to_address = env('MAIL_USERNAME');

                $message->from($mail_from_address, $mail_from_name);
                $message->to($mail_to_address)
                    ->subject("E Global Zone 관리자 비밀번호 초기화");
            });
        } catch (\Exception $e) {
            return self::response_json(self::_MAIL_SEND_FAILURE, 202);
        }

        return self::response_json(self::_MAIL_SEND_SUCCESS, 200);
    }
}
