'use strict';
import React from 'react';
import {connect} from 'react-redux';

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
        <h2>{task.get('name')}</h2>
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
