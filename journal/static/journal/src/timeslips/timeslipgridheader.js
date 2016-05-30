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
    <div className={ styles.timeslipGridHeaderDate }>
      {date}
    </div>
  );
};

const TimeslipGridHeaderProjects = (props) => {
  return (
    <div className={ styles.timeslipGridHeaderProjects }>
    </div>
  );
};

const TimeslipGridHeaderMonth = (props) => {
  const month = props.range.get(0).format('MMMM');

  return (
    <div className={ styles.monthRow }>
      <div className={ styles.monthName }>
        {month}
      </div>

      <div className={ styles.dayRow }>
        {props.range.map((date, index) => (
          <TimeslipGridHeaderDate
            key={index}
            date={date} />
        ))}
      </div>
    </div>
  );
};

const TimeslipGridHeader = (props) => {
  const range = groupByMonth(props.range);

  return (<div className={styles.timeslipGridHeader}>
    <TimeslipGridHeaderProjects />
    {range.map((month, index) => (
      <TimeslipGridHeaderMonth key={index} range={month} />
    ))}
  </div>);
};

export {TimeslipGridHeader};
