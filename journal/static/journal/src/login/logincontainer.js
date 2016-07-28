import React from 'react';
import {connect} from 'react-redux';

import { LoginForm } from './loginform';
import * as actions from '../actions/session';

class Login extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <LoginForm
        onSubmit={
          (fields) =>
            this.props.createSession(fields.username, fields.password)
        }
      />
    );
  }
}

const mapStateToProps = () => {
  return {
  };
};

const LoginContainer = connect(mapStateToProps, actions)(Login);
export {LoginContainer};
