import { httpClient } from './http.service';
import { api } from '../constants/api.constant';

export const searchService = {
  search: (key, pageToken = '') => httpClient.get(api.search, { key, pageToken }, true, 'Đang tìm kiếm...'),
  getTrending: (pageToken = '') => httpClient.get(api.getYoutubeTrending, { pageToken })
}
