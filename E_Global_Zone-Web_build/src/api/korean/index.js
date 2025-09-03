import { korean, koreanLogin } from '../axios';

/**
 * get a list of sections has attended
 * return axios get promise instance
 */
export const getKoreanSection = () => korean.get('section');

/**
 * create an account for korean students
 * @param {object} data {std_kor_id, std_kor_dept, std_kor_name, std_kor_phone, std_kor_mail}
 */
export const postKoreanAccount = (data) => korean.post('account', data);

/**
 * get a schedule list that is can applicate today
 * @param {string} sch_id - optional schedule ID
 * @param {number} isOffline - optional filter for offline schedules (1: 오프라인, null: 온라인)
 */
export const getKoreanSchedule = (sch_id, isOffline = null) => {
  let url = 'schedule';
  if (sch_id) {
    url += `/${sch_id}`;
  }

  const params = {};
  if (isOffline !== null) {
    params.is_offline = isOffline;
  }

  return korean.get(url, { params });
};

/**
 * get all schedules for a specific date (admin API - no date restrictions)
 * @param {string} searchDate - date to search for (YYYY-MM-DD)
 * @param {boolean} isOffline - optional filter for offline schedules
 */
export const getAllSchedulesByDate = (searchDate, isOffline = null) => {
  const params = {
    search_date: searchDate,
    guard: 'admin',
  };

  if (isOffline !== null) {
    params.is_offline = isOffline;
  }

  return korean.get('schedule', { params });
};

export const getKoreanSectionRank = (sect_id) => korean.get(`section/rank/${sect_id}`);
export const getKoreanSetting = (sect_id) => korean.get(`setting`);

export const postKoreanLogin = () => koreanLogin.post();
