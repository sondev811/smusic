import http from './http.service';
import { api } from '../constants/api.constant';

export const search = async (key, pageToken = '') => {
  return http.get(api.search, { key, pageToken });
};

export const getTrending = async (pageToken = '') => {
  return http.get(api.getYoutubeTrending, { pageToken });
};
