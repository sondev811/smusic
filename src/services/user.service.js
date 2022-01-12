import http from './http.service';
import { api } from '../constants/api.constant';
class User {
  getUserInfo() {
    return http.get(api.getUserInfo);
  }
}

export default new User();
