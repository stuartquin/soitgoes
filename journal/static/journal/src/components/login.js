import React from 'react';
import {connect} from 'react-redux';

import {LoginForm} from './loginform';
import {setUserAuth} from '../actions/user';

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
      dispatch(setUserAuth(fields));
    }
  }
};

const LoginContainer = connect(mapStateToProps, mapDispatchToProps)(Login);
export {LoginContainer};
