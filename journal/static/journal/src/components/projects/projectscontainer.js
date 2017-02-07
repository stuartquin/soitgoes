'use strict';
import React from 'react';
import {connect} from 'react-redux';

import {ProjectListRow} from './projectslistrow';
import {HeaderBar} from '../nav/headerbar';
import * as projectActions from '../../actions/projects';

class Projects extends React.Component {
  componentDidMount() {
    this.props.fetchProjects();
  }

  render() {
    return (
      <div className='projects-container'>
        <HeaderBar
          title='Projects'
        />

      {this.props.projects.map(p => (
        <ProjectListRow
          project={p}
        />
      ))}
      </div>
    );
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
