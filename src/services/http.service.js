import axios from 'axios';
import store from '../store';
import { http } from '../constants/api.constant';
import authService from './auth.service';
import { setLoadingAction, setLoadingDoneAction } from '../reducers/loading.reducer';

class HttpClient {
  timeout(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  getUrl(url, params) {
    const urlWithParams = this.handleParams(params);
    return `${http.url}${url}${urlWithParams}`;
  }

  handleParams(params) {
    let urlWithParams = '';
    const keys = Object.keys(params);
    const values = Object.values(params);
    if (!keys || !keys.length || !values || !values.length) {
      return urlWithParams;
    }
    urlWithParams = '?';
    keys.forEach((item, index) => {
      if (index >= 1) {
        urlWithParams += '&';
      }
      urlWithParams += `${item}=${values[index]}`;
    });
    return urlWithParams;
  }

  getHeader() {
    const token = authService.getLocalStorage('token');
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    };
    return headers;
  }

  handleErrors(res) {
    store.dispatch(setLoadingAction({ isLoading: false }));
    if (!res) {
      store.dispatch(
        setLoadingAction({
          content: `Không thể kết nối tới máy chủ`
        })
      );
      return;
    }
    store.dispatch(
      setLoadingDoneAction()
    );
    if (res.status === 401) {
      authService.logout();
    } else if (res.status === 404) {
    }
    return {
      status: false,
      data: res.data.error
    };
  }

  async handleSuccess(res) {
    store.dispatch(setLoadingDoneAction());
    if (!res.data.success) {
      return {
        error: res.data.error,
        status: false,
        result: null
      };
    }
    return {
      status: true,
      result: res.data.result
    };
  }

  async get(url, params = {}, isLoading = true, loadingContent='') {
    try {
      url = this.getUrl(url, params);
      const options = {
        headers: this.getHeader()
      };
      if (isLoading) {
        store.dispatch(setLoadingAction({ content: loadingContent }));
      }
      const response = await axios.get(url, options);
      return this.handleSuccess(response);
    } catch (error) {
      return this.handleErrors(error.response);
    }
  }

  async post(url, body, isLoading = false, loadingContent = '') {
    try {
      url = this.getUrl(url, {});
      const options = {
        headers: this.getHeader()
      };
      const bodyParse = JSON.stringify(body);
      if (isLoading) {
        store.dispatch(setLoadingAction({ content: loadingContent}));
      }
      const response = await axios.post(url, bodyParse, options);
      return this.handleSuccess(response);
    } catch (error) {
      return this.handleErrors(error.response);
    }
  }
}

export default new HttpClient();
