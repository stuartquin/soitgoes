import * as Api from "./api";

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
  return `${window.location.protocol}//${window.location.hostname}:${window.location.port}`;
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
