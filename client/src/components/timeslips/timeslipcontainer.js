'use strict';
import React from 'react';
import {connect} from 'react-redux';
import moment from 'moment';

import Button from 'components/Button';

import { TimeslipGrid } from './timeslipgrid';
import { TimeslipDateControls } from './timeslipdatecontrols';
import { Loading } from '../loading';
import {
  fetchTimeslips, saveTimeslips, hourChanged, setActiveDate
} from 'modules/timeslip';


class Timeslips extends React.Component {
  componentDidMount() {
    this.fetchData();
  }

  fetchData() {
    const start = this.props.weekStart;
    const end = moment(start).add(7, 'days');

    this.props.fetchTimeslips(null, start, end)
  }

  render() {
    const today = moment();
    const user = this.props.user;
    const timeslips = Object.values(this.props.timeslips);
    const month = this.props.weekStart.format('MMMM Y');

    if (this.props.projects) {
      return (
      <div className='content'>
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
        <div className='timeslip-actions'>
          <TimeslipDateControls
            today={today}
            month={month}
            activeDate={this.props.weekStart}
            isLoading={this.props.isLoading}
            onSetActiveDate={this.props.setActiveDate}
          />
          <Button
            onClick={() => {
              this.props.saveTimeslips(timeslips)
            }}
            label='Save'
            className='btn-success'
            disabled={this.props.isSaving}
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
    timeslips: state.timeslips.items,
    projects: state.projects.items,
    user: state.user.user
  };
};

const actions = {
  fetchTimeslips,
  saveTimeslips,
  hourChanged,
  setActiveDate
};

const TimeslipsContainer = connect(mapStateToProps, actions)(Timeslips);
export {TimeslipsContainer};
