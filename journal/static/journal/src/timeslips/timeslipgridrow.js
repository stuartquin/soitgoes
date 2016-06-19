'use strict';
import React from 'react';
import {TimeslipGridCell} from './timeslipgridcell';

import styles from './styles.css';

const getKey = (date, project) => {
  return project.get('id') + '|' + date;
};

const getUninvoicedTotal = (timeslips) => {
  return timeslips.reduce((previous, current) => {
    if (!current.get('invoice')) {
      return previous + parseInt(current.get('hours', 0));
    } else {
      return previous;
    }
  }, 0);
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
          date={date}
          today={props.today.format('YYYY-MM-DD')}
          hourChanged={(value) => {
            props.hourChanged(value, date);
          }}
          timeslip={filledTimeslips[date]} />
      ))}
      <div>{getUninvoicedTotal(props.project.get('timeslips'))}</div>
    </div>
  );
};

export {TimeslipGridRow};
