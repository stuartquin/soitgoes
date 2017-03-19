'use strict';
import React from 'react';
import {connect} from 'react-redux';

import {TimeslipsContainer} from '../timeslips/timeslipcontainer';
import {ProjectForm} from './projectform';
import { Loading } from '../loading';

import {fetchContacts} from 'modules/contact';
import {fetchProjects, addProject} from 'modules/project';


class Project extends React.Component {
  componentDidMount() {
    this.props.fetchProjects();
    this.props.fetchContacts();
  }

  render() {
    const project = this.props.project;
    const contacts = this.props.contacts;
    const isEdit = this.props.id !== 'add';
    const loading = (isEdit && (!project || project.isEmpty()));

    if (loading) {
      return (<Loading />);
    }

    let save = (form) => {
      if (isEdit) {
        console.log('Update Project', form);
      } else {
        this.props.addProject(form);
      }
    };

    return (
      <div className='project-container'>
        <div className='header'>
        </div>
        <div className='content'>
          <ProjectForm
            isEdit={isEdit}
            contacts={contacts}
            project={project}
            onSave={(form) => save(form)} />
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, { params }) => {
  const id = parseInt(params.id, 10);

  return {
    id: params.id,
    project: state.projects.items.get(id),
    contacts: state.contacts.items
  };
};

const actions = {
  addProject,
  fetchProjects,
  fetchContacts
};

const ProjectContainer = connect(mapStateToProps, actions)(Project);
export {ProjectContainer};
