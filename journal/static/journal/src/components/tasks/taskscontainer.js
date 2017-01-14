'use strict';
import React from 'react';
import {connect} from 'react-redux';

import * as taskActions from '../../actions/tasks';


class Tasks extends React.Component {
  componentDidMount() {
    this.props.fetchTasks();
  }

  render() {
    if (this.props.tasks.isEmpty()) {
      return (<div>Loading</div>);
    }

    return (
      <div className='row'>
        <div className='col-md-4'>
        </div>
        <div className='col-md-8'>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, { params }) => {
  return {
    tasks: state.tasks.items
  };
};

const actions = {
  ...taskActions
};

const TasksContainer = connect(mapStateToProps, actions)(Tasks);
export {TasksContainer};
