'use strict';
import React from 'react';
import {connect} from 'react-redux';

import {Card, CardText} from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';

import ProjectsList from './projectslist';
import {fetchProjects} from 'modules/project';
import {fetchContacts} from 'modules/contact';
import { navigate } from 'modules/nav';

class Projects extends React.Component {
  componentDidMount() {
    this.props.fetchProjects();
    this.props.fetchContacts();
  }

  render() {
    const projects = this.props.projects.filter((p) => !p.get('archived'));
    const archived = this.props.projects.filter((p) => p.get('archived'));

    return (
      <div className='projects-container'>
        <div className='content'>
          <div className='content-actions'>
            <RaisedButton
              className='btn-success'
              label='Create New'
              labelPosition='before'
              onTouchTap={(evt) => {
                this.props.navigate('/projects/add');
              }}
            />
          </div>
          <Card>
            <CardText>
              <h3 className='invoice-list-header'>Active</h3>
              <ProjectsList
                contacts={this.props.contacts}
                projects={projects} />
              <h3 className='invoice-list-header'>Archived</h3>
              <ProjectsList
                contacts={this.props.contacts}
                projects={archived} />
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
  fetchProjects,
  navigate
};

const ProjectsContainer = connect(mapStateToProps, actions)(Projects);
export {ProjectsContainer};
