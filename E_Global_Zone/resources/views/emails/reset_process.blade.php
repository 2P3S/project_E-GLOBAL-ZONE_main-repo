<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>E Global Zone 비밀번호 재설정</title>
    <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@100;300;400;500;700;900&display=swap"
          rel="stylesheet"/>
    <style>
        .passwd_reset {
            width: 100%;
            text-align: center;
            margin-top: 30px;
        }

        .passwd_reset .wrap {
            min-width: 400px;
            display: inline-block;
            border: 1px solid #ddd;
            border-radius: 10px;
            padding: 40px 60px 40px 50px;
            font-family: 'Noto Sans KR', sans-serif;
            text-align: left;
        }

        .passwd_reset .wrap p {
            padding: 0;
            margin: 0; /* 브라우저 여백 초기화 */
        }

        .passwd_reset .wrap p.tit {
            font-size: 17px;
            font-weight: 700;
            color: #000;
        }

        .passwd_reset .wrap p.txt {
            font-size: 13px;
            font-weight: 500;
            color: #525252;
        }

        .btn {
            margin-top: 25px;
        }

        .btn a {
            display: inline-block;
            padding: 15px 25px;
            background: #4CAF50;
            color: #fff;
            border-radius: 5px;
            text-decoration: none;
            font-size: 15px;
            font-weight: 600;
        }

        .btn a:hover {
            background: #3a993e;
            transition-duration: 0.3s;
        }
    </style>
</head>
<body>
<?php
$is_reset_availability = $is_reset_availability ?? false;
$message = $is_reset_availability ?
    [
        "title" => "비밀번호 재설정 완료",
        "comment" => "관리자님의 비밀번호가 성공적으로 재설정 되었습니다.",
        "btn" => "로그인 하기"
    ] :
    [
        "title" => "비밀번호 재설정 실패",
        "comment" => "요청이 만료되어, 비밀번호 재설정에 실패하였습니다.",
        "btn" => "돌아가기"
    ];
?>
<div class="passwd_reset">
    <div class="wrap">
        <p class="tit">{{ $message['title'] }}</p>
        <p class="txt">{{ $message['comment'] }}</p>
        <div class="btn">
            {{-- 관리자 페이지 URL 링크 추가하기 --}}
            <a href="#">{{ $message['btn'] }}</a>
        </div>
    </div>
</div>
</body>
</html>
