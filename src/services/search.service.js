import http from './http.service';
import { api } from '../constants/api.constant';

export const search = async (key, pageToken = '') => {
  return http.get(api.search, { key, pageToken }, true, 'Đang tìm kiếm...');
};

export const getTrending = async (pageToken = '') => {
  return http.get(api.getYoutubeTrending, { pageToken });
};
