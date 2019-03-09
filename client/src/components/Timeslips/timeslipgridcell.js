import React from 'react';
import styled, {css} from 'styled-components';
import {Cell} from 'components/Grid';


const StyledInput = styled.input`
  width: 40px;
  height: 40px;
  border: none;
  text-align: center;

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
    const {timeslip = {}, isLoading} = this.props;
    const isDisabled = Boolean(timeslip.invoice);

    return (
      <td>
        <StyledInput
          value={timeslip.hours || ''}
          isSaved={Boolean(timeslip.id)}
          type='number'
          onFocus={(e) => e.target.select()}
          disabled={isDisabled}
          onClick={this.handleInputClick}
          onChange={(e) => this.props.onHourChanged(e.target.value, timeslip)}
        />
      </td>
    );
  }
}

export default TimeslipGridCell;
