'use strict';
import React from 'react';
import {connect} from 'react-redux';

import {TimeslipsContainer} from '../timeslips/timeslipcontainer';

import * as projectActions from '../../actions/projects';

class Project extends React.Component {
  componentDidMount() {
    if (!this.props.project && this.props.id !== 'add') {
      this.props.fetchProjects();
    }
  }

  render() {
    const project = this.props.project;
    if (!project) {
      return (<h3>Loading</h3>);
    }
    const crumbs = [
      {route: '/projects', title: 'Projects'}
    ]

    return (
      <div className='project-container'>
        <TimeslipsContainer
          projects={[project]}
        />
      </div>
    );
  }
}

const mapStateToProps = (state, { params }) => {
  return {
    project: state.projects.items.get(parseInt(params.id, 10)),
  };
};

const actions = {
  ...projectActions
};

const ProjectContainer = connect(mapStateToProps, actions)(Project);
export {ProjectContainer};
