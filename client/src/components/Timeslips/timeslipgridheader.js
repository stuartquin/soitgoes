import React from 'react';
import styled from 'styled-components';

import {BREAKPOINTS} from 'components/Grid';
import TimeslipDateControls from './timeslipdatecontrols';

const Date = styled.th`
  height: 40px;
`;

const Controls = styled.th`
  left: 0;
  position: absolute;
  top: auto;

  height: 42px;
  width: 240px;
  display: flex;
  justify-content: flex-end;
  align-items: center;

  @media(max-width: ${BREAKPOINTS.sm}) {
    width: 140px;
    height: 40px;
    font-size: inherit;
  }
`;

const Month = styled.div`
  @media(max-width: ${BREAKPOINTS.sm}) {
    width: 50px;
    text-align: center;
  }
`;

const TimeslipGridHeader = ({weekStart, range, onSetActiveDate}) => {
  return (
    <tr>
      <Controls>
        <Month>{weekStart.format('MMM YYYY')}</Month>
        <TimeslipDateControls
          weekStart={weekStart}
          onSetActiveDate={onSetActiveDate}
        />
      </Controls>
      {range.map((date, index) => (
        <Date xs="1">
          <div>{date.format('D')}</div>
          <div>{date.format('ddd')}</div>
        </Date>
      ))}
    </tr>
  );
};

export default TimeslipGridHeader;
