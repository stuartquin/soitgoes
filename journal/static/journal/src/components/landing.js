import React from 'react';
import {connect} from 'react-redux';
import {TimeslipsContainer} from './timeslips';

class Landing extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
      return (
          <TimeslipsContainer />
      );
  }
}

const mapStateToProps = (state, props) => {
  return {};
};

const mapDispatchToProps = (dispatch, props) => {
  return {}
};

const LandingContainer = connect(mapStateToProps, mapDispatchToProps)(Landing);
export {LandingContainer};
