import React from 'react';
import styled from 'styled-components';

const Date = styled.th`
  height: 40px;
`;

const TimeslipGridHeader = (props) => {
  const today = props.today.format('D');
  return (
    <tr>
      <th />
      {props.range.map((date, index) => (
        <Date xs="1">
          <div>{date.format('D')}</div>
          <div>{date.format('ddd')}</div>
        </Date>
      ))}
    </tr>
  );
};

export default TimeslipGridHeader;
