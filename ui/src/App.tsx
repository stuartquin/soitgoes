import React, { useState, useEffect } from 'react';
import './App.css';

import { User } from 'api/models';
import { getClient } from 'apiClient';
import Login from 'components/Login';
import Main from 'components/Main';


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
    }

    load();
  }, []);


  return (
    <div className="App">
      {loading && <h2>Loading</h2>}
      {loginRequired && <Login />}
      {user && <Main user={user} />}
    </div>
  );
}

export default App;
