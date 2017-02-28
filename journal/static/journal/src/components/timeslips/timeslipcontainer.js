'use strict';
import React from 'react';
import {connect} from 'react-redux';
import moment from 'moment';

import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';

import * as timeslipActions from '../../actions/timeslips';
import * as projectActions from '../../actions/projects';

import { TimeslipGrid } from './timeslipgrid';
import { TimeslipDateControls } from './timeslipdatecontrols';
import { Loading } from '../loading';


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
    const month = this.props.weekStart.format('MMMM Y');

    if (this.props.projects) {
      return (
        <div className='content'>
          <Card className='timeslip-container'>
            <CardHeader
              title='Time'
              subtitle={month} />
            <CardText>
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
            </CardText>
            <CardActions className='timeslip-actions'>
              <TimeslipDateControls
                today={today}
                month={month}
                activeDate={this.props.weekStart}
                isLoading={this.props.isLoading}
                onSetActiveDate={this.props.setActiveDate}
              />
              <RaisedButton
                onTouchTap={() => {
                  this.props.saveTimeslips(existingTimeslips, newTimeslips)
                }}
                label='Save'
                className='btn-success'
                disabled={this.props.isSaving}
              />
            </CardActions>
          </Card>
        </div>
      );
    } else {
      return (<p>No Timeslips</p>);
    }
  }
}

const mapStateToProps = (state, props) => {
  let projects = state.projects.items;
  if (props.projects) {
    projects = props.projects;
  }
  return {
    weekStart: state.timeslips.view.get('weekStart'),
    isSaving: state.timeslips.view.get('isSaving'),
    isLoading: state.timeslips.view.get('isLoading'),
    newTimeslips: state.timeslips.view.get('toAdd'),
    timeslips: state.timeslips.items,
    projects: projects,
    user: state.user.user
  };
};

const actions = {
  ...projectActions,  // eslint-disable-line
  ...timeslipActions  // eslint-disable-line
};

const TimeslipsContainer = connect(mapStateToProps, actions)(Timeslips);
export {TimeslipsContainer};
