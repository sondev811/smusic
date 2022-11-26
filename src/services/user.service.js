import { httpClient } from './http.service';
import { api } from '../constants/api.constant';

export const userService = {
  getUserInfo: () => httpClient.get(api.getUserInfo)
}

