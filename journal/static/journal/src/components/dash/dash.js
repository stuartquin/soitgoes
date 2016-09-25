'use strict';
import React from 'react';
import {connect} from 'react-redux';

import * as projectActions from '../../actions/projects';

class Dash extends React.Component {
  componentDidMount() {
  }

  render() {
    return (
      <div className='row'>
        <div className='col-md-4'>
        </div>
        <div className='col-md-8'>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, { params }) => {
  return {
  };
};

const actions = {
};

const DashContainer = connect(mapStateToProps, actions)(Dash);
export {DashContainer};
