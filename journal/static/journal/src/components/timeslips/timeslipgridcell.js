import React from 'react';
import classNames from 'classnames/bind';
import { isMobile } from "services/environment";

const MobileGridCell = ({ hours, onClick }) => {
  return (
    <div className="mobile-grid-cell" onClick={onClick}>
      {hours}
    </div>
  );
};

class TimeslipGridCell extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      showInput: !isMobile()
    };
  }

  handleMobile = () => {
    const { timeslip } = this.props;
    const hours = timeslip ? timeslip.get('hours') : null;

    if (!hours) {
      this.props.onHourChanged(8, timeslip);
    } else if (hours === 8) {
      this.props.onHourChanged(4, timeslip);
    } else {
      this.props.onHourChanged(1, timeslip);
      this.setState({ showInput: true });
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

    const inputField = isMobile() && !isDisabled && !this.state.showInput ? (
      <MobileGridCell
        onClick={this.handleMobile}
        hours={hours}
      />
    ): (
      <input
        value={hours || ''}
        type='number'
        onFocus={(e) => {
          e.target.select();
        }}
        disabled={ isDisabled }
        onChange={(e) => this.props.onHourChanged(e.target.value, timeslip)}
      />
    );

    return (
      <td className='timeslip-grid-cell'>
        {inputField}
      </td>
    );
  }
}

export {TimeslipGridCell};
