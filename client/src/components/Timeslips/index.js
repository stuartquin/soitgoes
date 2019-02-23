import React from 'react';
import {connect} from 'react-redux';
import moment from 'moment';

import Button from 'components/Button';
import NavMenu from 'components/nav/navmenu';

import { TimeslipGrid } from './timeslipgrid';
import { TimeslipDateControls } from './timeslipdatecontrols';
import { Loading } from '../loading';
import {
  fetchTimeslips, saveTimeslips
} from 'modules/timeslip';


class Timeslips extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      weekStart: moment().startOf('isoweek').isoWeekday(1),
      updatedTimeslips: {}, // keyed by project_date
    };

    this.handleSetActiveDate = this.handleSetActiveDate.bind(this);
    this.handleSetHour = this.handleSetHour.bind(this);
    this.handleSave = this.handleSave.bind(this);
  }

  componentDidMount() {
    this.fetchData();
  }

  fetchData() {
    const {weekStart} = this.state;
    const end = moment(weekStart).add(7, 'days');

    this.props.fetchTimeslips(
      null, weekStart.format('YYYY-MM-DD'), end.format('YYYY-MM-DD')
    )
  }

  handleSetActiveDate(weekStart) {
    this.setState({weekStart}, () => this.fetchData());
  }

  handleSetHour(project, date, hours, timeslip) {
    const {updatedTimeslips} = this.state;
    const isUpdated = Boolean(timeslip);
    const key = `${project.id}_${date}`;

    this.setState({
      updatedTimeslips: {
        ...updatedTimeslips,
        [key]: {
          project: project.id,
          isNew: !isUpdated,
          id: isUpdated ? timeslip.id : null,
          isUpdated,
          hours,
          date,
        }
      }
    });
  }

  handleSave() {
    const {saveTimeslips, timeslips} = this.props;
    const {updatedTimeslips} = this.state;

    saveTimeslips(
      timeslips.concat(Object.values(updatedTimeslips))
    ).then(() => {
      this.setState({updatedTimeslips: []});
    });
  }

  render() {
    const {weekStart, updatedTimeslips} = this.state;
    const {user, timeslips, projects} = this.props;
    const today = moment();
    const month = weekStart.format('MMMM Y');
    const displayTimeslips = timeslips.concat(Object.values(updatedTimeslips));

    if (this.props.projects) {
      return (
        <React.Fragment>
          <NavMenu />
          <TimeslipGrid
            today={today}
            isLoading={this.props.isLoading}
            weekStart={weekStart}
            timeslips={displayTimeslips}
            projects={projects}
            onHourChanged={this.handleSetHour}
            onInvoice={this.props.onInvoice}
          />
          <div className='timeslip-actions'>
            <TimeslipDateControls
              today={today}
              month={month}
              weekStart={weekStart}
              isLoading={this.props.isLoading}
              onSetActiveDate={this.handleSetActiveDate}
            />
            <Button
              onClick={this.handleSave}
              label='Save'
              className='btn-success'
              disabled={this.props.isSaving}
            />
          </div>
        </React.Fragment>
      );
    } else {
      return (<p>No Timeslips</p>);
    }
  }
}

const mapStateToProps = (state) => {
  return {
    weekStart: moment(),
    isSaving: false,
    isLoading: false,
    timeslips: Object.values(state.timeslip.items),
    projects: state.project.items,
    user: state.user.user
  };
};

const actions = {
  fetchTimeslips,
  saveTimeslips,
};

export default connect(mapStateToProps, actions)(Timeslips);
