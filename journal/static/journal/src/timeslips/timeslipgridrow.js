'use strict';
import React from 'react';
import {TimeslipGridCell} from './timeslipgridcell';

import styles from './styles.css';

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
          isLoading={props.isLoading}
          key={date}
          date={date}
          today={props.today.format('YYYY-MM-DD')}
          hourChanged={(value) => {
            props.hourChanged(value, date);
          }}
          timeslip={filledTimeslips[date]} />
      ))}
      <td>{props.project.get('uninvoiced_hours')}</td>
    </tr>
  );
};

export {TimeslipGridRow};
