'use strict';
import React from 'react';
import { Link } from 'react-router';
import {connect} from 'react-redux';

import { TaskList } from './tasklist';

import * as taskActions from '../../actions/tasks';


class Tasks extends React.Component {
  componentDidMount() {
    this.props.fetchTasks();
  }

  render() {
    const loading = (
      this.props.projects.isEmpty()
    );

    if (loading) {
      return (<div>Loading</div>);
    }

    return (
      <div>
        <div className='row'>
          <div className='col-md-12'>
            <Link to={`/tasks/add`}>
              New Task
            </Link>
          </div>
        </div>
        <div className='row'>
          <div className='col-md-12'>
            <TaskList
              tasks={this.props.tasks}
              projects={this.props.projects}
              onCompleteTask={(id) => this.props.completeTask(id)}
            />
          </div>
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
