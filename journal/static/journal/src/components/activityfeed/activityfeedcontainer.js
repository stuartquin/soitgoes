'use strict';
import React from 'react';
import {connect} from 'react-redux';

import * as activityActions from '../../actions/activityfeed';

class ActivityFeed extends React.Component {
  componentDidMount() {
    this.props.fetchActivityFeed();
  }

  render() {
    return (
      <div>
        <h4>Activity Feed</h4>
      </div>
    );
  }
}

const mapStateToProps = (state, { params }) => {
  return {
  };
};

const actions = {
  ...activityActions
};

const ActivityFeedContainer = connect(mapStateToProps, actions)(ActivityFeed);
export {ActivityFeedContainer};
