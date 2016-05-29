export const getOptions = (auth, method) => {
  return {
      method: method,
      headers: {
        Authorization: 'Basic ' + auth,
        'Content-Type': 'application/json'
      }
  };
};
