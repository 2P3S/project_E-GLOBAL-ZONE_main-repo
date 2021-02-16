import { admin } from '../axios';

export const getAdminSettingReset = () =>
	admin.get('setting/reset', { params: { factory_reset: 1 } });

export const getAdminSetting = (params) => admin.get('setting', { params });

export const postAdminSetting = (data) => admin.post('setting', data);
