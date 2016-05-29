import React from 'react';
import {connect} from 'react-redux';
import {LoginContainer} from './login';
import {getProjects} from '../actions/api';
import {getUserAuth} from '../actions/user';

class Landing extends React.Component {
  constructor(props) {
    super(props);
    this.props.onLoad();
  }
  render() {
      if (this.props.userAuth) {
        return (
          <TimeslipsContainer />
        );
      } else {
        return (
          <LoginContainer />
        );
      }
  }
}

const mapStateToProps = (allState, props) => {
  const state = allState.reducer;
  return {
    projects: state.get('projects'),
    timeslips: state.get('timeslips'),
    userAuth: state.get('userAuth')
  };
};

const mapDispatchToProps = (dispatch, props) => {
  return {
    onLoad: () => {
      dispatch(getUserAuth());
    },
    onLoadProjects: () => {
      dispatch(getProjects());
    }
  }
};

const LandingContainer = connect(mapStateToProps, mapDispatchToProps)(Landing);
export {LandingContainer};
