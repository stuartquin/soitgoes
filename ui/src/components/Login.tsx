import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import Button from "components/Button";
import Input from "components/Form/Input";
import { getFormValues } from "forms";
import {
  getClient,
  storeToken,
  removeToken,
  getAPIErrorMessage,
} from "apiClient";

import GoogleButton from "./btn_google_signin_dark_normal_web@2x.png";

function Login() {
  const search = window.location.search;
  const [error, setError] = useState<string>();

  useEffect(() => {
    const ssoLogin = async () => {
      const api = getClient();
      const searchParams = new URLSearchParams(search);
      const code = searchParams.get("code");
      if (code) {
        try {
          const response = await api.createSSO({ sSO: { code } });
          storeToken(response.token || "");
          window.location.href = "/";
        } catch (error) {
          setError(await getAPIErrorMessage(error));
        }
      }
    };
    ssoLogin();
  }, [search]);

  const login = async (event: React.FormEvent<HTMLFormElement>) => {
    const values = getFormValues(event);
    const api = getClient();

    if (values.email && values.password) {
      try {
        const response = await api.createLogin({
          login: {
            email: values.email,
            password: values.password,
          },
        });
        storeToken(response.token || "");
        window.location.reload();
      } catch (error) {
        removeToken();
        setError(await getAPIErrorMessage(error));
      }
    }
  };

  return (
    <div className="flex w-full items-center justify-center h-100">
      <form onSubmit={login} className="w-72">
        <Input
          type="email"
          id="email"
          className="my-2 w-full"
          placeholder="Email"
        />
        <Input
          type="password"
          id="password"
          className="my-2 w-full"
          placeholder="Password"
        />
        <Button variant="success" type="submit" className="w-full mt-4">
          Login
        </Button>

        <a href="/api/users/sso/redirect/?domain=quin.team">
          <img src={GoogleButton} className="w-48" />
        </a>

        {error && (
          <div className="rounded text-red-500 my-4 p-3 bg-red-100">
            {error}
          </div>
        )}
      </form>
    </div>
  );
}

export default Login;
