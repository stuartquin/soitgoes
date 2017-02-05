import React from 'react';
import { browserHistory } from 'react-router';
import {Card, CardActions, CardHeader} from 'material-ui/Card';
import moment from 'moment';

const ProjectListRow = (props) => {
  const project = props.project;
  const contact = project.get('contact');

  const linkTo = (route) => () => {
    browserHistory.push(route);
  }

  return (
    <Card>
      <CardHeader
        title={project.get('name')}
        subtitle={contact.get('name')}
        onTouchTap={linkTo(`/projects/${project.get('id')}`)}
      />
      <CardActions>
      </CardActions>
    </Card>
  );
};

export {ProjectListRow};
