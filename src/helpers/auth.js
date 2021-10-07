import Axios from "axios";

const TOKEN_KEY = "TOKEN";
const REFRESH_KEY = "REFRESH";
const BASE_URL = process.env.REACT_APP_BASE_URL;

export function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function setRefresh(token) {
  localStorage.setItem(REFRESH_KEY, token);
}

export function getRefresh() {
  return localStorage.getItem(REFRESH_KEY);
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function deleteToken() {
  localStorage.removeItem(TOKEN_KEY);
}

export function deleteRefresh() {
  localStorage.removeItem(REFRESH_KEY);
}

export function initAxiosInterceptors() {
  Axios.interceptors.request.use(
    config => {
      config.baseURL = BASE_URL;

      const token = getToken();

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      return config;
    },
    err => {
      Promise.reject(err);
    }
  );

  Axios.interceptors.response.use(
    response => response,
    err => {
      const originalRequest = err.config;

      if (err && err.response.status === 401 && originalRequest.url === `${BASE_URL}/api/token/refresh`) {
        deleteToken();
        deleteRefresh();
        window.location.href = '/login';
      }

      if (err && err.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        return Axios.post(`${BASE_URL}/api/token/refresh`, {refresh: getRefresh()}).then(response => {
          if (response.status === 200) {
            setToken(response.data.access);
            originalRequest.headers['Authorization'] = `Bearer ${getToken()}`;
            return Axios(originalRequest);
          }
        });
      }

      return Promise.reject(err);
    }
  );
}
