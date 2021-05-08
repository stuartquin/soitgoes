import * as Api from './api';

const getBaseUrl = (): string => {
  return `${window.location.protocol}//${window.location.hostname}:${window.location.port}`;
};

const getApi = (): Api.ApiApi => {
  return new Api.ApiApi(new Api.Configuration({
    basePath: getBaseUrl()
  }));
};


export default getApi;
