'use strict';
import React from 'react';
import {connect} from 'react-redux';

import { TaskFormContainer } from './taskform';
import * as taskActions from '../../actions/tasks';


class Task extends React.Component {
  componentDidMount() {
    if (!this.props.task) {
      this.props.fetchTasks(this.props.id);
    }
  }

  render() {
    const task = this.props.task;
    const loading = (!task || task.isEmpty());

    if (loading) {
      return (<div>Loading</div>);
    }

    return (
      <div className='row'>
        <div className='col-md-12'>
          <TaskFormContainer
            isEdit={true}
            task={task} />
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, { params }) => {
  return {
    task: state.tasks.items.get(parseInt(params.id, 10)),
    id: params.id
  };
};

const actions = {
  ...taskActions
};

const TaskContainer = connect(mapStateToProps, actions)(Task);
export {TaskContainer};
