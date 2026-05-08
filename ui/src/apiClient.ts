import { client } from "apiv3/client.gen";
import * as Api from "./api";

const API_BASE_URL = `${window.location.protocol}//${window.location.hostname}:${window.location.port}`;
client.setConfig({
  baseUrl: API_BASE_URL,
  headers: {
    "X-Client-Version": 3,
  },
});

client.interceptors.request.use((request) => {
  const accessToken = window.localStorage.getItem("token");
  if (!accessToken) {
    location.href = "/login";
    return request;
  }
  request.headers.set("Authorization", `Token ${accessToken}`);
  return request;
});

client.interceptors.response.use((response) => {
  if ([401, 403].includes(response.status)) {
    removeToken();
    location.href = "/login";
  }
  return response;
});

export const getAPIErrorMessage = async (error: any): Promise<string> => {
  if (error.status === 500) {
    return Promise.resolve(error.statusText);
  }

  if (error.json) {
    const errorJSON = await error.json();
    if (error.detail) {
      return errorJSON.detail;
    }

    if (errorJSON.length > 0) {
      return errorJSON[0];
    }
  }

  return Promise.resolve("There was an error");
};

export const getBaseUrl = (): string => {
  return API_BASE_URL;
};

export const storeToken = (token: string) => {
  window.localStorage.setItem("token", token);
};

export const removeToken = () => {
  window.localStorage.removeItem("token");
};

export const getClient = (): Api.ApiApi => {
  const config = {
    basePath: getBaseUrl(),
    headers: {} as Api.HTTPHeaders,
  };

  const token = window.localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Token ${token}`;
  }

  return new Api.ApiApi(new Api.Configuration(config));
};
