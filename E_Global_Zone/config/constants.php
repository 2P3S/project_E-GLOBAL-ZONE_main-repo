<?php

return [
    'uri' => [
        'main' => 'http://global.yju.ac.kr',
        'admin' => 'http://global.yju.ac.kr/admin',
        'reset' => 'http://global.yju.ac.kr/api/reset',
    ],
    'kor' => [
        'dept' => [
            'index' => [
                'success' => '계열/학과 목록 조회에 성공하였습니다.',
                'failure' => '계열/학과 목록 조회에 실패하였습니다.',
                'no_value' => '등록된 계열/학과가 없습니다.'
            ],
            'store' => [
                'success' => '(을)를 계열/학과 목록에 추가하였습니다.',
                'failure' => '계열/학과 추가에 실패하였습니다.',
            ],
            'update' => [
                'success' => '(으)로 계열/학과 이름을 변경하였습니다.',
                'failure' => '계열/학과 이름 변경에 실패하였습니다.',
            ],
            'destroy' => [
                'success' => '(을)를 계열/학과 목록에서 삭제하였습니다.',
                'failure' => '계열/학과 삭제에 실패하였습니다.',
            ]
        ],
        'std_for' => [
            'store' => [
                'success' => '(을)를 유학생 목록에 추가하였습니다.',
                'failure' => '유학생 추가에 실패하였습니다.'
            ],
            'update' => [
                'success' => '유학생 정보 변경에 성공하였습니다.',
                'failure' => '유학생 정보 변경에 실패하였습니다.'
            ],
            'destroy' => [
                'success' => '(을)를 유학생 목록에서 삭제하였습니다.',
                'failure' => '유학생 삭제에 실패하였습니다.'
            ],
            'passwordinit' => [
                'success' => '비밀번호 초기화에 성공하였습니다.',
                'failure' => '비밀번호 변경에 실패하였습니다.'
            ],
            'favorite' => [
                'success' => '유학생 즐겨찾기 변경에 성공하였습니다.',
                'failure' => '유학생 즐겨찾기 변경에 실패하였습니다.'
            ]
        ],
        'std_for_contacts' => [
            'index' => [
                'success' => '선택한 유학생에 대한 연락처 정보 조회에 성공하였습니다.',
                'failure' => '유학생 연락처 정보 조회에 실패하였습니다.',
                'no_value' => '선택한 유학생에 대한 연락처 정보가 없습니다.'
            ]
        ],
        'work_std_for' => [
            'index' => [
                'success' => '의 근로유학생 목록 조회에 성공하였습니다.',
                'failure' => '근로유학생 목록 조회에 실패하였습니다.',
                'no_value' => '에 등록된 근로유학생이 없습니다.'
            ],
            'store' => [
                'success' => '의 근로유학생 목록 추가에 성공하였습니다.',
                'failure' => '근로유학생 목록 추가에 실패하였습니다.',
            ],
            'destroy' => [
                'success' => '의 근로유학생 목록에서 삭제되었습니다.',
                'failure' => '근로유학생 목록 삭제에 실패하였습니다.',
            ]
        ],
        'not_work_std_for' => [
            'index' => [
                'success' => '의 미등록 유학생 목록 조회에 성공하였습니다.',
                'failure' => '미등록 유학생 목록 조회에 실패하였습니다.',
            ]
        ],
        'std_kor' => [
            'index_approval' => [
                'success1' => '가입 승인 대기중인 한국인 학생은 ',
                'success2' => '명입니다.',
                'no_value' => '가입 승인 대기중인 한국인 학생이 없습니다.'
            ],
            'update_approval' => [
                'success' => '명의 한국인 학생이 가입 승인 되었습니다.',
                'failure' => '가입 승인에 실패하였습니다. 한국인 학생 다시 목록을 확인해주세요.'
            ],
            'store' => [
                'success' => '가입 신청에 성공하였습니다. 글로벌 존 관리자 승인 시 이용가능합니다.',
                'failure' => '가입 신청에 실패하였습니다. 글로벌 존 관리자에게 문의해주세요.'
            ],
            'destroy' => [
                'success' => '(을)를 한국인학생 목록에서 삭제하였습니다.',
                'failure' => '한국인학생 삭제에 실패하였습니다.'
            ],
            'passwordinit' => [
                'success' => '비밀번호 초기화에 성공하였습니다.',
                'failure' => '비밀번호 변경에 실패하였습니다.'
            ],
            'favorite' => [
                'success' => '유학생 즐겨찾기 변경에 성공하였습니다.',
                'failure' => '유학생 즐겨찾기 변경에 실패하였습니다.'
            ]
        ],

    ]

];
