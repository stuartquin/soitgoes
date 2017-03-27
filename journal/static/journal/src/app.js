import React from 'react';
import { Route } from 'react-router-dom'
import { connect } from 'react-redux';

import { Login } from 'components/login/login';
import { NavContainer } from 'components/nav/navcontainer';
import { TimeslipsContainer } from 'components/timeslips/timeslipcontainer';

import * as userActions from './actions/user';


const isLoggedIn = () => {
  return window.GLOBAL_IS_AUTHENTICATED;
};

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedIn: isLoggedIn()
    };
  }

  componentDidMount() {
    this.setState({loggedIn: isLoggedIn()});
  }

  render() {
    if (this.state.loggedIn) {
      return (<Route component={NavContainer} />);
    } else {
      return (
        <Login
          loginState={this.props.loginState}
          onSubmit={(form) =>
            this.props.login(form)
          }
        />
      );
    }
  }
}

const mapStateToProps = (state, props) => {
  return {
    loginState: state.user.login
  };
};

const actions = {
  ...userActions,
};

const AppContainer = connect(mapStateToProps, actions)(App);
export { AppContainer };
