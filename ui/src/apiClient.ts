import * as Api from './api';

const getBaseUrl = (): string => {
  return `${window.location.protocol}//${window.location.hostname}:${window.location.port}`;
};

export const storeToken = (token: string) => {
  window.localStorage.setItem("token", token);
};

export const getClient = (): Api.ApiApi => {
  const config = {
    basePath: getBaseUrl(),
    headers: {} as Api.HTTPHeaders
  };

  const token = window.localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Token ${token}`;
  }

  return new Api.ApiApi(new Api.Configuration(config));
};


