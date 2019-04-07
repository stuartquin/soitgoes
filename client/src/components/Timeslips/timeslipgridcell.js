import React from 'react';
import styled, {css} from 'styled-components';
import {BREAKPOINTS} from 'components/Grid';


const StyledInput = styled.input`
  width: 60px;
  height: 60px;
  border: solid 1px ${props => props.theme.grey.main};
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
    border-color: ${props.theme.grey.light}
  `}

  ${props => props.isSaved && css`
    background-color: #f4f6fa !important;
  `}

`;

class TimeslipGridCell extends React.Component {
  handleInputClick = () => {
    const {timeslip = {}} = this.props;
    const hours = timeslip ? timeslip.hours : null;

    if (!hours) {
      this.props.onHourChanged(8, timeslip);
    } else if (hours === 8) {
      this.props.onHourChanged(4, timeslip);
    }
  };

  render () {
    const {
      timeslip = {}, date, isLoading, onHourChanged
    } = this.props;
    const isDisabled = Boolean(timeslip.invoice);
    const day = (new Date(date)).getDay();
    const isWeekend = day === 0 || day === 6;

    return (
      <td>
        <StyledInput
          value={timeslip.hours || ''}
          isSaved={Boolean(timeslip.id)}
          type='number'
          onFocus={(e) => e.target.select()}
          disabled={isDisabled}
          onClick={this.handleInputClick}
          onChange={(e) => onHourChanged(e.target.value, timeslip)}
          isWeekend={isWeekend}
        />
      </td>
    );
  }
}

export default TimeslipGridCell;
