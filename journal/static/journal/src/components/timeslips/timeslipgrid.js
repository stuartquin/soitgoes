import React from 'react';
import moment from 'moment';

import {TimeslipGridHeader} from './timeslipgridheader';
import {TimeslipGridRow} from './timeslipgridrow';

import styles from './styles.css';

const FUTURE_DAYS = 7;
const getDateRange = (today) => {
  'use strict';
  const start = moment(today).subtract(1, 'days');
  return Array.from(Array(FUTURE_DAYS).keys()).map(() => {
    return moment(start.add(1, 'days'));
  });
};

const getTimeslipsForProject = (project, timeslips) => {
  const projectId = project.get('id');
  return timeslips.filter((t) => t.get('project') === projectId);
};

const TimeslipGrid = (props) => {
  'use strict';
  const range = getDateRange(props.weekStart);
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
                isLoading={props.isLoading}
                timeslips={getTimeslipsForProject(project, props.timeslips)}
                onInvoice={() => {
                  props.onInvoice(project);
                }}
                onHourChanged={(hours, date, timeslip) => {
                  props.onHourChanged(project, date, hours || 0, timeslip);
                }} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export {TimeslipGrid};
