'use strict';
import React from 'react';
import moment from 'moment';

import styles from './styles.css';

export const getUninvoicedAmount = (project) => {
  return project.get('uninvoiced_hours') * project.get('hourly_rate');
};

const InvoiceInfo = (props) => {
  const project = props.project;

  let issued = 'Not issued yet';
  if (props.issued) {
    issued = moment(props.issued_at).format('YYYY-MM-DD');
  }

  return (
    <div>
      <div>
        <h4>Project</h4>
        { project.get('name') }
      </div>
      <div>
        <h4>Contact</h4>
        { project.get('contact').get('name') }
      </div>
      <div>
        <h4>Created</h4>
        { moment(props.created).format('YYYY-MM-DD') }
      </div>
      <div>
        <h4>Issued</h4>
        { issued }
      </div>
    </div>
  );
};

export {InvoiceInfo};
