'use strict';
import React from 'react';
import {connect} from 'react-redux';

class ActivityFeed extends React.Component {
  componentDidMount() {
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
};

const ActivityFeedContainer = connect(mapStateToProps, actions)(ActivityFeed);
export {ActivityFeedContainer};
