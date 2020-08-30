<?php

namespace App\Http\Controllers;

use App\Admin;
use Illuminate\Contracts\Foundation\Application;
use Illuminate\Contracts\View\Factory;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\View\View;

class MailController extends Controller
{
    private const _MAIL_SEND_SUCCESS = "비밀번호 초기화 메일을 전송하였습니다.";
    private const _MAIL_SEND_FAILURE = "비밀번호 초기화 메일 전송을 실패하였습니다.";
    private const _EFFECTIVE_TIME = 1;
    private const _DATETIME_FORMAT = "Y-m-d H:i:s";
    private const _ADMIN_INIT_PASSWORD = "oicyju5630!";
    private const _REQUEST_URL = "http://www.94soon.net/api/reset";


    /**
     * 관리자 비밀번호 이메일 초기화 요청
     *
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

                $mail_from_address = Config::get('mail.from.address');
                $mail_from_name = Config::get('mail.from.name');
                $mail_to_address = Config::get('mail.username');

                $message->from($mail_from_address, $mail_from_name);
                $message->to($mail_to_address)
                    ->subject("E Global Zone 관리자 비밀번호 초기화");
            });
        } catch (\Exception $e) {
            return self::response_json(self::_MAIL_SEND_FAILURE, 202);
        }

        return self::response_json(self::_MAIL_SEND_SUCCESS, 200);
    }

    /**
     * * 관리자 비밀번호 이메일 초기화 실행
     *
     * @return Application|Factory|View
     */
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
