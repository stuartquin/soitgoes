import React from 'react';
import styled from 'styled-components';
import classNames from 'classnames/bind';
import { isMobile } from "services/environment";


const StyledInput = styled.input`
  width: 80px;

  &::-webkit-inner-spin-button,
  &::-webkit-outer-spin-button {
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    margin: 0;
  }
`;

class TimeslipGridCell extends React.Component {
  handleInputClick = () => {
    const { timeslip} = this.props;
    const hours = timeslip ? timeslip.hours : null;

    if (!hours) {
      this.props.onHourChanged(8, timeslip);
    } else if (hours === 8) {
      this.props.onHourChanged(4, timeslip);
    }
  };

  render () {
    const timeslip = this.props.timeslip;
    let hours;
    let isDisabled = this.props.isLoading;

    if (timeslip) {
      hours = timeslip.hours;
      isDisabled = isDisabled || Boolean(timeslip.invoice);
    }

    return (
      <td className='timeslip-grid-cell'>
      <StyledInput
        value={hours || ''}
        type='number'
        onFocus={(e) => e.target.select()}
        disabled={ isDisabled }
        onClick={this.handleInputClick}
        onChange={(e) => this.props.onHourChanged(e.target.value, timeslip)}
      />
      </td>
    );
  }
}

export {TimeslipGridCell};
