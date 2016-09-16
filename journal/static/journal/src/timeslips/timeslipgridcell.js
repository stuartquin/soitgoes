import React from 'react';
import classNames from 'classnames/bind';

import styles from './styles.css';

const cx = classNames.bind(styles);

const TimeslipGridCell = (props) => {
  let hours;
  if (props.timeslip) {
    hours = props.timeslip.get('hours');
  }

  const className = cx({
    timeslipGridCell: true
  });

  return (
    <td className={className}>
      <input
        value={hours}
        type='number'
        onFocus={(e) => {
          e.target.select();
        }}
        onChange={(e) => props.hourChanged(e.target.value)} />
    </td>
  );
};

export {TimeslipGridCell};
