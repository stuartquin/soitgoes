'use strict';
import React from 'react';
import {connect} from 'react-redux';
import moment from 'moment';

import * as timeslipActions from '../../actions/timeslips';
import * as projectActions from '../../actions/projects';

import { TimeslipGrid } from './timeslipgrid';
import { TimeslipDateControls } from './timeslipdatecontrols';
import { LoadingButton } from '../../components/loadingbutton';

import styles from './styles.css';

class Timeslips extends React.Component {
  componentDidMount() {
    this.fetchData();
  }

  fetchData() {
    const start = this.props.weekStart;
    const end = moment(start).add(7, 'days');

    this.props.fetchTimeslips(null, start, end).then(() =>
      this.props.fetchProjects()
    );
  }

  render() {
    const today = moment();
    const user = this.props.user;
    const existingTimeslips = this.props.timeslips.toList();
    const newTimeslips = this.props.newTimeslips.toList();
    const timeslips = existingTimeslips.concat(newTimeslips);

    if (this.props.projects) {
      return (
        <div className='row'>
          <div className='col-sm-3'>
            <TimeslipDateControls
              today={today}
              activeDate={this.props.weekStart}
              isLoading={this.props.isLoading}
              onSetActiveDate={this.props.setActiveDate}
            />
          </div>

          <TimeslipGrid
            today={today}
            isLoading={this.props.isLoading}
            weekStart={this.props.weekStart}
            timeslips={timeslips}
            projects={this.props.projects}
            onHourChanged={(project, date, hours, timeslip) => {
              this.props.hourChanged(project, date, hours, user, timeslip);
            }}
            onInvoice={this.props.onInvoice}
          />

          <div className='col-md-3'>
            <LoadingButton
              onClick={() => {
                this.props.saveTimeslips(existingTimeslips, newTimeslips)
              }}
              className='btn btn-success btn-block btn-raised'
              text='Save'
              isLoading={this.props.isSaving}
            />
          </div>
        </div>
      );
    } else {
      return (<p>No Timeslips</p>);
    }
  }
}

const mapStateToProps = (state, props) => {
  return {
    weekStart: state.timeslips.view.get('weekStart'),
    isSaving: state.timeslips.view.get('isSaving'),
    isLoading: state.timeslips.view.get('isLoading'),
    newTimeslips: state.timeslips.view.get('toAdd'),
    timeslips: state.timeslips.items,
    projects: state.projects.items,
    user: state.user.user
  };
};

const actions = {
  ...projectActions,  // eslint-disable-line
  ...timeslipActions  // eslint-disable-line
};

const TimeslipsContainer = connect(mapStateToProps, actions)(Timeslips);
export {TimeslipsContainer};
