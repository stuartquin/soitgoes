import React from 'react';
import styled, { css } from 'styled-components';
import moment from 'moment';
import { Text } from 'rebass';

import { BREAKPOINTS } from 'components/Grid';
import TimeslipDateControls from './timeslipdatecontrols';

const Date = styled.th`
  height: 40px;
  font-weight: 400;

  ${props =>
    props.today &&
    css`
      font-weight: 900;
    `}
`;

const Controls = styled.th`
  left: 0;
  position: absolute;
  top: auto;

  height: 42px;
  width: 240px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  @media (max-width: ${BREAKPOINTS.sm}) {
    width: 140px;
    height: 40px;
    font-size: inherit;
  }
`;

const TimeslipGridHeader = ({ weekStart, range, onSetActiveDate }) => {
  const today = moment().format('YYYY-MM-DD');
  return (
    <tr>
      <Controls>
        <Text pl={2} fontSize={14}>
          {weekStart.format('MMM YYYY')}
        </Text>
        <TimeslipDateControls
          weekStart={weekStart}
          onSetActiveDate={onSetActiveDate}
        />
      </Controls>
      {range.map((date, index) => (
        <Date key={date} xs="1" today={today === date.format('YYYY-MM-DD')}>
          <div>{date.format('D')}</div>
          <div>{date.format('ddd')}</div>
        </Date>
      ))}
      <th></th>
    </tr>
  );
};

export default TimeslipGridHeader;
