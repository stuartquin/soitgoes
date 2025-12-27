import React, { useEffect, useState } from "react";

import { User } from "api/models";
import { getClient } from "apiClient";
import Login from "components/Login";
import Main from "components/Main";

import "./App.css";

function App() {
  const [user, setUser] = useState<User>();
  const [loginRequired, setLoginRequired] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const api = getClient();
      try {
        setUser(await api.retrieveUser());
      } catch (err) {
        console.error(err);
        setLoginRequired(true);
      }
      setLoading(false);
    };

    load();
  }, []);

  return (
    <div className="App">
      {loginRequired && <Login />}
      {user && <Main user={user} />}
    </div>
  );
}

export default App;
