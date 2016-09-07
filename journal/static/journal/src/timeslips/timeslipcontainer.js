'use strict';
import React from 'react';
import {connect} from 'react-redux';
import moment from 'moment';

import * as timeslipActions from '../actions/timeslips';
import * as projectActions from '../actions/projects';
import * as selectors from './timeslipselectors';

import { TimeslipGrid } from './timeslipgrid';
import { TimeslipDateControls } from './timeslipdatecontrols';

import styles from './styles.css';

class Timeslips extends React.Component {
  componentDidMount() {
    this.fetchData();
  }

  fetchData() {
    this.props.fetchProjects().then(() => this.props.fetchTimeslips());
  }

  render() {
    const today = moment();

    if (this.props.projects.count()) {
      return (
        <div className='row'>
          <div className='col-sm-3'>
            <TimeslipDateControls
              today={today}
              activeDate={this.props.activeDate}
              onSetActiveDate={this.props.setActiveDate}
            />
          </div>

          <TimeslipGrid
            today={today}
            activeDate={this.props.activeDate}
            projects={this.props.projects}
            onHourChanged={this.props.updateTimeslipValue}
            onInvoice={this.props.onInvoice}
          />

          <div className='col-md-3'>
            <button
              onClick={() => {
                this.props.saveTimeslips(this.props.projects, this.props.timeslips)
              }}
              className='btn btn-success btn-block'
            >
              Save
            </button>
          </div>
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
