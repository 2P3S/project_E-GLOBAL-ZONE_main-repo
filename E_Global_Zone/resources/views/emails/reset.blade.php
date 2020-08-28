<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>E Global Zone 비밀번호 재설정 요청</title>
    <style>
        .header {
            text-align: center;
        }

        .section {
            height: 30vh;
        }

        .text {
            width: 90%;
            margin: 2% auto;
            border: 1px solid black;
            border-radius: 10px;
            padding: 1%;
            size: 1.3vw;
        }

        .btn {
            padding: 0 30%;
        }

        .btn a {
            display: inline-block;
            background-color: #4CAF50;
            border-radius: 10px;
            border: none;
            color: #FFFFFF;
            padding: 15px 5px;
            width: 30vw;
            text-align: center;
            text-decoration: none;
            font-size: 16px;
        }

    </style>
</head>
<body>
<div class="header">
    <h1>E Global Zone<br>관리자 비밀번호 초기화</h1>
</div>
<div class="section">
    <div class="text">
        안녕하세요!!! E Global Zone 관리자님<br>
        비밀먼호 초기화를 원하시면 아래 버튼을 클릭해주세요.<br>
        아래 버튼의 링크는 {{ $effective_time }}분간 유효합니다.<br>
        <br>
        요청 일시 : {{ $reset_request_time }}
        <br>
        만료 일시 : {{ $reset_expire_time }}
    </div>
    <div class="btn">
        <a href="{{ $request_url }}">
            비밀번호 초기화
        </a>
    </div>
</div>

</body>
</html>
