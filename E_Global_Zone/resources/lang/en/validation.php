<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Validation Language Lines
    |--------------------------------------------------------------------------
    |
    | The following language lines contain the default error messages used by
    | the validator class. Some of these rules have multiple versions such
    | as the size rules. Feel free to tweak each of these messages here.
    |
    */

    'accepted' => ':attribute을(를) 동의하지 않았습니다.',
    'active_url' => ':attribute 값이 유효한 URL이 아닙니다.',
    'after' => ':attribute 값이 :date 보다 이후 날짜가 아닙니다.',
    'after_or_equal' => ':attribute 은 :date 보다 빠르거나 같아야 합니다.',
    'alpha' => ':attribute 값에 문자 외의 값이 포함되어 있습니다.',
    'alpha_dash' => ':attribute 값에 문자, 숫자, 대쉬(-) 외의 값이 포함되어 있습니다.',
    'alpha_num' => ':attribute 값에 문자와 숫자 외의 값이 포함되어 있습니다.',
    'array' => ':attribute 값이 유효한 목록 형식이 아닙니다.',
    'before' => ':attribute 값이 :date 보다 이전 날짜가 아닙니다.',
    'before_or_equal' => ':attribute 은 :date 보다 늦거나 같아야 합니다.',
    'between' => [
        'numeric' => ':attribute 값이 :min ~ :max 값을 벗어납니다.',
        'file' => ':attribute 값이 :min ~ :max 킬로바이트를 벗어납니다.',
        'string' => ':attribute 값이 :min ~ :max 글자가 아닙니다.',
        'array' => ':attribute 값이 :min ~ :max 개를 벗어납니다.',
    ],
    'boolean' => ':attribute 값이 true 또는 false 가 아닙니다.',
    'confirmed' => ':attribute 와 :attribute 확인 값이 서로 다릅니다.',
    'date' => ':attribute 값이 유효한 날짜가 아닙니다.',
    'date_format' => ':attribute 값이 :format 형식과 일치하지 않습니다.',
    'different' => ':attribute 값이 :other은(는) 서로 다르지 않습니다.',
    'date_equals' => 'The :attribute must be a date equal to :date.',
    'digits' => 'The :attribute must be :digits digits.',
    'digits_between' => 'The :attribute must be between :min and :max digits.',
    'dimensions' => 'The :attribute has invalid image dimensions.',
    'distinct' => ':attribute 값에 중복된 항목이 있습니다.',
    'email' => ':attribute 값이 형식에 맞지 않습니다.',
    'ends_with' => 'The :attribute must end with one of the following: :values.',
    'exists' => ':attribute 값에 해당하는 리소스가 존재하지 않습니다.',
    'file' => 'The :attribute must be a file.',
    'filled' => ':attribute 값은 필수 항목입니다.',
    'gt' => [
        'numeric' => 'The :attribute must be greater than :value.',
        'file' => 'The :attribute must be greater than :value kilobytes.',
        'string' => 'The :attribute must be greater than :value characters.',
        'array' => 'The :attribute must have more than :value items.',
    ],
    'gte' => [
        'numeric' => 'The :attribute must be greater than or equal :value.',
        'file' => 'The :attribute must be greater than or equal :value kilobytes.',
        'string' => 'The :attribute must be greater than or equal :value characters.',
        'array' => 'The :attribute must have :value items or more.',
    ],
    'image' => ':attribute 값이 이미지가 아닙니다.',
    'in' => ':attribute 값이 유효하지 않습니다.',
    'in_array' => ':attribute 값이 :other 필드의 요소가 아닙니다.',
    'integer' => ':attribute 값이 정수가 아닙니다.',
    'ip' => ':attribute 값이 유효한 IP 주소가 아닙니다.',
    'ipv4' => 'The :attribute must be a valid IPv4 address.',
    'ipv6' => 'The :attribute must be a valid IPv6 address.',
    'json' => ':attribute 값이 유효한 JSON 문자열이 아닙니다.',
    'lt' => [
        'numeric' => 'The :attribute must be less than :value.',
        'file' => 'The :attribute must be less than :value kilobytes.',
        'string' => 'The :attribute must be less than :value characters.',
        'array' => 'The :attribute must have less than :value items.',
    ],
    'lte' => [
        'numeric' => 'The :attribute must be less than or equal :value.',
        'file' => 'The :attribute must be less than or equal :value kilobytes.',
        'string' => 'The :attribute must be less than or equal :value characters.',
        'array' => 'The :attribute must not have more than :value items.',
    ],
    'max' => [
        'numeric' => ':attribute 값이 :max 보다 큽니다.',
        'file' => ':attribute 값이 :max 킬로바이트보다 큽니다.',
        'string' => ':attribute 값이 :max 글자보다 많습니다.',
        'array' => ':attribute 값이 :max 개보다 많습니다.',
    ],
    'mimes' => ':attribute 값이 :values 와(과) 다른 형식입니다.',
    'mimetypes' => 'The :attribute must be a file of type: :values.',
    'min' => [
        'numeric' => ':attribute 값이 :min 보다 작습니다.',
        'file' => ':attribute 값이 :min 킬로바이트보다 작습니다.',
        'string' => ':attribute 값이 :min 글자 이상으로 작성하셔야합니다.',
        'array' => ':attribute 값이 :max 개보다 적습니다.',
    ],
    'phone_number' => ':value 는 휴대폰 형식이 아닙니다.',
    'g_suite_mail' => 'G - Suite 계정만 가입 가능합니다.',
    'kakao_id' => '영문과 숫자로 된 4~15자의 카카오톡 아이디만 가능합니다.',
    'not_regex' => 'The :attribute format is invalid.',
    'password' => 'The password is incorrect.',
    'not_in' => ':attribute 값이 유효하지 않습니다.',
    'numeric' => ':attribute 값이 숫자가 아닙니다.',
    'present' => ':attribute 필드가 누락되었습니다.',
    'regex' => ':attribute 값의 형식이 유효하지 않습니다.',
    'required' => ':attribute 항목은 필수 항목입니다.',
    'required_if' => ':attribute 값이 누락되었습니다 (:other 값이 :value 일 때는 필수).',
    'required_unless' => ':attribute 값이 누락되었습니다 (:other 값이 :value 이(가) 아닐 때는 필수).',
    'required_with' => ':attribute 값이 누락되었습니다 (:values 값이 있을 때는 필수).',
    'required_with_all' => ':attribute 값이 누락되었습니다 (:values 값이 있을 때는 필수).',
    'required_without' => ':attribute 값이 누락되었습니다 (:values 값이 없을 때는 필수).',
    'required_without_all' => ':attribute 값이 누락되었습니다 (:values 값이 없을 때는 필수).',
    'same' => ':attribute 값이 :other 와 서로 다릅니다.',
    'size' => [
        'numeric' => ':attribute 값이 :size 가 아닙니다.',
        'file' => ':attribute 값이 :size 킬로바이트가 아닙니다.',
        'string' => ':attribute 값이 :size 글자가 아닙니다.',
        'array' => ':attribute 값이 :max 개가 아닙니다.',
    ],
    'starts_with' => 'The :attribute must start with one of the following: :values.',
    'string' => ':attribute 값이 글자가 아닙니다.',
    'timezone' => 'The :attribute must be a valid zone.',
    'unique' => '이미 사용 중인 :attribute 값 입니다.',
    'uploaded' => 'The :attribute failed to upload.',
    'url' => 'The :attribute format is invalid.',
    'uuid' => 'The :attribute must be a valid UUID.',

    /*
    |--------------------------------------------------------------------------
    | Custom Validation Language Lines
    |--------------------------------------------------------------------------
    |
    | Here you may specify custom validation messages for attributes using the
    | convention "attribute.rule" to name the lines. This makes it quick to
    | specify a specific custom language line for a given attribute rule.
    |
    */

    'custom' => [
        'attribute-name' => [
            'rule-name' => 'custom-message',
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Custom Validation Attributes
    |--------------------------------------------------------------------------
    |
    | The following language lines are used to swap our attribute placeholder
    | with something more reader friendly such as "E-Mail Address" instead
    | of "email". This simply helps us make our message more expressive.
    |
    */

    'attributes' => [
        // <<-- 외국인 유학생
        'std_for_id' => '학번',
        'std_for_dept' => '학과',
        'std_for_name' => '이름',
        'std_for_lang' => '언어',
        'std_for_country' => '국가',
        'std_for_phone' => '휴대폰 번호',
        'std_for_mail' => '카카오톡 아이디',
        'std_for_zoom_id' => 'Zoom 아이디',
        // -->>
        // <<-- 한국인 학생
        'std_kor_id' => '학번',
        'std_kor_dept' => '학과',
        'std_kor_name' => '이름',
        'std_kor_phone' => '휴대폰 번호',
        'std_kor_mail' => '이메일',
        // -->>
        // <<-- 스케줄
        'sch_id' => '스케줄 아이디',
        'sch_sect' => '학과',
        'sch_std_for' => '외국인학생 학번',
        'sch_start_date' => '스케줄 시작 날짜',
        'sch_end_date' => '스케줄 종료 날짜',
        'sch_state_of_result_input' => '유학생 결과 입력 여부',
        'sch_state_of_permission' => '관리자 결과 승인 여부',
        'sch_for_zoom_pw' => '줌 비밀번호',
        // -->>
        // <<-- 학기
        'sect_start_date' => '학기 시작일',
        'sect_end_date' => '학기 종료일',
        // -->>
    ],

];
