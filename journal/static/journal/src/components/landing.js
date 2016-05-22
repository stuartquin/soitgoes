import React from 'react';
import {connect} from 'react-redux';
import {TimeslipsContainer} from './timeslips';
import {getProjects, getTimeslips} from '../actions/api';

class Landing extends React.Component {
  constructor(props) {
    super(props);
    this.props.onLoadProjects();
  }
  render() {
      if (this.props.projects.count()) {
        return (
          <TimeslipsContainer />
        );
      } else {
        return (<p>Loading Projects...</p>);
      }
  }
}

const mapStateToProps = (state, props) => {
  return {
    projects: state.get('projects'),
    timeslips: state.get('timeslips')
  };
};

const mapDispatchToProps = (dispatch, props) => {
  return {
    onLoadProjects: () => {
      dispatch(getProjects());
    }
  }
};

const LandingContainer = connect(mapStateToProps, mapDispatchToProps)(Landing);
export {LandingContainer};
