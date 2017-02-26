'use strict';
import React from 'react';
import {connect} from 'react-redux';
import { browserHistory } from 'react-router';

import {Card, CardText} from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';

import { TaskList } from './tasklist';
import * as taskActions from '../../actions/tasks';


class Tasks extends React.Component {
  componentDidMount() {
    this.props.fetchTasks();
  }

  render() {
    const projects = this.props.projects;
    const tasks = this.props.tasks;
    const openTasks = tasks.filter((task) => {
      return task.get('completed_at') === null;
    });
    const closedTasks = tasks.filter((task) => {
      return task.get('completed_at') !== null;
    });

    return (
      <div className='tasks-container'>
        <div className='content'>
          <div className='content-actions'>
            <RaisedButton
              className='btn-success'
              label='Create New'
              labelPosition='before'
              onTouchTap={(evt) => {
                browserHistory.push('/tasks/add');
              }}
            />
          </div>

          <Card>
            <CardText>
              <h3>Open Tasks ({openTasks.size})</h3>
              <TaskList
                tasks={openTasks}
                projects={projects}
                onCompleteTask={(id) => this.props.completeTask(id)}
              />
              <h3>Complete Tasks ({closedTasks.size})</h3>
              <TaskList
                tasks={closedTasks}
                projects={projects}
                onCompleteTask={(id) => this.props.completeTask(id)}
              />
            </CardText>
          </Card>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, { params }) => {
  return {
    tasks: state.tasks.items,
    projects: state.projects.items
  };
};

const actions = {
  ...taskActions
};

const TasksContainer = connect(mapStateToProps, actions)(Tasks);
export {TasksContainer};
