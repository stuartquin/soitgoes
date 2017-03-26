import React from 'react';
import classNames from 'classnames/bind';

const TimeslipGridCell = (props) => {
  const timeslip = props.timeslip;
  let hours;
  let isDisabled = props.isLoading;

  if (timeslip) {
    hours = timeslip.get('hours');
    isDisabled = isDisabled || Boolean(timeslip.get('invoice'));
  }

  return (
    <td className='timeslip-grid-cell'>
      <input
        value={hours || ''}
        type='number'
        onFocus={(e) => {
          e.target.select();
        }}
        disabled={ isDisabled }
        onChange={(e) => props.onHourChanged(e.target.value, timeslip)} />
    </td>
  );
};

export {TimeslipGridCell};
