import React from 'react';
import moment from 'moment';

import {TimeslipGridHeader} from './timeslipgridheader';
import {TimeslipGridRow} from './timeslipgridrow';
import {TimeslipDateControls} from './timeslipdatecontrols';

const PAST_DAYS = 1;
const FUTURE_DAYS = 6;
const getDateRange = (today) => {
  'use strict';
  let start = today.subtract(PAST_DAYS, 'days');
  return Array.from(Array(PAST_DAYS + FUTURE_DAYS).keys()).map(i => {
    return moment(start.add(1, 'days'));
  });
};

const TimeslipGrid = (props) => {
  'use strict';
  const range = getDateRange(moment(props.activeDate));
  const today = moment();

  return (
    <div className='col-sm-12'>
      <TimeslipDateControls
        today={today}
        activeDate={props.activeDate}
        onSetActiveDate={props.onSetActiveDate}
      />
      <table>
        <thead>
          <TimeslipGridHeader today={today} range={range} />
        </thead>
        <tbody>
          {props.projects.map(project => (
            <TimeslipGridRow
              key={project.get('id')}
              project={project}
              today={today}
              range={range}
              onInvoice={() => {
                props.onInvoice(project);
              }}
              hourChanged={(hours, date) => {
                props.onHourChanged(project, date, hours);
              }} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export {TimeslipGrid};
