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
            timeslips={this.props.timeslips}
            projects={this.props.projects}
            onHourChanged={this.props.updateTimeslipValue}
            onInvoice={this.props.onInvoice}
          />

          <div className='col-md-3'>
            <LoadingButton
              onClick={() => {
                this.props.saveTimeslips(this.props.projects, this.props.timeslips)
              }}
              className='btn btn-success btn-block'
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
    timeslips: state.timeslips.items,
    projects: state.projects.get('items')
  };
};

const actions = {
  ...projectActions,  // eslint-disable-line
  ...timeslipActions  // eslint-disable-line
};

const TimeslipsContainer = connect(mapStateToProps, actions)(Timeslips);
export {TimeslipsContainer};
