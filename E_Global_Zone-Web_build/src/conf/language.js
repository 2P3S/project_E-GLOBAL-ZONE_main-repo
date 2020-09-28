const language = {
	korean: {
		login: {
			header: { btnKor: "한국인 학생", btnFor: "유학생" },
			body: {
				subTitle: "글로벌존 예약시스템에 오신 것을 환영합니다.",
				korLogin: {
					loginBtn: "G-suite 계정으로 로그인하기",
					nofication: "@g.yju.ac.kr로 끝나는 G-suite 계정만 사용이 가능합니다.",
				},
				forLogin: {
					loginBtn: "Login",
					placeholderId: "학번을 입력해주세요.",
					placeholderPw: "비밀번호를 입력해주세요",
				},
				adminLogin: {
					subTitle: "관리자님 글로벌존 예약시스템에 오신 것을 환영합니다.",
					placeholderId: "관리자 계정을 입력해주세요.",
					placeholderPw: "비밀번호를 입력해주세요",
				},
			},
		},
		mobile: {},
		foreigner: {
			header: { btnLogout: "로그아웃" },
			body: {
				title: "스케줄 및 예약관리",
				calendar: {
					mon: "월",
					tues: "화",
					wednes: "수",
					thurs: "목",
					fri: "금",
					sater: "토",
					sun: "일",
				},
				nav: {
					countOfWeeklySchedules: "이번주 스케줄",
					countOfUnapproved: "예약 승인 대기",
					countOfReserved: "예약 승인 완료",
					countOfResultNotEntered: "출석 결과 미입력",
					countOfResultEntered: "출석 결과 입력완료",
				},
				table: {
					reserved: "명 예약 완료",
					resertNotEntered: (value) => `참가 학생:${value}명 \n[결과 미입력]`,
					resertEntered: "결과 입력 완료",
					finish: "종료",
					noReservation: "예약없음",
				},
			},
		},
		admin: {
			header: {
				btnSchedule: "스케줄 및 예약관리",
				btnKor: "학생관리",
				btnFor: "유학생관리",
				btnSetting: "시스템환경설정",
				btnLogout: "로그아웃",
			},
			schedule: {
				checkboxUnapproval: {
					title: "예약 미승인",
					count: "건",
				},
				checkboxNotEnter: {
					title: "결과 미입력",
					count: "건",
				},
				checkboxUnpermission: {
					title: "결과 미승인",
					count: "건",
				},
				checkboxDone: {
					title: "결과 입력완료",
					count: "건",
				},
				descResStatus: {
					reservationStatus: "[예약현황] 미승인 / 총 신청 학생",
					reservationComplete: "[예약 승인 완료]",
					resultNotEnter: "[결과 미입력] 출석 학생",
					adminNotApp: "[관리자 미승인] 출석 학생",
					adminApp: "[관리자 승인 완료]",

				},
				notdataInfo: {
					text: "데이터가 없습니다.",
				},
				btnSchDelete: {
					btntext: "스케줄 삭제",
				},
				btnSaveHistory: {
					btntext: "활동 내역 저장",
				},
				schResAvailable: {
					text: "예약 가능",
				},
				schResUnable: {
					text: "예약 불가",
				},
				noAppointmentSch: {
					alertText: "예약 가능한 스케줄이 없습니다.",
				},
				tableLang: {
					eng: "영어",
					jp: "일본어",
					ch: "중국어",
				},
			},
			//
			korStudentManage: {
				pageTitle: {
					title: "한국인 학생 관리",
				},
				searchStudentSelect: {
					name: "이름",
					studentNum: "학번",
					tel: "연락처",
				},
				searchStudentBtn: {
					btnText: "검색",
				},
				studentTable: {
					department: "계열학과",
					studentNum: "학번",
					name: "이름",
					restriction: "이용제한",
					tel: "연락처",
					account: "G Suite 계정",
					activityCount: "활동 횟수",
					noAttendCount: "미참석 횟수",
					count: "회",
				},
				btnApplyApp: {
					btnText: "신청 승인",
				},
				btnSaveStudentList: {
					btnText: "한국인 학생 목록 저장",
				},
			},
			//
			foreignStudentManage: {
				pageTitle: {
					title: "유학생 관리",
				},
				searchStudentSelect: {
					name: "이름",
					studentNum: "학번",
				},
				foreignStdTable: {
					language: "언어",
					country: "국가명",
					bookmark: "즐겨찾기",
					foreignStdInfo: "유학생 정보",
					stdNum: "학번",
					stdName: "이름",
					department: "계열학과",
					activityTime: "활동시간",
					timeSum: "합계",
					month: "월",
					resNonApprovalCount: "예약 미승인 횟수",
					resultDelayCount: "결과 지연 입력 횟수",
					count: "회",
					min: "분",
				},
				foreignStdTooltip: {
					resetPassword: "비밀번호 초기화",
					resetPasswdAlert: "비밀번호를 초기화 시키겠습니까?",
					resetPasswdCompletAlert: "비밀번호 초기화가 완료되었습니다.",
					modify: "수정",
					ok: "확인",
				},
				semesterNotStudent: {
					alertText: "해당 학기에 등록 된 학생이 없습니다.",
				},
				foreignStdBtn: {
					ContactInfo: "연락처 정보",
					foreignStdRegist: "근로 유학생 등록",
					semesterSchRegist: "학기 스케줄 등록",
					schIndividualInput: "스케줄 개별 입력",
					foreignStdListSave: "근로 유학생 목록 저장",
				},
			},
			//
			systemSetting: {
				pageTitle: {
					title: "시스템 환경설정",
				},
				SchManagSetting: {
					title: "예약관리 설정",
					stdTodayRes: "한국인 학생 하루 예약",
					num: "번",
					oneTimeMaxRes: "한 타임 최대 예약",
					person: "명",
					resAppAndCancel: "예약 승인 및 취소는",
					currentCriterion: "현재 기준",
					CompleteBy: "24:00까지 완료",
					daysAgo: "일 전까지",
					redAvailableDay: "예약 신청 가능한 기준일",
					AvailableFrom: "24:00부터 가능",
					sinceDaysAgo: "일 전부터",
				},
				schSetting: {
					Description: "스케줄 한 타임의 기준시간은 30분으로 자동계산됩니다.",
					warningText:
						"설정 이후에 생성되는 스케줄부터 적용되며, 학기 시작 중에는 변경 불가",
					meetingTime: "미팅 시간",
					breakTime: "쉬는 시간",
					min: "분",
				},
				regulationManage: {
					// Description: "노쇼 최대",
					// Description: "까지",
					// Description: "패널티 부여",
					// Description: "번 부터",
					// Description: "패널티 기간",
					// Description: "일 동안",
					// Description: "[설정 예시]",
					// Description: "결석 3회 부터 결석 시, 3일간 이용제한 5회 이상 결석 시, 해당 학기 이용 제한",
					// Description: "유학생 결과입력",
					// Description: "일 이내",
				},
			},
		},
		modal: {
			AddScheduleStudent: {
				title: "학생추가",
				alert: { overlap: "이미 추가된 학생입니다." },
				placeholderTerm: "학생 이름으로 검색하기",
				btnSearch: "검색",
				btnAdd: "추가하기",
			},
			ConfirmRestriction: {
				title: "이용제한 등록",
				subTitle: "***학생의 이용제한 사유를 입력해주세요.",
				btnDate: "날짜로 제한하기",
				btnSection: "현재 학기 제한하기",
				inputDate: "이용제한 nn일 설정",
				btnConfirm: "등록",
			},
			ConfirmUnrestriction: {
				title: "이용 제한 해제",
				subTitle: "***학생의 이용제한을 해제하시겠습니까?",
				btnConfirm: "해제",
			},
			ConfirmStudent: {
				title: "한국인 학생 등록 승인",
				countOfStudents: "신청인원 : nn명",
				tableHead: {
					department: "계열/학과",
					stdNum: "학번",
					name: "이름",
					contact: "연락처",
					gSuiteAccount: "G-Suite 계정",
					delete: "삭제",
				},
				alert: { delete: "[경고] 정말 삭제하시겠습니까?\n학번 : ***\n이름 : ***" },
				btn: "",
				input: "",
				btnConfirm: "등록",
			},
			CreateDept: {
				title: "학과등록",
				departmentName: "학과명",
				shortCut: "줄임말",
				btnConfirm: "저장",
			},
			CreateSchedule: {
				title: "스케줄 입력",
				selectDate: "날짜 선택",
				selectTime: "시간 선택",
				selectFor: "유학생 선택",
				btnAdd: "추가",
				btnConfirm: "등록",
			},
			CreateSection: {
				title: "학기 등록",
				subTitle: "*** 기간 설정",
				section: "**학년도",
				summer: "여름학기",
				winter: "겨울학기",
				alert: "이미 시작 된 학기입니다.",
				btnConfirm: "저장",
				btnModify: "수정",
				startOfSection: "학기 시작일",
				endOfSection: "학기 종료일",
			},
			InsertResult: {
				title: "출석 결과 입력하기",
				startTime: "시작시간",
				endTime: "종료시간",
				attendance: "출석",
				absent: "결석",
				startImg: "시작 사진",
				endImg: "종료 사진",
				btnUpload: "업로드",
				nofication:
					"줌 시작 및 종료 화면 캡쳐는 날짜 및 시간이 잘 보여야 합니다.\n이미지 사이즈 및 크기 : 900 X 900 / 2MB 이하",
				btnConfirm: "저장",
			},
			ShowList: {
				title: "신청 학생 명단보기",
				startTime: "시작시간",
				endTime: "종료시간",
				agree: "동의",
				disagree: "미동의",
				agreeAll: "일괄동의",
				btnAddStd: "학생 추가",
				btnConfirm: "저장",
			},
			ShowListDone: {
				title: "출석 학생 명단보기",
				startTime: "시작시간",
				endTime: "종료시간",
				attendance: "출석",
				absent: "결석",

			},
			// 
			korStudentManage: {
				pageTitle: {
					title: "한국인 학생 관리",
				},
				searchStudentSelect: {
					name: "이름",
					studentNum: "학번",
					tel: "연락처",
				},
				searchStudentBtn: {
					btnText: "검색",
				},
				studentTable: {
					department: "계열학과",
					studentNum: "학번",
					name: "이름",
					restriction: "이용제한",
					tel: "연락처",
					account: "G Suite 계정",
					activityCount: "활동 횟수",
					noAttendCount: "미참석 횟수",
					count: "회",
				},
				btnApplyApp: {
					btnText: "신청 승인",
				},
				btnSaveStudentList: {
					btnText: "한국인 학생 목록 저장",
				},
			},
			// 
			foreignStudentManage : {
				pageTitle: {
					title: "유학생 관리",
				},
				searchStudentSelect : {
					name: "이름",
					studentNum: "학번",
				},
				foreignStdTable: {
					language: "언어",
					country: "국가명",
					bookmark: "즐겨찾기",
					foreignStdInfo: "유학생 정보",
					stdNum: "학번",
					stdName: "이름",
					department: "계열학과",
					activityTime: "활동시간",
					timeSum: "합계",
					month: "월",
					resNonApprovalCount: "예약 미승인 횟수",
					resultDelayCount: "결과 지연 입력 횟수",
					count: "회",
					min: "분",
				},
				foreignStdTooltip : {
					resetPassword : "비밀번호 초기화",
					resetPasswdAlert : "비밀번호를 초기화 시키겠습니까?",
					resetPasswdCompletAlert : "비밀번호 초기화가 완료되었습니다.",
					modify : "수정",
					ok : "확인",
				},
				semesterNotStudent : {
					alertText: "해당 학기에 등록 된 학생이 없습니다.",
				},
				foreignStdBtn : {
					ContactInfo : "연락처 정보",
					foreignStdRegist : "근로 유학생 등록",
					semesterSchRegist : "학기 스케줄 등록",
					schIndividualInput : "스케줄 개별 입력",
					foreignStdListSave : "근로 유학생 목록 저장",
				},
			},
			//
			systemSetting : {
				pageTitle: {
					title: "시스템 환경설정",
				},
				SchManagSetting: {
					title: "예약관리 설정",
					stdTodayRes: "한국인 학생 하루 예약",
					num: "번",
					oneTimeMaxRes: "한 타임 최대 예약",
					person: "명",
					resAppAndCancel : "예약 승인 및 취소는",
					currentCriterion: "현재 기준",
					CompleteBy: "24:00까지 완료",
					daysAgo: "일 전까지",
					redAvailableDay: "예약 신청 가능한 기준일",
					AvailableFrom: "24:00부터 가능",
					sinceDaysAgo: "일 전부터",
				},
				schSetting : {
					Description: "스케줄 한 타임의 기준시간은 30분으로 자동계산됩니다.",
					warningText : "설정 이후에 생성되는 스케줄부터 적용되며, 학기 시작 중에는 변경 불가",
					meetingTime : "미팅 시간",
					breakTime : "쉬는 시간",
					min: "분",
				},
				regulationManage : {
					// Description: "노쇼 최대",
					// Description: "까지",
					// Description: "패널티 부여",
					// Description: "번 부터",
					// Description: "패널티 기간",
					// Description: "일 동안",
					// Description: "[설정 예시]",
					// Description: "결석 3회 부터 결석 시, 3일간 이용제한 5회 이상 결석 시, 해당 학기 이용 제한",
					// Description: "유학생 결과입력",
					// Description: "일 이내",
				}
			}
		},
	},
};
/**
 
 {
	 title:"",
	 subTitle:"",
	 btn:"",
	 input:"",
	 btnConfirm:"등록"
 }

 */

export default language;
