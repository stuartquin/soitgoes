export const getQueryParams = (queryString) => {
  const qs = queryString || '';
  return qs
    .slice(qs.indexOf('?') + 1)
    .split('&')
    .reduce((acc, item) => {
      const chunks = item.split('=');
      acc[chunks[0]] = chunks[1];
      return acc;
    }, {});
};

export const updateQueryParams = (params) => {
  const url = window.location.pathname + window.location.search;
  const existing = getQueryParams(url);
  const newParams = {
    ...existing,
    ...params,
  };
  const qs = Object.keys(newParams)
    .filter((key) => newParams[key])
    .map((key) => `${key}=${newParams[key]}`)
    .join('&');

  const path = url.indexOf('?') > -1 ? url.slice(0, url.indexOf('?')) : url;
  return qs ? `${path}?${qs}` : path;
};
