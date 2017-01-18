'use strict';
import React from 'react';
import {connect} from 'react-redux';

import { TaskForm } from './taskform';
import * as taskActions from '../../actions/tasks';


class Task extends React.Component {
  componentDidMount() {
    if (!this.props.task) {
      this.props.fetchTasks(this.props.id);
    }
  }

  render() {
    const task = this.props.task;
    const projects = this.props.projects;
    const loading = (!task || task.isEmpty() || projects.isEmpty());

    if (loading) {
      return (<div>Loading</div>);
    }

    let saveTask = (form) => {
      // TODO if add, call different function
      this.props.updateTask(task.get('id'), form);
    };

    return (
      <div className='row'>
        <div className='col-md-12'>
          <TaskForm
            isEdit={true}
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
  ...taskActions
};

const TaskContainer = connect(mapStateToProps, actions)(Task);
export {TaskContainer};
