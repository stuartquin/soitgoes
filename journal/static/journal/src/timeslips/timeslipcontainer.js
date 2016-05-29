import React from 'react';
import {connect} from 'react-redux';

import { getProjects, getTimeslips, saveTimeslips } from '../timeslips/timeslipactions';
import { updateProjectTimeslip } from '../actions/projects';
import { getUserAuth } from '../services/user';

import { TimeslipGrid } from './timeslipgrid'

import { getProjectsWithTimeslips } from './timeslipselectors';

class Timeslips extends React.Component {
  constructor(props) {
    super(props);
    this.props.onLoad(getUserAuth());
  }
  render() {
    if (this.props.projects.count()) {
      return (
        <div>
          <TimeslipGrid
            projects={this.props.projects}
            onHourChanged={this.props.onHourChanged}
            />
          <button onClick={() => {
            this.props.onSave(getUserAuth(), this.props.projects, this.props.timeslips)
          }}>
            Save
          </button>
        </div>
      );
    } else {
      return (<p>No Timeslips</p>);
    }
  }
}

const mapStateToProps = (allState, props) => {
  const state = allState.timeslips;
  return {
    timeslips: state.get('items'),
    projects: getProjectsWithTimeslips(allState)
  };
};

const mapDispatchToProps = (dispatch, props) => {
  return {
    onHourChanged: (project, date, hours) => {
      dispatch(updateProjectTimeslip(project, date, hours));
    },
    onSave: (auth, projects, timeslips) => {
      dispatch(saveTimeslips(auth, projects, timeslips));
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
