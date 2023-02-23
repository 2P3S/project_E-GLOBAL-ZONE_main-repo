<!doctype html>
<html lang="">
<head>
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">

    <style>
        html, body, div, span, object, iframe,
        p, blockquote, pre,
        a, abbr, address, big, cite, code,
        del, dfn, em, font, ins, q, s, samp,
        small, strike, strong, sub, sup, tt, var,
        b, u, i, h1, h2, h3, h4, h5, h6,
        dl, dt, dd, ol, ul, li,
        fieldset, form, label, legend,
        table, caption, tbody, tfoot, thead, tr, th, td {
            margin: 0;
            padding: 0;
            border: 0;
        }

        .head {
            clear: both;
            width: 100%;
            height: 80px;
            background: #373a44;
        }

        .head .head_area {
            overflow: hidden;
            width: 1200px;
            margin: 0 auto;
        }

        .head .head_area .logo {
            float: left;
            margin-top: 22px;
        }

        .wrapper {
            width: 100%;
            text-align: center;
            background: none;
        }

        .wrapper .content {
            position: relative;
            display: inline-block;
            width: 1200px;
            min-height: 700px;
            margin: 0 auto;
        }

        .wrapper .content .sub_title p.tit {
            float: none;
            line-height: 30px;
            font-size: 23px;
            color: #373a44;
            font-weight: 600;
            letter-spacing: -1px;
            margin-bottom: 30px;
        }

        .ch_passwd_wrap .input_area {
            width: 350px;
            padding: 160px 40px 40px 40px;
            margin: 50px auto;
            border: 1px solid #ddd;
            border-radius: 10px;
            font-size: 14px;
            background: url(https://user-images.githubusercontent.com/53788601/91645905-810e4480-ea84-11ea-98af-9e324428f799.gif) no-repeat center 45px;
        }

        .ch_passwd_wrap .input_area form input[type="password"],
        .ch_passwd_wrap .input_area button {
            height: 45px;
            border: 1px solid #cacaca;
            border-radius: 7px;
            padding: 0 10px;
            margin-bottom: 10px;
        }

        .ch_passwd_wrap .input_area form input[type="password"] {
            width: 93%;
        }

        .ch_passwd_wrap .input_area button {
            width: 100%;
        }

        .ch_passwd_wrap .input_area p.info {
            text-align: center;
            font-size: 13px;
            font-weight: 500;
            letter-spacing: -0.05em;
        }

        .ch_passwd_wrap .input_area p.info span {
            color: #2050e6;
            text-decoration: underline;
        }

        .ch_passwd_wrap .input_area button {
            color: #fff;
            background: #2050e6;
            border: none;
            padding: 0;
            border-radius: 7px;
            margin-top: 30px;
            font-weight: 600;
        }

        body {
            font-family: 'Noto Sans KR', sans-serif;
        }
    </style>
    <script>
        function go_main_page(message, target_uri) {
            alert(message);
            // TODO URL 수정필요
            location.href = target_uri;
        }
    </script>
    <title>E Global Zone 비밀번호 변경</title>
</head>
<body>
@inject('login_controller', 'App\Http\Controllers\LoginController')

<?php
//$expire_time = date("Y-m-d H:i:s", strtotime("+1 minutes"));
//$url = "/api/password/update?expire_time=" . "'{$expire_time}'";
$url = "http://localhost:8000/api/password/update";

$request_uri = explode("?", $_SERVER['REQUEST_URI'])[0];
?>

@if (isset($_POST['provider']))
    <?php
    $is_password_update_success = $login_controller
        ->update_password_url($_POST['provider'], $_POST['account'], $_POST['password'], $_POST['password_confirmation']);
    //        ->update_password_url($_POST, $_POST['expire_time']);

    $target_uri = $_POST['uri'];
    $result_message = $is_password_update_success ?
        '비밀번호 변경을 성공하였습니다.' :
        '비밀번호 변경을 실패하였습니다.';
    $append_message = '다시 로그인해주세요.';

    echo "&nbsp;";
    echo "
            <script>
                go_main_page(`{$result_message}\n{$append_message}`, '{$target_uri}')
            </script>";
    ?>

@elseif (
    isset($account, $provider, $name, $token) && (
        $request_uri === '/api/login/admin' ||
        $request_uri === '/api/login/foreigner'
    )
)
    <?php
    if (isset($account, $provider, $name, $token, $login_controller, $uri)) {
        $request = [
            'account' => $account,
            'provider' => $provider,
            'name' => $name,
            'token' => $token
        ];
        $ran_num = $login_controller->remeber_token($request);
    }
    ?>
    <div class="head">
        <div class="head_area">
            <div class="logo"><a href="#"><img
                        src="https://user-images.githubusercontent.com/53788601/91645904-7fdd1780-ea84-11ea-9981-c74192366471.gif"
                        alt="영진전문대학교 로고"></a></div>
        </div>
    </div>
    <div class="wrapper">
        <div class="content">
            <div class="ch_passwd_wrap">
                <div class="input_area">
                    <div class="sub_title">
                        <p class="tit">
                            {{ $name }} 님 안녕하세요<br>
                            비밀번호 변경 후 사용해주세요.
                        </p>
                    </div>
                    <form
                        action="{{ $url }}"
                        method="POST"
                    >

                        <input type="hidden" name="provider" value="{{$provider}}">
                        <input type="hidden" name="account" value="{{$account}}">
                        <input type="hidden" name="token" value="{{$token}}">
                        <input type="hidden" name="$ran_num" value="{{$ran_num}}">
                        {{--                        <input type="hidden" name="expire_time" value="{{$expire_time}}">--}}
                        <input type="password" name="password" placeholder="Password" required>
                        <input type="password" name="password_confirmation" placeholder="Password 확인"
                               required>
                        <input type="hidden" name="uri" value="<?=$uri?>">
                        <p class="info"><span>숫자, 문자, 특수문자</span> 조합으로 <span>8자 이상</span> 반드시 입력해 주십시오.</p>

                        <button type="submit">비밀번호 변경</button>
                    </form>
                </div>

            </div>
        </div>
    </div>
@else
    <?=
    "<script>go_main_page('잘못된 접근입니다.')</script>"
    ?>
@endif
</body>
</html>
