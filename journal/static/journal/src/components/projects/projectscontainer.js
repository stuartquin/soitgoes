'use strict';
import React from 'react';
import {connect} from 'react-redux';

import {ActivityFeedContainer} from '../activityfeed/activityfeedcontainer';
import * as projectActions from '../../actions/projects';

class Projects extends React.Component {
  componentDidMount() {
  }

  render() {
    return (
      <div className='row'>
        <div className='col-md-4'>
        </div>
        <div className='col-md-8'>
          <ActivityFeedContainer />
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
  ...projectActions
};

const ProjectsContainer = connect(mapStateToProps, actions)(Projects);
export {ProjectsContainer};
