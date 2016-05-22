import React from 'react';
import {TimeslipGridCell} from './timeslipgridcell';

import styles from './styles.css';

const getKey = (date, project) => {
  return project.get('id') + '|' + date;
};

const TimeslipGridRow = (props) => {
  const dates = props.range.map((m) => m.format('YYYY-MM-DD'));
  const filledTimeslips = props.project.get('timeslips').reduce( (result, item) => {
    result[item.get('date')] = item;
    return result;
  }, {});

  return (
    <div className={styles.timeslipGridRow}>
      <div className={styles.timeslipGridRowProject}>{props.project.get('name')}</div>
      {dates.map((date, index) => (
        <TimeslipGridCell
          key={date}
          timeslip={filledTimeslips[date]} />
      ))}
    </div>
  );
};

export {TimeslipGridRow};
