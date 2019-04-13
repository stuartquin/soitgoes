const getCookies = () => {
  return document.cookie.split('; ').reduce((result, item) => {
    let bits = item.split('=');
    result[bits[0]] = bits.slice(1).join('=');
    return result;
  }, {});
};

export const getCookie = (cookie) => {
  const cookies = getCookies();
  return cookies[cookie];
};

export const getAuthToken = () => {
  return getCookie('sig_token');
};
