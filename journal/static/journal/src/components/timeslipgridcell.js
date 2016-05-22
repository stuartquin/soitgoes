import React from 'react';

import styles from './styles.css';

const TimeslipGridCell = (props) => {
  let hours = 0;
  if (props.timeslip) {
    hours = props.timeslip.get('hours');
  }
  return (
    <div className={styles.timeslipGridCell}>
      <input value={hours} />
    </div>
  );
};

export {TimeslipGridCell};
