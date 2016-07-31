import React from 'react';
import classNames from 'classnames/bind';


import styles from './styles.css';

const cx = classNames.bind(styles);


const TimeslipGridHeaderDate = (props) => {
  const date = props.date.format('D');
  const day = props.date.format('ddd').toLowerCase();

  const className = cx({
    timeslipGridHeaderDate: true,
    today: props.today === date,
    weekend: day === 'sun' || day === 'sat'
  });

  return (
    <td className={ className }>
      { date }
      <br />
      { day }
    </td>
  );
};

const TimeslipGridHeaderProjects = () => {
  return (
    <td className={ styles.timeslipGridHeaderProjects }>
    </td>
  );
};

const TimeslipGridHeader = (props) => {
  const today = props.today.format('D');
  return (
    <tr className={styles.timeslipGridHeader}>
      <TimeslipGridHeaderProjects />
      {props.range.map((date, index) => (
        <TimeslipGridHeaderDate
          key={index}
          today={today}
          date={date} />
      ))}
      <td>Total</td>
    </tr>
  );
};

export {TimeslipGridHeader};
