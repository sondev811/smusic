import { httpClient } from './http.service';
import { api } from '../constants/api.constant';
export const authService = {
  login: (body) => httpClient.post(api.login, body, true, 'Đang đăng nhập...'),

  signUp: (body) => httpClient.post(api.signup, body, true, 'Đang đăng ký tài khoản...'),

  logout() {
    this.deleteLocalStorage('token');
    window.location = '/login';
  },

  isAuthenticated() {
    return this.getLocalStorage('token');
  },

  setLocalStorage: (keyName, value) => localStorage.setItem(keyName, value),

  getLocalStorage: (name) => localStorage.getItem(name),

  deleteLocalStorage: (name) => localStorage.removeItem(name)
}
