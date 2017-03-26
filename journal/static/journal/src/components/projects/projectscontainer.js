'use strict';
import React from 'react';
import {connect} from 'react-redux';
import { browserHistory } from 'react-router';

import {Card, CardText} from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';

import ProjectsList from './projectslist';
import {fetchProjects} from 'modules/project';
import {fetchContacts} from 'modules/contact';

class Projects extends React.Component {
  componentDidMount() {
    this.props.fetchProjects();
    this.props.fetchContacts();
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
                contacts={this.props.contacts}
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
    projects: state.projects.items,
    contacts: state.contacts.items
  };
};

const actions = {
  fetchContacts,
  fetchProjects
};

const ProjectsContainer = connect(mapStateToProps, actions)(Projects);
export {ProjectsContainer};
