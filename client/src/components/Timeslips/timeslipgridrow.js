import React from 'react';
import styled from 'styled-components';
import {BREAKPOINTS} from 'components/Grid';

import TimeslipGridCell from './timeslipgridcell';

const Styled = styled.tr`
  &:hover {
    color: ${props => props.theme.primary.main};
  }
`;

const Task = styled.td`
  height: 60px;
  left: 0;
  position: absolute;
  top: auto;
  width: 240px;
  justify-content: flex-end;
  font-size: 16px;

  margin-top: 4px;
  margin-left: 8px;
  border-bottom: ${props => props.theme.grey.main} solid 1px;

  @media(max-width: ${BREAKPOINTS.sm}) {
    width: 140px;
    height: 40px;
    font-size: inherit;
  }
`;

const Project = styled.div`
  font-size: 0.75em;
  margin-top: 6px;
  color: ${props => props.theme.grey.dark};
  text-transform: uppercase;
`;

const TaskName = styled.div`
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  width: 100%;
`;

const TimeslipGridRow = ({
  task, range, timeslips, today, isLoading,
  onHourChanged, onSetActive
}) => {
  const dates = range.map((m) => m.format('YYYY-MM-DD'));
  const filledTimeslips = timeslips.reduce((result, item) => {
    result[item.date] = item;
    return result;
  }, {});

  return (
    <Styled>
      <Task>
        <TaskName>{task.name}</TaskName>
        <Project>{task.project.name}</Project>
      </Task>
      {dates.map((date) => (
        <TimeslipGridCell
          isLoading={isLoading}
          cellKey={`${task.id}|${date}`}
          date={date}
          today={today.format('YYYY-MM-DD')}
          onHourChanged={(value, timeslip) => {
            onHourChanged(task, date, value || 0 , timeslip);
          }}
          timeslip={filledTimeslips[date]}
          onSetActive={onSetActive}
        />
      ))}
    </Styled>
  );
};

export default TimeslipGridRow;
