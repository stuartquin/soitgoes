import React from 'react';
import moment from 'moment';

const ActivityFeedInvoice = (props) => {
  const item = props.item;
  const date = moment(item.get('created_at')).format('YYYY-DD-MM');
  const project = props.project;

  return (
    <div className="panel">
      <div className="panel-body">
        <span className="glyphicon glyphicon-gbp"></span>
        <span>{` ${date}: Invoice for ${project.get('name')}`}</span>
      </div>
    </div>
  );
};

export { ActivityFeedInvoice };
