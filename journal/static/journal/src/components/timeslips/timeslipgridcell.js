import React from 'react';
import classNames from 'classnames/bind';
import { isMobile } from "services/environment";

class TimeslipGridCell extends React.Component {
  handleInputClick = () => {
    const { timeslip } = this.props;
    const hours = timeslip ? timeslip.get('hours') : null;

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
      hours = timeslip.get('hours');
      isDisabled = isDisabled || Boolean(timeslip.get('invoice'));
    }

    return (
      <td className='timeslip-grid-cell'>
      <input
        value={hours || ''}
        type='number'
        onFocus={(e) => {
          e.target.select();
        }}
        disabled={ isDisabled }
        onClick={this.handleInputClick}
        onChange={(e) => this.props.onHourChanged(e.target.value, timeslip)}
      />
      </td>
    );
  }
}

export {TimeslipGridCell};
