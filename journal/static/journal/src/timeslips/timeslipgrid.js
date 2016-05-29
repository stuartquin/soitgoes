import React from 'react';
import moment from 'moment';

import {TimeslipGridHeader} from './timeslipgridheader';
import {TimeslipGridRow} from './timeslipgridrow';

const PAST_DAYS = 10;
const FUTURE_DAYS = 2;
const getDateRange = (today) => {
  let start = today.subtract(PAST_DAYS, 'days');
  console.log('START', start);
  return Array.from(Array(PAST_DAYS + FUTURE_DAYS).keys()).map(i => {
    return moment(start.add(1, 'days'));
  });
};

const TimeslipGrid = (props) => {
  const range = getDateRange(moment());
  const today = moment();

  return (
    <div>
    <TimeslipGridHeader today={today} range={range} />
    {props.projects.map(project => (
      <TimeslipGridRow
        key={project.get('id')}
        project={project}
        today={today}
        range={range}
        hourChanged={(hours, date) => {
          props.onHourChanged(project, date, hours);
        }} />
    ))}
    </div>
  );
};

export {TimeslipGrid};
