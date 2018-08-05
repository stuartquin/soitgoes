import React from 'react';
import classNames from 'classnames/bind';


const TimeslipGridHeaderDate = (props) => {
  const date = props.date.format('D');
  const day = props.date.format('ddd').toLowerCase();

  let classNames = ['timeslip-header-date'];
  if (props.today === date) {
    classNames.push('today');
  }
  if (day === 'sun' || day === 'sat') {
    classNames.push('weekend');
  }

  return (
    <th className={ classNames.join(' ') }>
      { date }
      <br />
      { day }
    </th>
  );
};

const TimeslipGridHeaderProjects = (props) => {
  const date = props.date.format('MMMM Y');
  return (
    <th className='timeslip-grid-header-projects'>
      <span className='text-muted'>{date}</span>
    </th>
  );
};

const TimeslipGridHeader = (props) => {
  const today = props.today.format('D');
  return (
    <tr className='timeslip-grid-header'>
      <th />
      {props.range.map((date, index) => (
        <TimeslipGridHeaderDate
          key={index}
          today={today}
          date={date} />
      ))}
      <th className='timeslip-grid-header-projects'>
        <span>Uninvoiced Hours</span>
      </th>
    </tr>
  );
};

export {TimeslipGridHeader};
