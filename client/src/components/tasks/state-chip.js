import React from 'react';
import moment from 'moment';

const StateChip = (props) => {
  const task = props.task;
  const dueDate = task.get('due_date');
  const completeDate = task.get('completed_at');
  const today = moment();

  let text = '';
  let classNames = ['state-label'];

  if (!dueDate) {
    classNames.push('state-label-default');
    text = 'Draft';
  } else {
    if (completeDate) {
      classNames.push('state-label-success');
      text = moment(completeDate).format('YYYY-MM-DD');
    } else {
      const due = moment(dueDate);
      if (due.isBefore(today)) {
        classNames.push('state-label-error');
        text = due.fromNow(true);
      } else {
        classNames.push('state-label-warn');
        text = due.toNow(true);
      }
    }
  }

  return (
    <span className={classNames.join(' ')}>
      <span className="state-label-icon"></span>
      <span className="state-label-text">{text}</span>
    </span>
  );
};

export { StateChip };
