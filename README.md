# 영진전문대학교 글로벌 존 온라인 예약 시스템
### YJU E-global-zone

<p align="center">
    <a href="https://www.yju.ac.kr/" target="_blank">
        <img src="https://www.yju.ac.kr/sites/kr/masterSkin/kr_JW_MS_K2WT003_M/images/logo/m_h-logo.png" width="400">
    </a>
</p>

<div>
    <address>대표전화 053-940-5114<span>41527 대구광역시 북구 복현로 35 (복현2동 218) 영진전문대학교</span></address>
    <p>COPYRIGHT© <strong>YEUNGJIN UNIVERSITY</strong>. <span>All RIGHTS RESERVED.</span></p>
</div>

## 목차

[1. 사용자 요구 분석](#사용자-요구-분석)

[2. 스토리 보드 구상](#스토리-보드-구상)

[3. Sequence Diagram 작성](#Sequence-Diagram-작성)

[4. DataBase, System architecture 설계](#DataBase-및-System-architecture-설계)

[5. API 설계 및 Component 구성](#API-설계-및-Component-구성)

[6. 개발 기간](#개발-기간)

[7. 2차 테스트 진행](#2차-테스트-진행)

[8. 버그 수정 및 검수](#버그-수정-및-검수)

[9. 실 서버 배포 및 베타 오픈(예정)](#실-서버-배포-및-베타-오픈)

## 사용자 요구 분석
진행 일시 : 2020-07-07

#### 전체 기능 요약

1. 글로벌 존 이용 예약 관리
2. 글로벌 존 이용 후 통계 및 증빙 자료 자동화 출력

#### 사용자 구분

- 관리자(국제 교류원)
- 한국인 학생
- 유학생

#### 기능 구분

- 글로벌 존 근무 스케줄
    - 스케줄 입력
    - 스케줄 수정
    - 스케줄 삭제
    - 스케줄 조회
- 글로벌 존 예약
    - 예약 신청
    - 예약 취소
    - 예약 조회
    - 예약 승인
- 글로벌 존 관리대장
    - 예약 세션 별 진행결과 기록
        - 진행결과 입력
        - 진행결과 수정
        - 진행결과 조회
        - 진행결과 승인
    - 전체 이용 통계 조회
        - 유학생 기준
        - 한국인 학생 기준
- 유학생 정보
    - 조회, 관리
    - 삽입
    - 삭제
    - 수정
- 시스템 환경 설정

#### 사용자별 기능 구분

- `관리자` 는 글로벌 존 근무 스케줄을 `입력`, `수정`, `삭제`, `조회`
- `유학생` 은 글로벌 존 근무 스케쥴을 `조회`
- `한국인 학생` 은 글로벌 존 근무 스케쥴을 `조회`

- `관리자` 는 글로벌 존 예약을 `신청`, `취소`, `조회`, `승인`
- `유학생` 은 글로벌 존 예약을 `승인`
- `한국인 학생` 는 글로벌 존 예약을 `신청`, `취소`, `조회`

- `관리자` 는 진행결과를 `조회`, `수정`, `승인`
- `유학생` 은 진행결과를 `조회`, `수정`
- `한국인 학생` 은 진행결과를 `조회`

- `관리자` 는 진행결과를 전체 이용 통계를 `유학생` 및 `한국인 학생` 기준으로 `조회`
- `관리자` 는 유학생 정보를 `조회`, `삽입`, `삭제`, `수정`
- `관리자` 는 시스템 환경을 `설정`

#### 기타사항

- 유학생, 관리자 페이지는 굳이 모바일 페이지는 불필요
- 한국인 학생 → 모바일 페이지 중점
- 유학생도 모바일 페이지 포함되면 좋음
- key 값은 학번으로 사용
- 유학생 1명당 10~16시간 정도 근무
    - 1회에 20분씩 2타임을 구성
    - 참석 인원 수를 제한
    - 환경설정 기능
    
    
## 스토리 보드 구상
진행 일시 : 2020-07-08 ~ 07-29
 
- [예약 및 스케줄 관리](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/fd2e4017-2bfb-4d1b-b916-a4877fc9cb0a/__2.pdf?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAT73L2G45O3KS52Y5%2F20200729%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20200729T180311Z&X-Amz-Expires=86400&X-Amz-Signature=da5d2b7c100b6ba5a4311a03b6f78c3a419478d3e12c51d4590de3387b54a00d&X-Amz-SignedHeaders=host&response-content-disposition=filename%20%3D%22%25E1%2584%2580%25E1%2585%25B3%25E1%2586%25AF%25E1%2584%2585%25E1%2585%25A9%25E1%2584%2587%25E1%2585%25A5%25E1%2586%25AF%25E1%2584%258C%25E1%2585%25A9%25E1%2586%25AB%25E1%2584%258B%25E1%2585%25A8%25E1%2584%258B%25E1%2585%25A3%25E1%2586%25A8_%25E1%2584%2589%25E1%2585%25B3%25E1%2584%2590%25E1%2585%25A9%25E1%2584%2585%25E1%2585%25B5%25E1%2584%2587%25E1%2585%25A9%25E1%2584%2583%25E1%2585%25B3_2%25E1%2584%258E%25E1%2585%25A1.pdf%22)
- [유학생 및 한국인 학생 관리](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/4649b4bd-8292-4b21-b3c1-c45cd06027bf/_____%282020-07-17%29.pdf?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAT73L2G45O3KS52Y5%2F20200729%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20200729T180122Z&X-Amz-Expires=86400&X-Amz-Signature=92a2ad8cf65f4e80ef99fad1cd16ffa2db34648371ac0448e26a1c99ef568f4b&X-Amz-SignedHeaders=host&response-content-disposition=filename%20%3D%22%25E1%2584%258B%25E1%2585%25B2%25E1%2584%2592%25E1%2585%25A1%25E1%2586%25A8%25E1%2584%2589%25E1%2585%25A2%25E1%2586%25BC%252C%2520%25E1%2584%2592%25E1%2585%25A1%25E1%2586%25AB%25E1%2584%2580%25E1%2585%25AE%25E1%2586%25A8%25E1%2584%258B%25E1%2585%25B5%25E1%2586%25AB%2520%25E1%2584%2592%25E1%2585%25A1%25E1%2586%25A8%25E1%2584%2589%25E1%2585%25A2%25E1%2586%25BC%2520%25E1%2584%2580%25E1%2585%25AA%25E1%2586%25AB%25E1%2584%2585%25E1%2585%25B5%2520%25E1%2584%2589%25E1%2585%25B3%25E1%2584%2590%25E1%2585%25A9%25E1%2584%2585%25E1%2585%25B5%2520%25E1%2584%2587%25E1%2585%25A9%25E1%2584%2583%25E1%2585%25B3%282020-07-17%29.pdf%22)
- 환경 설정 (진행중)

## Sequence Diagram 작성
진행 일시 : 2020-07-29 ~ 07-30

![sequence_diagram](https://user-images.githubusercontent.com/53788601/89094935-efb79e00-d403-11ea-8645-3499fbf35fe9.png)


## DataBase 및 System architecture 설계
진행 일시 : 2020-07-30 ~ 08-09

#### DataBase 설계
    - 모의 DB `.csv` 생성
    - DB 세부 구조 수정
    - Laravel Migrations, Model 정의
    - Entity-Relation Diagram (ERD)
![e-global-zone_DB-ERD 001](https://user-images.githubusercontent.com/53788601/89729135-b7e8d000-da6d-11ea-9ca2-6a353e9adc35.jpeg)

#### System architecture
![E_Global_Zone Setting Manual 001](https://user-images.githubusercontent.com/53788601/92883908-4f19bc80-f44c-11ea-9e75-5e198c34f221.jpeg)


## API 설계 및 Component 구성
진행 일시 : 2020-07-30 ~ 08-11

1. 관리자 로그인 API
2. 시스템 환경설정 API
3. 관리자 스케줄 API
4. 유학생 관리 API
5. 한국인 학생 관리 API
6. 유학생 로그인 API
7. 유학생 홈페이지 API
8. 한국인 학생 로그인 API
9. 한국인 학생 홈페이지 API

## 개발 기간
진행 일시 : 2020-08-11 ~ 09-01

#### E Global Zone 서비스 구현
    - 한국인 학생 예약 신청
    - 외국인 유학생 스케줄 관리 및 결과 입력 
    - 관리자 시스템 관리 기능 구현
    
#### 테스트 서버 배포 및 1차 테스트 진행
    - AWS EC2 서버 배포
    - 주요 기능 모듈 단위 테스트 및 알고리즘 보완

## 2차 테스트 진행
진행 일시 : 2020-09-02 ~ 09-04

#### 테스트 내용
- 테스트 참가자
    - 관리자 : [정재순](https://github.com/JeongJaeSoon)
    - 한국인 학생 : [조승현](https://github.com/kokomade98), [박중규](https://github.com/JoongQ96), [김창한](https://github.com/KCH97), 권소현, 정경숙, 신동협
    - 유학생 : [조미향](https://github.com/ChoMihyang), [김범수](https://github.com/KBS10), 이승형, 박시연, 김희수, [이재원](https://github.com/LeeJaeBae), [이구슬](https://github.com/LeeGuSeul)
- 한국인 학생, 외국인 유학생 역할 분담
- E Global Zone 서비스 모의 운영 
- UI / UX 사용성 테스트

#### 테스트 결과 및 피드백 목록 작성

<table>
    <tr>
        </td>
        <td align="center">
            <img src="https://user-images.githubusercontent.com/53788601/92882535-f990e000-f44a-11ea-9314-64d9897b15d5.png" width="200px">
        </td>
        <td align="center">
            <img src="https://user-images.githubusercontent.com/53788601/92882232-adde3680-f44a-11ea-868f-e17ac6e245f1.png" width="200px">
        </td>    
        <td align="center">
            <img src="https://user-images.githubusercontent.com/53788601/92882213-a9b21900-f44a-11ea-81cd-40cea916a330.png" width="200px">
        </td>    
    </tr>
</table>


## 버그 수정 및 검수
진행 일시 : 2020-09-04 ~ 09-11

## 실 서버 배포 및 베타 오픈
진행 일시 : 2020-09-14(예정)

## developers
<table>
    <tr>
        <td align="center">
            <a href="https://github.com/JeongJaeSoon">
                <img src="https://avatars3.githubusercontent.com/u/53788601?s=400&u=88b3d54002a7892a752cea82bb58f707ae6378f0&v=4" width="100px;" alt=""/><br />
                <sub><b>JaeSoon Jeong</b></sub>
            </a>
        </td>
        <td align="center">
            <a href="https://github.com/LeeGuSeul"><img src="https://avatars0.githubusercontent.com/u/68966131?s=400&u=420c0b5210b1659363262a397faeeec241ee51a8&v=4" width="100px;" alt=""/><br />
                <sub><b>GuSeul Lee</b></sub>
            </a>
        </td>
        <td align="center">
            <a href="https://github.com/LeeJaeBae"><img src="https://avatars0.githubusercontent.com/u/46444748?s=400&u=10bedd6279c226d3c0a5d12f46bad2038980f804&v=4" width="100px;" alt=""/><br />
                <sub><b>JaeWon Lee</b></sub>
            </a>
        </td>
        <td align="center">
            <a href="https://github.com/kokomade98"><img src="https://avatars1.githubusercontent.com/u/52916934?s=400&u=98dc80246851616122330b0f96146e6c8f562454&v=4" width="100px;" alt=""/><br />
                <sub><b>SeungHyun Cho</b></sub>
            </a>
        </td>    
    </tr>
</table>
