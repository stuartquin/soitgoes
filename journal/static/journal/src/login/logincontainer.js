import React from 'react';
import {connect} from 'react-redux';
import { push } from 'react-router-redux'

import { LoginForm } from './loginform';

export const setUserAuth = (fields) => {
  const auth = btoa(`${fields.username}:${fields.password}`);
  document.cookie = `soitgoes_auth=${auth}`;
};

class Login extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <LoginForm
        onSubmit={this.props.onLoginSubmit}
      />
    );
  }
}

const mapStateToProps = (state, props) => {
  return {
  };
};

const mapDispatchToProps = (dispatch, props) => {
  return {
    onLoginSubmit: (fields) => {
      setUserAuth(fields);
      dispatch(push('/timeslips'));
    }
  }
};

const LoginContainer = connect(mapStateToProps, mapDispatchToProps)(Login);
export {LoginContainer};
