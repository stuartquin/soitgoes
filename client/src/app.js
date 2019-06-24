import React from 'react';
import styled, {ThemeProvider} from 'styled-components';
import { Route } from 'react-router-dom'
import { hot } from 'react-hot-loader/root'
import { connect } from 'react-redux';

import {Login} from 'components/login/login';
import {NavContainer} from 'components/nav/navcontainer';
import {theme} from 'components/GUI';
import {login} from 'services/api';
import {getAuthToken} from 'services/cookie';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoggedIn: Boolean(getAuthToken())
    };

    this.handleLogin = this.handleLogin.bind(this);
  }

  handleLogin(form) {
    login(form).then(res => {
      this.setState({isLoggedIn: true});
      const {history} = this.props;
      history.push(`/invoices`);
    });
  }

  render() {
    const {isLoggedIn} = this.state;

    return (
      <ThemeProvider theme={theme}>
        {isLoggedIn ? (
          <Route component={NavContainer} />
        ) : (
          <Login onSubmit={this.handleLogin} />
        )}
      </ThemeProvider>
    );
  }
}

export default hot(App);
