import React from 'react';
import moment from 'moment';
import styles from './styles.css';

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
      Projects
    </div>
  );
};

const TimeslipGridHeader = (props) => {
  return (<div className={styles.timeslipGridHeader}>
    <TimeslipGridHeaderProjects />
    {props.range.map((date, index) => (
      <TimeslipGridHeaderDate
        key={index}
        date={date} />
    ))}
  </div>);
};

export {TimeslipGridHeader};
