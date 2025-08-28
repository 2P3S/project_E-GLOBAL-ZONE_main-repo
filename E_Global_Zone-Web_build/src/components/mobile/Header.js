import React from 'react';
import { Link } from 'react-router-dom';
import { googleLogout } from '@react-oauth/google';
import { useDispatch, useSelector } from 'react-redux';
import { selectIsOnline, setOnlineOffline } from '../../redux/confSlice/confSlice';

/**
 * Header for Mobile
 * @returns {JSX.Element}
 * @constructor
 */
export default function Header() {
  const dispatch = useDispatch();
  const isOnline = useSelector(selectIsOnline);

  const handleLogout = () => {
    googleLogout();
    window.localStorage.clear();
    window.location.href = '/';
  };

  const handleOnlineClick = () => {
    dispatch(setOnlineOffline(true));
    alert('온라인으로 변경되었습니다.');
  };

  const handleOfflineClick = () => {
    dispatch(setOnlineOffline(false));
    alert('오프라인으로 변경되었습니다.');
  };

  return (
    <>
      <div className="mhead" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div className="logo">
          <Link to="/">
            <img src="/global/mobile/img/logo.gif" alt="영진전문대학교 글로벌존 영문로고" />
          </Link>
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '10px 0',
            alignSelf: 'flex-end',
          }}
        >
          {/* 온라인/오프라인 선택 버튼 */}
          <div
            className="online_offline_button"
            style={{ border: '1px solid #ddd', borderRadius: '16px', padding: '2px 2px' }}
          >
            <button
              type="button"
              style={{
                width: '62px',
                background: isOnline ? '#182F9E' : '#fff',
                color: isOnline ? '#fff' : '#182F9E',
                border: 'none',
                padding: '6px 1px',
                borderRadius: '16px',
                cursor: 'pointer',
                fontSize: '10px',
                marginRight: '2px',
                fontWeight: isOnline ? 'bold' : 'normal',
              }}
              onClick={handleOnlineClick}
            >
              온라인
            </button>
            <button
              type="button"
              style={{
                width: '62px',
                background: !isOnline ? '#182F9E' : '#fff',
                color: !isOnline ? '#fff' : '#182F9E',
                border: 'none',
                padding: '6px 1px',
                borderRadius: '16px',
                cursor: 'pointer',
                fontSize: '10px',
                fontWeight: !isOnline ? 'bold' : 'normal',
              }}
              onClick={handleOfflineClick}
            >
              오프라인
            </button>
          </div>
          <div
            className="login"
            onClick={handleLogout}
            style={{
              cursor: 'pointer',
              marginLeft: '2px',
              marginTop: '0',
              padding: '6px 10px',
              border: '1px solid #ddd',
              borderRadius: '16px',
              backgroundColor: '#f8f9fa',
              color: '#666',
              fontSize: '10px',
              textAlign: 'center',
              minWidth: '50px',
            }}
          >
            Logout
          </div>
        </div>
      </div>
    </>
  );
}
