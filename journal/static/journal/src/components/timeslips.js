import React from 'react';
import {connect} from 'react-redux';
import {getTimeslips} from '../actions/api';

import {TimeslipGrid} from './timeslipgrid'

const getProjectsWithTimeslips = (projects, timeslips) => {
  return projects.map((p) => {
    return p.set('timeslips', timeslips.filter((t) => {
      return t.get('project') === p.get('id');
    }));
  });
};

class Timeslips extends React.Component {
  constructor(props) {
    super(props);
    this.props.onLoad(1);
  }
  render() {
    if (this.props.projects.count()) {
      return (
        <TimeslipGrid
          projects={getProjectsWithTimeslips(this.props.projects, this.props.timeslips)} />
      );
    } else {
      return (<p>No Timeslips</p>);
    }
  }
}

const mapStateToProps = (state, props) => {
  return {
    timeslips: state.get('timeslips'),
    projects: state.get('projects')
  };
};

const mapDispatchToProps = (dispatch, props) => {
  return {
      onLoad: () => {
        dispatch(getTimeslips());
      }
  }
};

const TimeslipsContainer = connect(mapStateToProps, mapDispatchToProps)(Timeslips);
export {TimeslipsContainer};
