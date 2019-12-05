import React from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import moment from 'moment';

import { Flex } from 'rebass';

import Heading from 'components/Heading';
import Filter from 'components/Filter';
import { BREAKPOINTS, Container, Grid, Cell } from 'components/Grid';
import TimeslipGrid from './timeslipgrid';
import TimeslipDateControls from './timeslipdatecontrols';
import Summary from './Summary';
import { Button } from 'components/GUI';
import { selectWithProject } from 'services/selectors';
import { fetchTimeslips, saveTimeslips } from 'services/timeslip';
import { fetchTasks } from 'services/task';

const Styled = styled.div`
  background: #f5f3f5;
  border-radius: 6px;
  box-shadow: 0 6px 4px hsla(0, 0%, 40%, 0.2);
  height: 100%;
  min-height: 400px;
  max-width: 1200px;
  width: 100%;

  display: flex;
  flex-wrap: wrap;

  @media (max-width: ${BREAKPOINTS.sm}) {
    flex-direction: column-reverse;
  }
`;

const getSummary = (timeslips, projects) => {
  const week = moment()
    .startOf('isoweek')
    .isoWeekday(1);
  const weekStart = week.format().substr(0, 10);
  const weekEnd = week
    .endOf('isoWeek')
    .format()
    .substr(0, 10);
  const month = moment().startOf('month');
  const monthStart = month.format().substr(0, 10);
  const monthEnd = month
    .endOf('month')
    .format()
    .substr(0, 10);
  const summary = {
    'This Week': { hours: 0, total: 0 },
    'This Month': { hours: 0, total: 0 },
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
      weekStart: moment()
        .startOf('isoweek')
        .isoWeekday(1),
      updatedTimeslips: {}, // keyed by project_date
      timeslips: [],
      selectedProjectId: null,
    };

    this.handleSetActiveDate = this.handleSetActiveDate.bind(this);
    this.handleSetHour = this.handleSetHour.bind(this);
    this.handleSave = this.handleSave.bind(this);
  }

  componentDidMount() {
    this.fetchData(null);
  }

  async loadTasks(project) {
    const { projects } = this.props;
    const response = await fetchTasks({
      project: project,
      sort: '-project__name',
      state: 'OPEN',
    });
    this.setState({
      tasks: selectWithProject(response.results, projects),
    });
  }

  async loadTimeslips(project) {
    const { weekStart } = this.state;
    const start = moment(weekStart).subtract(40, 'days');
    const end = moment(weekStart).add(7, 'days');
    const response = await fetchTimeslips({
      start: weekStart.format('YYYY-MM-DD'),
      end: end.format('YYYY-MM-DD'),
      project: project,
    });

    this.setState({
      timeslips: response.results,
    });
  }

  async fetchData(project) {
    this.loadTimeslips(project);
    this.loadTasks(project);
  }

  handleSetActiveDate(weekStart) {
    const { selectedProjectId } = this.state;
    this.setState({ weekStart }, () => this.loadTimeslips(selectedProjectId));
  }

  handleSelectProject = selectedProject => {
    this.setState({ selectedProjectId: selectedProject.value });
    this.fetchData(selectedProject.value);
  };

  handleSetHour(task, date, hours, timeslip) {
    const { updatedTimeslips } = this.state;
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
        },
      },
    });
  }

  async handleSave() {
    const { updatedTimeslips, timeslips } = this.state;
    const updated = await saveTimeslips(
      Object.values(updatedTimeslips).filter(({ hours }) => hours),
      timeslips
    );

    this.setState({
      timeslips: updated,
      updatedTimeslips: [],
    });
  }

  render() {
    const { weekStart, updatedTimeslips, timeslips, tasks } = this.state;
    const { projects } = this.props;
    const today = moment();
    const month = weekStart.format('MMMM Y');
    const displayTimeslips = timeslips.concat(Object.values(updatedTimeslips));
    const summary = getSummary(displayTimeslips, projects) || {};

    const projectOptions = [
      {
        value: null,
        label: 'All Projects',
      },
    ].concat(
      Object.values(projects)
        .filter(p => !p.archived)
        .map(p => ({
          value: p.id,
          label: p.name,
        }))
    );

    return (
      <React.Fragment>
        <Flex mb={12} alignItems="center" justifyContent="space-between">
          <Filter
            label="Project"
            options={projectOptions}
            onChange={this.handleSelectProject}
          />
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
            tasks={tasks || []}
            onHourChanged={this.handleSetHour}
            onSetActiveDate={this.handleSetActiveDate}
          />
          <Summary summary={summary} />
        </Styled>
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => {
  return {
    isLoading: false,
    projects: state.project.items,
  };
};

export default connect(
  mapStateToProps,
  {}
)(Timeslips);
