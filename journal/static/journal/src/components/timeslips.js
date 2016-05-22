import React from 'react';
import {connect} from 'react-redux';
import {getTimeslips} from '../actions/timeslips';

class Timeslips extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <h2 onClick={this.props.onLoad}>TimeSlips</h2>
    );
  }
}

const mapStateToProps = (state, props) => {
  return {};
};

const mapDispatchToProps = (dispatch, props) => {
  return {
      onLoad: () => {
        dispatch(getTimeslips(1));
      }
  }
};

const TimeslipsContainer = connect(mapStateToProps, mapDispatchToProps)(Timeslips);
export {TimeslipsContainer};
