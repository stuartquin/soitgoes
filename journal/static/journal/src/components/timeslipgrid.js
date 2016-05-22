import React from 'react';
import moment from 'moment';

import {TimeslipGridHeader} from './timeslipgridheader';
import {TimeslipGridRow} from './timeslipgridrow';

const PAST_DAYS = 10;
const FUTURE_DAYS = 2;
const getDateRange = (today) => {
  let start = today.subtract(PAST_DAYS);
  return Array.from(Array(PAST_DAYS + FUTURE_DAYS).keys()).map(i => {
    return moment(start.add(1, 'days'));
  });
};

const TimeslipGrid = (props) => {
  const today = moment().subtract(10, 'days');
  const range = getDateRange(today);

  return (
    <div>
    <TimeslipGridHeader today={today} range={range} />
    {props.projects.map(project => (
      <TimeslipGridRow
        key={project.get('id')}
        project={project}
        today={today}
        range={range} />
    ))}
    </div>
  );
};

export {TimeslipGrid};
