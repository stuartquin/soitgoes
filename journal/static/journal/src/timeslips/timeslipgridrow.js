'use strict';
import React from 'react';
import {TimeslipGridCell} from './timeslipgridcell';

import styles from './styles.css';

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
  const filledTimeslips = props.timeslips.reduce( (result, item) => {
    result[item.get('date')] = item;
    return result;
  }, {});

  return (
    <tr className={styles.timeslipGridRow}>
      <td className={styles.timeslipGridRowProject}>{props.project.get('name')}</td>
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
      <td>{getUninvoicedTotal(props.timeslips)}</td>
    </tr>
  );
};

export {TimeslipGridRow};
