import React from 'react';
import { Link } from 'react-router';
import moment from 'moment'

const TaskItemStats = (props) => {
  const icon = `glyphicon glyphicon-${props.icon}`;
  return (
    <div className='task-item-stat'>
      <span className={icon} aria-hidden="true"></span>
      <span>{props.value}</span>
    </div>
  );
};

const TaskItemActions = (props) => {
  const task = props.task;
  if (task.get('completed_at')) {
    return (<div></div>);
  }

  return (
    <div className='task-item-actions'>
      <button
        className='btn btn-default btn-sm'
        onClick={props.onComplete}>
        <i className="material-icons">done</i>
      </button>
    </div>
  );
};

const TaskListItem = (props) => {
  const task = props.task;
  const project = props.project;
  const due = moment(task.get('due_date')).fromNow(true);
  const hours = task.get('hours_spent') + '/' + task.get('hours_predicted');
  let stats = [
    {icon: 'time', value: due},
    {icon: 'hourglass', value: hours},
  ];

  if (task.get('completed_at')) {
    stats.push({
      icon: 'check',
      value: moment(task.get('completed_at')).format('YYYY-MM-DD')
    });
  }

  return (
    <div className='task-list-item panel panel-default'>
      <div className='panel-body'>
        <div className='task-item-content'>
          <div className='task-item-name'>
            <Link to={`/tasks/${task.get('id')}`}>
              <strong>{project.get('name')}: </strong>
              <span>{task.get('name')}</span>
            </Link>
          </div>
          <TaskItemActions
            task={task}
            onComplete={() => props.onCompleteTask(task.get('id'))} />
        </div>
      </div>
      <div className='task-item-stats panel-footer'>
        {stats.map((stat, index) =>
          <TaskItemStats key={index} icon={stat.icon} value={stat.value} />
        )}
      </div>
    </div>
  );
};

export {TaskListItem};
