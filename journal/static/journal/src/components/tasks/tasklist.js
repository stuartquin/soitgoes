import React from 'react';
import { TaskListItem } from './tasklistitem';

const TaskList = (props) => {
  return (
    <div className='task-list'>
      {props.tasks.map(task => (
        <TaskListItem
          key={task.get('id')}
          project={props.projects.get(`${task.get('project')}`)}
          onComplete={props.onCompleteTask}
          task={task} />
      ))}
    </div>
  );
};

export {TaskList};
