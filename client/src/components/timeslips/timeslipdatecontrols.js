import React from 'react';
import moment from 'moment';

import Button from 'components/Button';

// How many days to jump
const DAY_OFFSET = 7;


const TimeslipDateControls = (props) => {
  const disabled = props.activeDate.isSame(props.today, 'isoweek');

  return (
    <div className='timeslip-date-controls'>
      <Button
        className='btn-default date-control'
        label='<'
        onClick={() => {
          const start = moment(props.activeDate).subtract(DAY_OFFSET, 'days');
          const end = moment(start).add(DAY_OFFSET, 'days');
          props.onSetActiveDate(start, end);
        }}
      />
      <Button
        className='btn-default date-control'
        label='>'
        onClick={() => {
          const start = moment(props.activeDate).add(DAY_OFFSET, 'days');
          const end = moment(start).add(DAY_OFFSET, 'days');
          props.onSetActiveDate(start, end);
        }}
      />
      <Button
        className='btn-default'
        disabled={disabled}
        label='Today'
        onClick={() => {
          const start = moment().startOf('isoweek').isoWeekday(1);
          const end = moment(start).add(DAY_OFFSET, 'days');
          props.onSetActiveDate(start, end);
        }}
      />
    </div>
  );
};

export {TimeslipDateControls};
