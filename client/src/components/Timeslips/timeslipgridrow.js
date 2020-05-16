import React from 'react';
import styled, { css } from 'styled-components';
import { Text, Box } from 'rebass/styled-components';
import { BREAKPOINTS } from 'components/Grid';

import TimeslipGridCell from './timeslipgridcell';

const Styled = styled.tr`
  &:hover {
    color: ${props => props.theme.colors.primary_main};
  }
`;

const Task = styled.td`
  height: 60px;
  left: 0;
  position: absolute;
  top: auto;
  width: 240px;
  font-size: 16px;

  padding-top: 4px;
  padding-left: 8px;
  border-bottom: ${props => props.theme.colors.grey_main} solid 1px;

  display: flex;
  flex-direction: column;
  justify-content: center;

  ${props =>
    props.fixed &&
    css`
      background: ${props => props.theme.colors.warning_lightest};
      border-bottom: ${props => props.theme.colors.warning_light} solid 1px;
    `}

  @media(max-width: ${BREAKPOINTS.sm}) {
    width: 140px;
    height: 40px;
    font-size: inherit;
  }
`;

const Project = styled.div`
  font-size: 0.75em;
  margin-top: 6px;
  color: ${props => props.theme.colors.grey_dark};
  text-transform: uppercase;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
`;

const TaskName = styled(Text)`
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  width: 100%;
`;

const TimeslipGridRow = ({
  task,
  range,
  timeslips,
  today,
  isLoading,
  onHourChanged,
  onSetActive,
}) => {
  const dates = range.map(m => m.format('YYYY-MM-DD'));
  const filledTimeslips = timeslips.reduce((result, item) => {
    result[item.date] = item;
    return result;
  }, {});

  const total = Object.values(filledTimeslips).reduce(
    (acc, { hours }) => acc + parseInt(hours, 10),
    0
  );

  return (
    <Styled>
      <Task fixed={task.billing_type === 'FIXED'}>
        <Box variant="ellipsis">
          <TaskName variant="title">{task.name}</TaskName>
          <Text variant="subTitle">{task.project.name}</Text>
        </Box>
      </Task>
      {dates.map(date => (
        <TimeslipGridCell
          key={date}
          isLoading={isLoading}
          cellKey={`${task.id}|${date}`}
          date={date}
          today={today.format('YYYY-MM-DD')}
          onHourChanged={(value, timeslip) => {
            onHourChanged(task, date, value || 0, timeslip);
          }}
          timeslip={filledTimeslips[date]}
          onSetActive={onSetActive}
        />
      ))}
      {total > 0 && <td>{total}</td>}
    </Styled>
  );
};

export default TimeslipGridRow;
