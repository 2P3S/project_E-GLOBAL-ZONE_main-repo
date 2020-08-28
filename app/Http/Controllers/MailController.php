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
    private const _EFFECTIVE_TIME = 1;
    private const _DATETIME_FORMAT = "Y-m-d H:i:s";
    private const _ADMIN_INIT_PASSWORD = "oicyju5630!";
    private const _REQUEST_URL = "http://www.94soon.net/api/reset";


    /**
     * @return JsonResponse
     */
    public function request_reset(): JsonResponse
    {
        $effective_time = self::_EFFECTIVE_TIME;
        $admin = Admin::where('id', 1);
        $data = [
            "reset_request_time" => date(self::_DATETIME_FORMAT),
            "reset_expire_time" => date(self::_DATETIME_FORMAT, strtotime("+{$effective_time} minutes")),
            "effective_time" => $effective_time,
            "request_url" => self::_REQUEST_URL
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

    public function run_reset()
    {
        $admin = Admin::where('id', 1);

        $reset_expire_time = $admin->first()['reset_expire_time'];
        $current_time = date(self::_DATETIME_FORMAT);

        $is_reset_availability = $reset_expire_time >= $current_time;
        if ($is_reset_availability) {
            $admin->update([
                "password" => Hash::make(self::_ADMIN_INIT_PASSWORD)
            ]);
        }

        return view(
            'emails.reset_process',
            ['is_reset_availability' => $is_reset_availability]
        );
    }
}
