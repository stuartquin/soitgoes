import React from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import moment from 'moment';

import { Button, Flex } from 'rebass/styled-components';

import Task from 'components/Task';
import Heading from 'components/Heading';
import Filter from 'components/Filter';
import { BREAKPOINTS, Container, Grid, Cell } from 'components/Grid';
import TimeslipGrid from './timeslipgrid';
import TimeslipDateControls from './timeslipdatecontrols';
import Summary from './Summary';
import { selectWithProject } from 'services/selectors';
import { fetchTimeslips, saveTimeslips } from 'services/timeslip';
import { fetchTasks } from 'services/task';
import { fetchUpcoming } from 'services/invoice';

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
      newTask: null,
      upcoming: [],
    };
  }

  componentDidMount() {
    this.fetchData(null);
  }

  async loadTasks(project) {
    const { projects } = this.props;
    const response = await fetchTasks({
      project: project,
      sort: '-id',
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

  async loadUpcoming() {
    const response = await fetchUpcoming();
    const { projects } = this.props;
    this.setState({
      upcoming: selectWithProject(response.results, projects),
    });
  }

  async fetchData(project) {
    this.loadTimeslips(project);
    this.loadTasks(project);
    this.loadUpcoming();
  }

  handleNewTask = () => {
    this.loadTasks(null);
    this.setState({ newTask: null });
  };

  handleSetActiveDate = weekStart => {
    const { selectedProjectId } = this.state;
    this.setState({ weekStart }, () => this.loadTimeslips(selectedProjectId));
  };

  handleSelectProject = selectedProject => {
    console.log(selectedProject);
    this.setState({ selectedProjectId: selectedProject.value });
    this.fetchData(selectedProject.value);
  };

  handleSetHour = (task, date, hours, timeslip) => {
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
  };

  handleSave = async () => {
    const { updatedTimeslips, timeslips } = this.state;
    const updated = await saveTimeslips(
      Object.values(updatedTimeslips).filter(({ hours }) => hours),
      timeslips
    );

    this.setState({
      timeslips: updated,
      updatedTimeslips: [],
    });

    this.loadUpcoming();
  };

  render() {
    const {
      newTask,
      weekStart,
      updatedTimeslips,
      timeslips,
      tasks,
      upcoming,
    } = this.state;
    const { projects } = this.props;
    const today = moment();
    const month = weekStart.format('MMMM Y');
    const displayTimeslips = timeslips.concat(Object.values(updatedTimeslips));

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
        <Flex
          alignItems={['flex-end', 'center']}
          justifyContent="space-between"
          flexDirection={['column-reverse', 'row']}
        >
          <Filter
            label="Project"
            options={projectOptions}
            onChange={this.handleSelectProject}
            width={['100%', 'auto']}
            mb={12}
          />
          <Flex mb={12}>
            <Button
              mr={2}
              variant="primary"
              onClick={() => this.setState({ newTask: {} })}
            >
              New task
            </Button>

            <Button variant="success" onClick={this.handleSave}>
              Save
            </Button>
          </Flex>
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
          <Summary upcomingSummary={upcoming} />
        </Styled>
        {newTask && (
          <Task
            task={newTask}
            projects={projects}
            onCancel={() => this.setState({ newTask: null })}
            onSave={this.handleNewTask}
          />
        )}
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
