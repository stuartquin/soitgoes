import React from 'react';
import { TaskListItem } from './tasklistitem';
import {Table, TableBody} from 'material-ui/Table';

const TaskList = (props) => {
  return (
    <Table className='task-list table'>
      <TableBody>
      {props.tasks.map(task => (
        <TaskListItem
          key={task.get('id')}
          project={props.projects.get(task.get('project'))}
          onComplete={props.onCompleteTask}
          task={task} />
      ))}
      </TableBody>
    </Table>
  );
};

export {TaskList};
