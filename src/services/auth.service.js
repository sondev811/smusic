import http from './http.service';
import { api } from '../constants/api.constant';
class Auth {
  async login(body) {
    return http.post(api.login, body, true, 'Đang đăng nhập...');
  }

  async signUp(body) {
    return http.post(api.signup, body, true, 'Đang đăng ký tài khoản...');
  }

  logout() {
    this.deleteLocalStorage('token');
    window.location = '/login';
  }

  isAuthenticated() {
    return this.getLocalStorage('token');
  }

  setLocalStorage(keyName, value) {
    return localStorage.setItem(keyName, value);
  }

  getLocalStorage(name) {
    return localStorage.getItem(name);
  }

  deleteLocalStorage(name) {
    localStorage.removeItem(name);
  }
}
export default new Auth();
