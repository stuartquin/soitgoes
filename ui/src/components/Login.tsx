import React from 'react';

import { getFormValues } from 'forms';
import { getClient, storeToken } from 'apiClient';

function Login() {
  const login = async (event: React.FormEvent<HTMLFormElement>) => {
    const values = getFormValues(event);
    const api = getClient();

    if (values.email && values.password) {
      const response = await api.createLogin({
        login: {
          email: values.email,
          password: values.password,
        }
      });
      storeToken(response.token || "");
      window.location.reload();
    }

  };

  return (
    <div className="Login">
      <form onSubmit={login}>
        <input type="email" id="email" />
        <input type="password" id="password" />
        <input type="submit" value="Login" />
      </form>
    </div>
  );
}

export default Login;
