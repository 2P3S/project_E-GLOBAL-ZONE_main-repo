"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var MANAGER = "MANAGER";
var FOREIGNER = "FOREIGNER";
var KOREAN = "KOREAN";
var COMINFO = "컴퓨터정보계열";
var MECHANICAL = "컴퓨터응용기계계열";
var ICT = "ICT반도체전자계열";
var ELECTRICAL = "신재생에너지전기계열";
var ARCHITECTURE = "건축인테리어디자인계열";
var MILITARY = "부사관계열";
var DESIGN = "콘텐츠디자인과";
var DRONE = "드론항공전자과";
var BUSINESS = "경영회계서비스계열";
var TOURISM = "호텔항공관광계열";
var WELFARE = "사회복지과";
var CHILDHOOD = "유아교육과";
var HELTH = "보건의료행정과";
var NURSING = "간호학과";
var ENGLISH = "영어";
var JAPANESE = "일본어";
var CHINESE = "중국어";
var conf = {
  userClass: {
    MANAGER: MANAGER,
    FOREIGNER: FOREIGNER,
    KOREAN: KOREAN
  },
  department: {
    COMINFO: COMINFO,
    MECHANICAL: MECHANICAL,
    ICT: ICT,
    ELECTRICAL: ELECTRICAL,
    ARCHITECTURE: ARCHITECTURE,
    MILITARY: MILITARY,
    DESIGN: DESIGN,
    DRONE: DRONE,
    BUSINESS: BUSINESS,
    TOURISM: TOURISM,
    WELFARE: WELFARE,
    CHILDHOOD: CHILDHOOD,
    HELTH: HELTH,
    NURSING: NURSING
  },
  shortDepartment: ["", "컴정", "기계", "전자", "전기", "디자인", "드론", "경영", "건축", "부사관", "관광", "복지", "유아", "보건", "간호"],
  language: {
    ENGLISH: ENGLISH,
    JAPANESE: JAPANESE,
    CHINESE: CHINESE
  },
  url: "http://13.124.189.186:8888/"
};
var _default = conf;
exports.default = _default;