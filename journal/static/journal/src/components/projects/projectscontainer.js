'use strict';
import React from 'react';
import {connect} from 'react-redux';

import {ActivityFeedContainer} from '../activityfeed/activityfeedcontainer';
import * as projectActions from '../../actions/projects';

class Projects extends React.Component {
  componentDidMount() {
    this.props.fetchProjects();
  }

  render() {
    if (this.props.projects) {
      return (
        <div className='row'>
          <div className='col-md-4'>
          </div>
          <div className='col-md-8'>
            <ActivityFeedContainer
              projects={this.props.projects}
            />
          </div>
        </div>
      );
    } else {
      return (<div>Loading</div>);
    }
  }
}

const mapStateToProps = (state, { params }) => {
  return {
    projects: state.projects.items
  };
};

const actions = {
  ...projectActions
};

const ProjectsContainer = connect(mapStateToProps, actions)(Projects);
export {ProjectsContainer};
