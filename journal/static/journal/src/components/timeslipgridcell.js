import React from 'react';

import styles from './styles.css';

const TimeslipGridCell = (props) => {
  let hours = 0;
  if (props.timeslip) {
    hours = props.timeslip.get('hours');
  }

  return (
    <div className={styles.timeslipGridCell}>
      <input
        value={hours}
        onChange={(e) => props.hourChanged(e.target.value)} />
    </div>
  );
};

export {TimeslipGridCell};
