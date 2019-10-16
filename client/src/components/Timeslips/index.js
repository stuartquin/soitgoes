import React from 'react';
import styled from 'styled-components';
import {connect} from 'react-redux';
import moment from 'moment';

import { Flex } from 'rebass';

import {fetchTimeslips, saveTimeslips} from 'modules/timeslip';
import NavMenu from 'components/nav/navmenu';
import Heading from 'components/Heading';
import {BREAKPOINTS, Container, Grid, Cell} from 'components/Grid';
import TimeslipGrid from './timeslipgrid';
import TimeslipDateControls from './timeslipdatecontrols';
import Summary from './Summary';
import {Loading} from '../loading';
import {fetchTasks} from 'modules/task';
import {Button} from 'components/GUI';
import {selectJoinedResults} from 'services/selectors';

const Styled = styled.div`
  background: #f5f3f5;
  border-radius: 6px;
  box-shadow: 0 6px 4px hsla(0,0%,40%,.2);
  height: 100%;
  max-width: 1200px;
  width: 100%;

  display: flex;
  flex-wrap: wrap;

  @media(max-width: ${BREAKPOINTS.sm}) {
    flex-direction: column-reverse;
  }
`;

const getSummary = (timeslips, projects) => {
  const week = moment().startOf('isoweek').isoWeekday(1);
  const weekStart = week.format().substr(0, 10);
  const weekEnd = week.endOf('isoWeek').format().substr(0, 10);
  const month = moment().startOf('month');
  const monthStart = month.format().substr(0, 10);
  const monthEnd = month.endOf('month').format().substr(0, 10);
  const summary = {
    'This Week': {hours: 0, total: 0},
    'This Month': {hours: 0, total: 0},
  };

  timeslips.forEach(timeslip => {
    const rate = projects[timeslip.project].hourly_rate;

    if (timeslip.date >= weekStart && timeslip.date <= weekEnd) {
      summary['This Week'] = {
        hours: summary['This Week'].hours + timeslip.hours,
        total: summary['This Week'].total + timeslip.hours * rate,
      };
    }

    if (timeslip.date >= monthStart && timeslip.date <= monthEnd) {
      summary['This Month'] = {
        hours: summary['This Month'].hours + timeslip.hours,
        total: summary['This Month'].total + timeslip.hours * rate,
      };
    }
  });

  return summary;
};

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

    this.props.fetchTasks();
    this.props.fetchTimeslips(
      null, weekStart.format('YYYY-MM-DD'), end.format('YYYY-MM-DD')
    )
  }

  handleSetActiveDate(weekStart) {
    this.setState({weekStart}, () => this.fetchData());
  }

  handleSetHour(task, date, hours, timeslip) {
    const {updatedTimeslips} = this.state;
    const isUpdated = Boolean(timeslip);
    const key = `${task.id}_${date}`;

    this.setState({
      updatedTimeslips: {
        ...updatedTimeslips,
        [key]: {
          task: task.id,
          project: task.project.id,
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
      Object.values(updatedTimeslips).filter(({ hours }) => hours)
    ).then(() => {
      this.setState({updatedTimeslips: []});
    });
  }

  render() {
    const {weekStart, updatedTimeslips} = this.state;
    const {user, timeslips, projects, tasks} = this.props;
    const today = moment();
    const month = weekStart.format('MMMM Y');
    const displayTimeslips = timeslips.concat(Object.values(updatedTimeslips));
    const summary = getSummary(displayTimeslips, projects) || {};

    return (
      <React.Fragment>
        <NavMenu />
        <Container>
          <Flex mb={12} alignItems="flex-start" justifyContent="flex-end">
            <Button type="success" onClick={this.handleSave}>
              Save
            </Button>
          </Flex>
          <Styled>
            <TimeslipGrid
              today={today}
              isLoading={this.props.isLoading}
              weekStart={weekStart}
              timeslips={displayTimeslips}
              projects={projects}
              tasks={tasks}
              onHourChanged={this.handleSetHour}
              onSetActiveDate={this.handleSetActiveDate}
            />
            <Summary summary={summary} />
          </Styled>
        </Container>
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isSaving: false,
    isLoading: false,
    timeslips: Object.values(state.timeslip.items),
    tasks: selectJoinedResults(state.task.items, state, state.task.results),
    projects: state.project.items,
    user: state.user.user
  };
};

const actions = {
  fetchTimeslips,
  saveTimeslips,
  fetchTasks,
};

export default connect(mapStateToProps, actions)(Timeslips);
