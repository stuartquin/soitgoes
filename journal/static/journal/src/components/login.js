import React from 'react';
import {connect} from 'react-redux';

import {LoginForm} from './loginform';

class Login extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <LoginForm />
    );
  }
}

const mapStateToProps = (state, props) => {
  return {
  };
};

const mapDispatchToProps = (dispatch, props) => {
  return {
  }
};

const LoginContainer = connect(mapStateToProps, mapDispatchToProps)(Login);
export {LoginContainer};
