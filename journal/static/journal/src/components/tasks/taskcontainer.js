'use strict';
import React from 'react';
import {connect} from 'react-redux';
import { browserHistory } from 'react-router';

import { TaskForm } from './taskform';
import {fetchTasks, updateTask, addTask} from 'modules/task';


class Task extends React.Component {
  componentDidMount() {
    if (!this.props.task && this.props.id !== 'add') {
      this.props.fetchTasks(this.props.id);
    }
  }

  render() {
    const task = this.props.task;
    const projects = this.props.projects;
    const isEdit = this.props.id !== 'add';
    const loading = (isEdit && (!task || task.isEmpty()));

    if (loading) {
      return (<div>Loading</div>);
    }

    let saveTask = (form) => {
      if (isEdit) {
        return this.props.updateTask(task.get('id'), form);
      } else {
        return this.props.addTask(form).then(() =>
          browserHistory.push('/tasks')
        );
      }
    };

    return (
      <div className='task-container'>
        <div className='header'>
        </div>
        <div className='content'>
          <TaskForm
            isEdit={isEdit}
            task={task}
            projects={projects}
            onSave={(form) => saveTask(form)} />
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, { params }) => {
  return {
    task: state.tasks.items.get(parseInt(params.id, 10)),
    projects: state.projects.items,
    id: params.id
  };
};

const actions = {
  fetchTasks,
  updateTask,
  addTask
};

const TaskContainer = connect(mapStateToProps, actions)(Task);
export {TaskContainer};
