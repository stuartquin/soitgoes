import React, { useEffect } from 'react';
import logo from './logo.svg';
import './App.css';

import * as Api from './api';

const getBaseUrl = (): string => {
  return `${window.location.protocol}//${window.location.hostname}:${window.location.port}`;
};

const getAccounts = async() => {
  const api = new Api.ApiApi(new Api.Configuration({
    basePath: getBaseUrl()
  }));
  const response = await api.listProjects({});
  const projects = response.results || [];

  projects.forEach(project => {
    console.log(project.name);
  });
};

function App() {

  useEffect(() => {
    getAccounts();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
