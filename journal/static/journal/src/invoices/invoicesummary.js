'use strict';
import React from 'react';

import { InvoiceSummaryRow } from './invoicesummaryrow';


const InvoiceSummary = (props) => {
  const project = props.project;

  return (
    <table className='table table-striped'>
    <tbody>
      <InvoiceSummaryRow
        key={0}
        name='Timeslips'
        value={'£' + props.timeslipTotal}
      />
      <InvoiceSummaryRow
        key={1}
        name='Additional'
        value={'£' + props.additionalTotal}
      />
      {props.invoice.get('modifier').map((modifier) => (
        <InvoiceSummaryRow
          key={2 + modifier.get('id')}
          name={modifier.get('name')}
          value={modifier.get('percent') + '%'}
        />
      ))}

      <InvoiceSummaryRow
        name='Total'
        value={'£' + props.total}
      />
    </tbody>
    </table>
  );
};

export {InvoiceSummary};
