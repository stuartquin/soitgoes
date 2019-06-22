import React from 'react';
import styled from 'styled-components';
import {BREAKPOINTS} from 'components/Grid';

import TimeslipGridCell from './timeslipgridcell';

const Styled = styled.tr`
  &:hover {
    color: ${props => props.theme.primary.main};
  }
`;

const Project = styled.td`
  height: 60px;
  display: flex;
  align-items: center;
  left: 0;
  position: absolute;
  top: auto;
  width: 240px;
  justify-content: flex-end;
  font-weight: bold;
  font-size: 18px;

  @media(max-width: ${BREAKPOINTS.sm}) {
    width: 140px;
    height: 40px;
    font-size: inherit;
  }
`;

const TimeslipGridRow = ({
  project, range, timeslips, today, isLoading,
  activeCell, onHourChanged, onSetActive
}) => {
  const dates = range.map((m) => m.format('YYYY-MM-DD'));
  const filledTimeslips = timeslips.reduce((result, item) => {
    result[item.date] = item;
    return result;
  }, {});

  return (
    <Styled>
      <Project>{project.name}</Project>
      {dates.map((date) => (
        <TimeslipGridCell
          isLoading={isLoading}
          cellKey={`${project.id}|${date}`}
          date={date}
          today={today.format('YYYY-MM-DD')}
          onHourChanged={(value, timeslip) => {
            onHourChanged(value, date, timeslip);
          }}
          timeslip={filledTimeslips[date]}
          activeCell={activeCell}
          onSetActive={onSetActive}
          project={project}
        />
      ))}
    </Styled>
  );
};

export default TimeslipGridRow;
