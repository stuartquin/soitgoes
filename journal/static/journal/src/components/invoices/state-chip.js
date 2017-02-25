'use strict';
import React from 'react';
import moment from 'moment';


const StateChip = (props) => {
  const invoice = props.invoice;
  const issued = invoice.get('issued_at');
  const today = moment();

  let text = '';
  let classNames = [
    'state-label'
  ];

  if (!issued) {
    classNames.push('state-label-default');
    text = 'Draft';
  } else {
    if (invoice.get('paid_at')) {
      classNames.push('state-label-success');
      text = moment(invoice.get('paid_at')).format('YYYY-MM-DD');
    } else {
      const dueDate = moment(invoice.get('due_date'));
      if (dueDate.isBefore(today)) {
        classNames.push('state-label-error');
        text = dueDate.fromNow(true)
      } else {
        classNames.push('state-label-warn');
        text = dueDate.toNow(true)
      }
    }
  }

  return (
    <span className={classNames.join(' ')}>
      <span className='state-label-icon'>
      </span>
      <span className='state-label-text'>
        {text}
      </span>
    </span>
  );
};

export {StateChip};
