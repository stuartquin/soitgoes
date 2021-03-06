import { getAuthToken } from 'services/cookie';

const getRequestParams = (method) => {
  return {
    method,
    mode: 'cors',
    credentials: 'same-origin',
    headers: new Headers({
      'Content-Type': 'application/json',
      Authorization: `Token ${getAuthToken()}`,
    }),
  };
};

export const buildRequest = (path, method = 'GET', data = null) => {
  let params = getRequestParams(method);
  let url = `/api/${path}`;

  if (data) {
    params.body = JSON.stringify(data);
  }

  return new Request(url, params);
};

export const post = (path, body = null) => {
  return fetch(buildRequest(path, 'POST', body)).then((res) => res.json());
};
export const put = (path, body = null) => {
  return fetch(buildRequest(path, 'PUT', body)).then((res) => res.json());
};

export const createSession = () => {
  return fetch(buildRequest('session/', 'POST')).then((res) => res.json());
};

export const fetchByIds = (type, ids) => {
  let url = `${type}/?ids=${ids.join(',')}`;
  return fetch(buildRequest(url)).then((res) => res.json());
};

export const paginate = (url) => {
  const params = getRequestParams('GET');
  const req = new Request(url, params);

  return fetch(req).then((res) => res.json());
};

export const get = (path, params = {}) => {
  const qs = Object.keys(params)
    .map((p) => {
      if (params[p] !== null) {
        return `${p}=${params[p]}`;
      }
      return '';
    })
    .filter((q) => q)
    .join('&');

  let url = path;
  if (qs) {
    url = `${url}?${qs}`;
  }

  return fetch(buildRequest(url)).then((res) => res.json());
};

export const add = (path, form) => {
  const req = buildRequest(path, 'POST', form);
  return fetch(req).then((res) => res.json());
};

export const remove = (path, id) => {
  return fetch(buildRequest(`${path}${id}`, 'DELETE'));
};

export const update = (path, id, form) => {
  const req = buildRequest(`${path}${id}`, 'PUT', form);
  return fetch(req).then((res) => res.json());
};

export const fetchAccounts = () => {
  return fetch(buildRequest('accounts/')).then((res) => res.json());
};

export const fetchUser = () => {
  return fetch(buildRequest('user/')).then((res) => res.json());
};

export const fetchVersion = () => {
  return fetch(buildRequest('version/')).then((res) => res.json());
};

export const fetchActivityFeed = () => {
  return fetch(buildRequest('activity/')).then((res) => res.json());
};

export const fetchSummary = (type, start, end) => {
  let url = `summary/${type}/`;
  url = url + `?start=${start}&end=${end}`;

  return fetch(buildRequest(url)).then((res) => res.json());
};

export const fetchExpenses = (start, end) => {
  let url = `expenses/`;
  url = url + `?start=${start}&end=${end}`;

  return fetch(buildRequest(url)).then((res) => res.json());
};

export const login = (form) => {
  const req = buildRequest(`login/`, 'POST', form);
  return fetch(req);
};

export const logout = () => {
  return fetch(buildRequest(`login/`, 'DELETE')).then(() => {
    location.href = '/';
  });
};
