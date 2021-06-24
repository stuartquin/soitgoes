import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

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
      {user && (
        <Router>
          <Switch>
            <Route path="/">
              <Main user={user} />
            </Route>
          </Switch>
        </Router>
      )}
    </div>
  );
}

export default App;
