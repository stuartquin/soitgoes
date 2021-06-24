import React, { useState } from "react";

import Button from "components/Button";
import Input from "components/Form/Input";
import { getFormValues } from "forms";
import {
  getClient,
  storeToken,
  removeToken,
  getAPIErrorMessage,
} from "apiClient";

function Login() {
  const [error, setError] = useState<string>();
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
        setError(getAPIErrorMessage(await error.json()));
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
