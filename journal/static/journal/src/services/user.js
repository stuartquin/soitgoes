const getCookies = () => {
  return document.cookie.split("; ").reduce((result, item) => {
    var bits = item.split("=");
    result[bits[0]] = bits.slice(1).join("=");
    return result;
  }, {});
};

export const getUserAuth = () => {
  const cookies = getCookies();
  return cookies.soitgoes_auth
};
