import React from 'react';
import moment from 'moment';

// How many days to jump
const DAY_OFFSET = 7;


const TimeslipDateControls = (props) => {
  const disabled = props.activeDate.isSame(props.today, 'isoweek') ? 'disabled' : '';

  return (
    <div>
      <button
        className='btn btn-default btn-raised'
        disabled={disabled}
        onClick={() => {
          const start = moment().startOf('isoweek').isoWeekday(1);
          const end = moment(start).add(DAY_OFFSET, 'days');
          props.onSetActiveDate(start, end);
        }}>Today</button>
      <button 
        className='btn btn-default btn-raised'
        onClick={() => {
          const start = moment(props.activeDate).subtract(DAY_OFFSET, 'days');
          const end = moment(start).add(DAY_OFFSET, 'days');
          props.onSetActiveDate(start, end);
        }}>&lt;</button>
      <button
        className='btn btn-default btn-raised'
        onClick={() => {
          const start = moment(props.activeDate).add(DAY_OFFSET, 'days');
          const end = moment(start).add(DAY_OFFSET, 'days');
          props.onSetActiveDate(start, end);
        }}>&gt;</button>
    </div>
  );
};

export {TimeslipDateControls};
