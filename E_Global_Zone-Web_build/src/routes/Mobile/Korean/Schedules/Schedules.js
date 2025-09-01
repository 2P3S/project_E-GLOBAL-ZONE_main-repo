import React, { useEffect, useState } from 'react';
import { group } from 'd3-array';
import moment from 'moment';
import { getKoreanSchedule, getKoreanSetting } from '../../../../api/korean';
import Loader from '../../../../components/common/Loader';
import Calendar from '../../../../components/mobile/CalendarMark';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { selectSelectDate, setSelectDate, selectIsOnline } from '../../../../redux/confSlice/confSlice';

export default function Schedules() {
  const selectedDate = useSelector(selectSelectDate);
  const isOnline = useSelector(selectIsOnline);
  const dispatch = useDispatch();
  const [data, setData] = useState();
  const [defaultData, setDefaultData] = useState();
  const [dates, setDates] = useState();
  const [setting, setSetting] = useState({ max_std_once: '-' });
  const [pending, setPending] = useState(true);
  const history = useHistory();

  // 스케줄 조회 함수
  const fetchSchedules = () => {
    setPending(true);

    const isOffline = isOnline ? null : 1;

    getKoreanSchedule(null, isOffline)
      .then((res) => {
        const scheduleData = res.data.data || [];

        const filteredData = scheduleData.filter((schedule) => {
          const isJapanese = schedule.std_for_lang === '일본어';
          return isJapanese;
        });

        if (filteredData.length === 0) {
          setData([]);
        } else {
          const firstDate = moment(filteredData[0].sch_start_date).format('YYYY-MM-DD');
          dispatch(setSelectDate(firstDate));
          setData(group(filteredData, (v) => moment(v.sch_start_date).format('YYYY-MM-DD')).get(firstDate));
        }

        setDefaultData(filteredData);

        const dateSet = group(filteredData, (v) => moment(v.sch_start_date).format('YYYY-MM-DD'));
        const dateObj = {};
        Array.from(dateSet.keys()).forEach((date) => {
          dateObj[date] = ['일본어'];
        });

        setDates(dateObj);
        setPending(false);
      })
      .catch((error) => {
        console.error('API 호출 에러:', error);
        setPending(false);
      });
  };

  useEffect(() => {
    fetchSchedules();
    getKoreanSetting().then((res) => setSetting(res.data.data));
  }, [isOnline]);

  useEffect(() => {
    if (defaultData) {
      setData(group(defaultData, (v) => moment(v.sch_start_date).format('YYYY-MM-DD')).get(selectedDate));
    }
  }, [selectedDate, defaultData]);

  // 시간 포맷팅 함수
  const formatTime = (date) => {
    return moment(date).format('m') === '0'
      ? moment(date).format('M월 D일 h시')
      : moment(date).format('M월 D일 h시 m분');
  };

  return (
    <>
      {!pending ? (
        <div className="wrap">
          <Calendar dates={dates} selectedDate={selectedDate} />

          <div
            className="reservation_boxs tab_wrap"
            style={{
              maxHeight: '300px',
              overflowY: 'auto',
              paddingRight: '10px',
            }}
          >
            {data && setting && data.length > 0 ? (
              data.map((v) => (
                <div
                  key={`${v.sch_id}`}
                  className="box blue"
                  onClick={() => {
                    v.sch_res_available && history.push(`schedule/${v.sch_id}`);
                  }}
                  style={v.sch_res_available && { cursor: 'pointer' }}
                >
                  <ul>
                    <li>
                      [{v.std_for_lang}] {v.std_for_name}
                    </li>
                    <li className="jp">{`${formatTime(v.sch_start_date)} ~ ${formatTime(v.sch_end_date)}`}</li>
                  </ul>
                  <div>
                    {v.sch_res_available ? '예약 가능' : '예약 불가'}{' '}
                    <span>
                      {v.std_res_count} / {setting.max_std_once}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="box">
                <p className="no_data">데이터가 없습니다.</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <Loader />
      )}
    </>
  );
}
