import Immutable from 'immutable';
import React from 'react';

import styles from './styles.css';

const groupByMonth = (dateRange) => {
  return dateRange.reduce((prev, current) => {
    const month = current.get('M');
    const list = prev.get(month, Immutable.List([]));
    return prev.set(month, list.push(current));
  }, Immutable.Map({})).toList();
};

const TimeslipGridHeaderDate = (props) => {
  const date = props.date.format('ddd Do');
  return (
    <td className={ styles.timeslipGridHeaderDate }>
      {date}
    </td>
  );
};

const TimeslipGridHeaderProjects = (props) => {
  return (
    <td className={ styles.timeslipGridHeaderProjects }>
    </td>
  );
};

const TimeslipGridHeader = (props) => {
  return (
    <tr className={styles.timeslipGridHeader}>
      <TimeslipGridHeaderProjects />
      {props.range.map((date, index) => (
        <TimeslipGridHeaderDate key={index} date={date} />
      ))}
    </tr>
  );
};

export {TimeslipGridHeader};
