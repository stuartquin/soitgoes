import React, { useEffect } from 'react';

import getApi from 'getApi';
import { getFormValues } from 'forms';

function Login() {
  const login = async (event: React.FormEvent<HTMLFormElement>) => {
    const values = getFormValues(event);
    const api = getApi();
    api.createLogin({body: { ...values }});
  };

  return (
    <div className="Login">
      <form onSubmit={login}>
        <input type="email" id="username" />
        <input type="password" id="password" />
        <input type="submit" value="Login" />
      </form>
    </div>
  );
}

export default Login;
