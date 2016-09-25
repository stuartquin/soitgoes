import React from 'react';
import classNames from 'classnames/bind';

import styles from './styles.css';

const cx = classNames.bind(styles);

const TimeslipGridCell = (props) => {
  const timeslip = props.timeslip;
  let hours;
  let isDisabled = props.isLoading;

  if (timeslip) {
    hours = timeslip.get('hours');
    isDisabled = isDisabled || Boolean(timeslip.get('invoice'));
  }

  const className = cx({
    timeslipGridCell: true
  });

  return (
    <td className={className}>
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
