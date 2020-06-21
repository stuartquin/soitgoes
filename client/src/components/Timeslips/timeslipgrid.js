import React, { useState } from 'react';
import styled from 'styled-components';
import moment from 'moment';

import TimeslipGridRow from './timeslipgridrow';
import TimeslipGridHeader from './timeslipgridheader';

import { BREAKPOINTS } from 'components/Grid';

const Styled = styled.div`
  flex-grow: 1;
  position: relative;
  background: ${(props) => props.theme.colors.grey_lightest};
  @media (max-width: ${BREAKPOINTS.sm}) {
    width: 100%;
  }
`;

const Scroll = styled.div`
  overflow-x: auto;
  margin-left: 248px;
  background: #f5f3f5;
  padding-top: 12px;
  padding-bottom: 12px;

  @media (max-width: ${BREAKPOINTS.sm}) {
    margin-left: 148px;
  }
`;

const FUTURE_DAYS = 7;
const getDateRange = (today) => {
  const start = moment(today).subtract(1, 'days');
  return Array.from(Array(FUTURE_DAYS).keys()).map(() => {
    return moment(start.add(1, 'days'));
  });
};

const getTimeslipsForProject = (project, timeslips) => {
  const projectId = project.id;
  return timeslips.filter((t) => t.project === projectId);
};

const getTimeslipsForTask = (task, timeslips) =>
  timeslips.filter((t) => t.task === task.id);

const TimeslipGrid = ({
  onSetActiveDate,
  projects,
  tasks,
  today,
  weekStart,
  isLoading,
  timeslips,
  onHourChanged,
}) => {
  const range = getDateRange(weekStart);
  const filteredTasks = tasks.filter(
    (t) => !t.project.archived && t.state === 'OPEN'
  );
  const [activeCell, setActiveCell] = useState(null);

  return (
    <Styled>
      <Scroll>
        <table>
          <thead>
            <TimeslipGridHeader
              weekStart={weekStart}
              range={range}
              onSetActiveDate={onSetActiveDate}
            />
          </thead>
          <tbody>
            {filteredTasks.map((task) => (
              <TimeslipGridRow
                key={task.id}
                task={task}
                today={today}
                range={range}
                activeCell={activeCell}
                isLoading={isLoading}
                timeslips={getTimeslipsForTask(task, timeslips)}
                onHourChanged={onHourChanged}
                onSetActive={setActiveCell}
              />
            ))}
          </tbody>
        </table>
      </Scroll>
    </Styled>
  );
};

export default TimeslipGrid;
