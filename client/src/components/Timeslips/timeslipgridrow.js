import React from 'react';
import styled from 'styled-components';

import TimeslipGridCell from './timeslipgridcell';

const Project = styled.td`
  height: 40px;
  display: flex;
  align-items: center;
  left: 0;
  position: absolute;
  top: auto;
  width: 116px;
  justify-content: flex-end;
`;

const TimeslipGridRow = ({
  project, range, timeslips, today, isLoading, onHourChanged
}) => {
  const dates = range.map((m) => m.format('YYYY-MM-DD'));
  const filledTimeslips = timeslips.reduce((result, item) => {
    result[item.date] = item;
    return result;
  }, {});

  return (
    <tr>
      <Project>{project.name}</Project>
      {dates.map((date) => (
        <TimeslipGridCell
          isLoading={isLoading}
          key={date}
          date={date}
          today={today.format('YYYY-MM-DD')}
          onHourChanged={(value, timeslip) => {
            onHourChanged(value, date, timeslip);
          }}
          timeslip={filledTimeslips[date]}
        />
      ))}
    </tr>
  );
};

export default TimeslipGridRow;
