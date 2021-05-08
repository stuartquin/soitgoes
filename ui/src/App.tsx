import React, { useEffect } from 'react';
import logo from './logo.svg';
import './App.css';

import  getApi  from './getApi'
import Login from 'components/Login';

const getAccounts = async() => {
  const api = getApi();
  const response = await api.listProjects({});
  const projects = response.results || [];

  projects.forEach(project => {
    console.log(project.name);
  });
};

function App() {
  return (
    <div className="App">
      <Login />
    </div>
  );
}

export default App;
