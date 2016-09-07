import React from 'react';
import moment from 'moment';

import {TimeslipGridHeader} from './timeslipgridheader';
import {TimeslipGridRow} from './timeslipgridrow';

import styles from './styles.css';

const PAST_DAYS = 1;
const FUTURE_DAYS = 6;
const getDateRange = (today) => {
  'use strict';
  let start = today.subtract(PAST_DAYS, 'days');
  return Array.from(Array(PAST_DAYS + FUTURE_DAYS).keys()).map(() => {
    return moment(start.add(1, 'days'));
  });
};

const TimeslipGrid = (props) => {
  'use strict';
  const range = getDateRange(moment(props.activeDate));
  const today = props.today;
  const className = `${styles.timeslipGrid} col-md-12`;

  return (
    <div className={className}>

      <div className='table-responsive'>
        <table className='table table-striped'>
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
                  props.onHourChanged(project, date, hours || 0);
                }} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export {TimeslipGrid};
