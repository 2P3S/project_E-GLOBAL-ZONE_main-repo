import { foreigner } from '../axios';

const schedule = '/schedule';

/**
 *
 * @param {string} start_date - 시작 날짜
 * @param {string} end_date - 종료 날짜
 * @param {number} isOffline - 오프라인 스케줄 필터링 (1: 오프라인, null: 온라인)
 */
export const getForeignerSchedule = (start_date, end_date, isOffline = null) => {
  const params = {
    start_date: start_date,
    end_date: end_date,
  };

  if (isOffline !== null) {
    params.is_offline = isOffline;
  }

  return foreigner.get(`${schedule}`, { params });
};
