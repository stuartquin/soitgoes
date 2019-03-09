import React from 'react';
import styled from 'styled-components';
import moment from 'moment';

import TimeslipGridRow from './timeslipgridrow';
import TimeslipGridHeader from './timeslipgridheader';

import {BREAKPOINTS, Grid, Cell} from 'components/Grid';

const Styled = styled.div`
  width: 100%;
  color: #4e5767;
  position: relative;
`;

const Scroll = styled.div`
  overflow-x: auto;
  margin-left: 126px;
`;

const FUTURE_DAYS = 10;
const getDateRange = (today) => {
  const start = moment(today).subtract(1, 'days');
  return Array.from(Array(FUTURE_DAYS).keys()).map(() => {
    return moment(start.add(1, 'days'));
  });
};

const getTimeslipsForProject = (project, timeslips) => {
  const projectId = project.id;
  return timeslips.filter(t => t.project === projectId);
};

const TimeslipGrid = (props) => {
  const range = getDateRange(props.weekStart);
  const today = props.today;
  const projects = Object.values(props.projects).filter(
    p => p && !p.archived
  );

  return (
    <Styled>
      <Scroll>
        <table>
          <thead>
            <TimeslipGridHeader today={today} range={range} />
          </thead>
          <tbody>
            {projects.map(project => (
              <TimeslipGridRow
                key={project.id}
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
                }}
              />
            ))}
          </tbody>
        </table>
      </Scroll>
    </Styled>
  );
};

export {TimeslipGrid};
