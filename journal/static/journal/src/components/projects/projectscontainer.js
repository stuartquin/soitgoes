'use strict';
import React from 'react';
import {connect} from 'react-redux';
import { browserHistory } from 'react-router';

import {Card, CardText} from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';

import {ProjectsList} from './projectslist';
import * as projectActions from '../../actions/projects';

class Projects extends React.Component {
  componentDidMount() {
    this.props.fetchProjects();
  }

  render() {
    return (
      <div className='projects-container'>
        <div className='content'>
          <div className='content-actions'>
            <RaisedButton
              className='btn-success'
              label='Create New'
              labelPosition='before'
              onTouchTap={(evt) => {
                browserHistory.push('/projects/add');
              }}
            />
          </div>
          <Card>
            <CardText>
              <ProjectsList
                projects={this.props.projects} />
            </CardText>
          </Card>
        </div>
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
