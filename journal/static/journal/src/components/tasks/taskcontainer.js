'use strict';
import React from 'react';
import {connect} from 'react-redux';

import { TaskForm } from './taskform';
import {fetchTasks, updateTask, addTask} from 'modules/task';
import {navigate} from 'modules/nav';


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

    const saveTask = (form) => {
      if (isEdit) {
        return this.props.updateTask(task.get('id'), form);
      } else {
        return this.props.addTask(form).then(() =>
          this.props.navigate('/tasks')
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

const mapStateToProps = (state, { match }) => {
  const params = match.params;
  return {
    task: state.tasks.items.get(parseInt(params.id, 10)),
    projects: state.projects.items,
    id: params.id
  };
};

const actions = {
  fetchTasks,
  updateTask,
  addTask,
  navigate
};

const TaskContainer = connect(mapStateToProps, actions)(Task);
export {TaskContainer};
