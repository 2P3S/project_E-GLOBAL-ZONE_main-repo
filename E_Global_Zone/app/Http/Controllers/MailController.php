<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Mail;

class MailController extends Controller
{
    private const _MAIL_SEND_SUCCESS = "메일 전송에 성공하였습니다.";
    private const _MAIL_SEND_FAILURE = "메일 전송에 실패하였습니다.";

    /**
     *
     */
    public function send(Request $request): JsonResponse
    {

        $rules = [
            'email' => 'required|email',
            'name' => 'required|string'
        ];
        $validated_result = self::request_validator($request, $rules, self::_MAIL_SEND_FAILURE);

        if (is_object($validated_result)) {
            return $validated_result;
        }

        $user = array(
            'email' => $request->input('email'),
            'name' => $request->input('name')
        );
        $data = array(
            'detail' => 'E Global Zone Email 입니다.',
            'name' => $user['name']
        );

        Mail::send('emails.welcome', $data, function ($message) use ($user) {

            $mail_from_address = env('MAIL_FROM_ADDRESS');
            $mail_from_name = env('MAIL_FROM_NAME');

            $message->from($mail_from_address, $mail_from_name);
            $message->to($user['email'], $user['name'])->subject('Welcome!');
        });

        return self::response_json(self::_MAIL_SEND_SUCCESS, 200);
    }
}
