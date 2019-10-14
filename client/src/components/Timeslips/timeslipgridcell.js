import React from 'react';
import styled, {css} from 'styled-components';
import {BREAKPOINTS} from 'components/Grid';
import TimeslipDetail from './TimeslipDetail';

const StyledInput = styled.input`
  width: 60px;
  height: 60px;
  border: solid 1px ${props => props.theme.colors.grey_main};
  text-align: center;
  cursor: pointer;
  font-size: 18px;

  @media(max-width: ${BREAKPOINTS.sm}) {
    width: 40px;
    height: 40px;
    font-size: inherit;
  }

  &::-webkit-inner-spin-button,
  &::-webkit-outer-spin-button {
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    margin: 0;
  }

  &:not([value=""]) {
    background: #ccedc9;
  }

  ${props => props.isWeekend && css`
    border-color: ${props.theme.colors.grey_light}
  `}

  ${props => props.isSaved && css`
    background-color: #f4f6fa !important;
  `}
`;

const TimeslipGridCell = ({
  timeslip = {}, cellKey, date, isLoading, onHourChanged, onSetActive
}) => {
  const isDisabled = Boolean(timeslip.invoice);
  const day = (new Date(date)).getDay();
  const isWeekend = day === 0 || day === 6;
  const handleInputClick = () => {
    const hours = timeslip ? timeslip.hours : null;
    if (!hours) {
      onHourChanged(8, timeslip);
    } else if (hours === 8) {
      onHourChanged(4, timeslip);
    }
  };

  return (
    <td>
      <StyledInput
        value={timeslip.hours || ''}
        isSaved={Boolean(timeslip.id)}
        type='number'
        onFocus={(e) => e.target.select()}
        disabled={isDisabled}
        onClick={handleInputClick}
        onChange={(e) => onHourChanged(e.target.value, timeslip)}
        onFocus={() => onSetActive(cellKey)}
        isWeekend={isWeekend}
      />
    </td>
  );
};

export default TimeslipGridCell;
