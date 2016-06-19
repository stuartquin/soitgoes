'use strict';
import React from 'react';
import {connect} from 'react-redux';

import * as timeslipActions from '../actions/timeslips';
import * as projectActions from '../actions/projects';
import * as selectors from './timeslipselectors';

import { TimeslipGrid } from './timeslipgrid';

import styles from './styles.css';

class Timeslips extends React.Component {
  componentDidMount() {
    this.fetchData();
  }

  fetchData() {
    this.props.fetchProjects().then(() => this.props.fetchTimeslips());
  }

  render() {
    if (this.props.projects.count()) {
      return (
        <div className={styles.timeslipContainer}>
          <TimeslipGrid
            activeDate={this.props.activeDate}
            projects={this.props.projects}
            onHourChanged={this.props.updateTimeslipValue}
            onSetActiveDate={this.props.setActiveDate}
            onInvoice={this.props.onInvoice}
          />
          <button onClick={() => {
            this.props.saveTimeslips(this.props.projects, this.props.timeslips)
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
    timeslips: selectors.getTimeslips(allState),
    projects: selectors.getProjectsWithTimeslips(allState)
  };
};

const actions = {
  ...projectActions,  // eslint-disable-line
  ...timeslipActions  // eslint-disable-line
};

const TimeslipsContainer = connect(mapStateToProps, actions)(Timeslips);
export {TimeslipsContainer};
