import React from 'react';
import {connect} from 'react-redux';

import { getProjects, getTimeslips, saveTimeslips, setActiveDate } from '../timeslips/timeslipactions';
import { createInvoice } from '../invoices/invoiceactions';
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
            activeDate={this.props.activeDate}
            projects={this.props.projects}
            onHourChanged={this.props.onHourChanged}
            onSetActiveDate={this.props.onSetActiveDate}
            onInvoice={this.props.onInvoice}
            />
          <button onClick={() => {
            this.props.onSave(this.props.projects, this.props.timeslips)
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
    activeDate: state.get('view').get('activeDate'),
    timeslips: state.get('items'),
    projects: getProjectsWithTimeslips(allState)
  };
};

const mapDispatchToProps = (dispatch, props) => {
  return {
    onSetActiveDate: (date) => {
      dispatch(setActiveDate(date));
    },
    onHourChanged: (project, date, hours) => {
      dispatch(updateProjectTimeslip(project, date, hours));
    },
    onInvoice: (project) => {
      dispatch(createInvoice(getUserAuth(), project));
    },
    onSave: (projects, timeslips) => {
      dispatch(saveTimeslips(getUserAuth(), projects, timeslips));
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
