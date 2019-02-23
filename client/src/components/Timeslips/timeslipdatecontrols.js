import React from 'react';
import moment from 'moment';

import Button from 'components/Button';

// How many days to jump
const DAY_OFFSET = 7;


const TimeslipDateControls = ({weekStart, today, onSetActiveDate}) => {
  const disabled = weekStart.isSame(today, 'isoweek');

  return (
    <div className='timeslip-date-controls'>
      <Button
        className='btn-default date-control'
        label='<'
        onClick={() => {
          onSetActiveDate(moment(weekStart).subtract(DAY_OFFSET, 'days'));
        }}
      />
      <Button
        className='btn-default date-control'
        label='>'
        onClick={() => {
          onSetActiveDate(moment(weekStart).add(DAY_OFFSET, 'days'));
        }}
      />
      <Button
        className='btn-default'
        disabled={disabled}
        label='Today'
        onClick={() => {
          onSetActiveDate(moment());
        }}
      />
    </div>
  );
};

export {TimeslipDateControls};
