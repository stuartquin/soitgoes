import React from 'react';
import {connect} from 'react-redux';

import { getProjects, getTimeslips } from '../actions/api';
import { updateProjectTimeslip } from '../actions/projects';
import { getUserAuth } from '../services/user';

import { TimeslipGrid } from './timeslipgrid'

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
    this.props.onLoad(getUserAuth());
  }
  render() {
    if (this.props.projects.count()) {
      return (
        <TimeslipGrid
          projects={getProjectsWithTimeslips(this.props.projects, this.props.timeslips)}
          onHourChanged={this.props.onHourChanged}
          />
      );
    } else {
      return (<p>No Timeslips</p>);
    }
  }
}

const mapStateToProps = (allState, props) => {
  const state = allState.reducer;
  return {
    timeslips: state.get('timeslips'),
    projects: state.get('projects')
  };
};

const mapDispatchToProps = (dispatch, props) => {
  return {
    onHourChanged: (project, date, hours) => {
      dispatch(updateProjectTimeslip(project, date, hours));
    },
    onLoad: (auth) => {
      dispatch(getProjects(auth)).then(() => {
        dispatch(getTimeslips(auth));
      });
    }
  }
};

const TimeslipsContainer = connect(mapStateToProps, mapDispatchToProps)(Timeslips);
export {TimeslipsContainer};
