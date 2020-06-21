import React from 'react';
import moment from 'moment';

const ActivityFeedTimeslip = (props) => {
  if (!props.timeslip) {
    return <div>Loading</div>;
  }

  const timeslip = props.timeslip;
  const hours = timeslip.get('hours');
  const date = timeslip.get('date');
  const project = props.project;
  return (
    <div className="panel">
      <div className="panel-body">
        <span className="glyphicon glyphicon-time"></span>
        <span>{` ${date}: ${hours} hours on ${project.get('name')}`}</span>
      </div>
    </div>
  );
};

export { ActivityFeedTimeslip };
