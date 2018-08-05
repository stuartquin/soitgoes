import React from 'react';
import { Link } from 'react-router-dom';
import moment from 'moment'

import {TableRow, TableRowColumn} from 'material-ui/Table';
import IconButton from 'material-ui/IconButton';
import ActionDone from 'material-ui/svg-icons/action/done';

import {StateChip} from './state-chip';

const TaskItemActions = (props) => {
  const task = props.task;
  if (task.get('completed_at')) {
    return (<div></div>);
  }

  return (
    <IconButton
      touch={true}
      tooltipPosition='bottom-center'
      className='btn-default icon-btn-right'
      onTouchTap={props.onComplete}>
      <ActionDone />
    </IconButton>
  );
};

const TaskListItem = (props) => {
  const task = props.task;
  const project = props.project;
  const hours = task.get('hours_spent') + '/' + task.get('hours_predicted');
  return (
    <TableRow className='task-list-row'>
      <TableRowColumn className='task-item-name'>
        <Link to={`/tasks/${task.get('id')}`}>{task.get('name')}</Link>
        <span className='text-muted'>{project.get('name')}</span>
      </TableRowColumn>
      <TableRowColumn className='col-number col-right'>
        {hours}
      </TableRowColumn>
      <TableRowColumn className='col-state col-right'>
        <StateChip
          task={task}
        />
      </TableRowColumn>
      <TableRowColumn className='col-actions'>
        <TaskItemActions
          task={task}
          onComplete={() => props.onComplete(task.get('id'))} />
      </TableRowColumn>
    </TableRow>
  );
};

export {TaskListItem};
